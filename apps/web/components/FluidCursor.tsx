'use client'

import { useEffect, useRef } from 'react'

const SIM_RES = 128
const DYE_RES = 512
const LENS_SIZE = 340
const half = LENS_SIZE / 2

// Radial gradient mask: white at centre → transparent at edge. Computed once.
function buildLensMask(size: number): string {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  const g = ctx.createRadialGradient(h, h, 0, h, h, h)
  g.addColorStop(0,    'rgba(255,255,255,1)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.7)')
  g.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return c.toDataURL()
}

// ─── WebGL helpers ────────────────────────────────────────────────────────────

const VS = `#version 300 es
in vec2 a_pos; out vec2 v_uv;
void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }`

const ADVECT_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_velocity, u_quantity;
uniform float u_dt, u_dissipation;
out vec4 fragColor;
void main() {
  fragColor = u_dissipation * texture(u_quantity, v_uv - texture(u_velocity, v_uv).xy * u_dt);
}`

const SPLAT_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_base;
uniform vec2 u_center; uniform vec3 u_color;
uniform float u_radius, u_ratio;
out vec4 fragColor;
void main() {
  vec2 p = v_uv - u_center; p.x *= u_ratio;
  fragColor = vec4(texture(u_base, v_uv).rgb + u_color * exp(-dot(p,p)/u_radius), 1.0);
}`

const DISPLAY_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_dye;
out vec4 fragColor;
void main() {
  vec3 c = texture(u_dye, v_uv).rgb;
  float b = length(c);
  fragColor = vec4(c, clamp(b * b * 7.0, 0.0, 0.30));
}`

function mkShader(gl: WebGL2RenderingContext, type: GLenum, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src); gl.compileShader(s); return s
}
function mkProg(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!
  gl.attachShader(p, mkShader(gl, gl.VERTEX_SHADER, vs))
  gl.attachShader(p, mkShader(gl, gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(p); return p
}

interface FBO { tex: WebGLTexture; fbo: WebGLFramebuffer }
function mkFBO(gl: WebGL2RenderingContext, w: number, h: number): FBO {
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const fbo = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { tex, fbo }
}
class DoubleFBO {
  private a: FBO; private b: FBO
  constructor(gl: WebGL2RenderingContext, w: number, h: number) {
    this.a = mkFBO(gl, w, h); this.b = mkFBO(gl, w, h)
  }
  get read() { return this.a }
  get write() { return this.b }
  swap() { [this.a, this.b] = [this.b, this.a] }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dispRef   = useRef<SVGFEDisplacementMapElement>(null)
  const turbRef   = useRef<SVGFETurbulenceElement>(null)
  const imgRef    = useRef<SVGFEImageElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false })
    if (!gl || !gl.getExtension('EXT_color_buffer_half_float')) return

    // Build lens mask once and set on feImage
    if (imgRef.current) imgRef.current.setAttribute('href', buildLensMask(LENS_SIZE))

    // Apply warp filter to entire page so aurora background is also distorted
    const root = document.documentElement
    root.style.filter = 'url(#fluid-warp)'

    const advectProg  = mkProg(gl, VS, ADVECT_FS)
    const splatProg   = mkProg(gl, VS, SPLAT_FS)
    const displayProg = mkProg(gl, VS, DISPLAY_FS)

    const quadBuf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    function bindQuad(prog: WebGLProgram) {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
      const loc = gl.getAttribLocation(prog, 'a_pos')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    }

    const velocity = new DoubleFBO(gl, SIM_RES, SIM_RES)
    const dye      = new DoubleFBO(gl, DYE_RES, DYE_RES)

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function splat(t: DoubleFBO, w: number, h: number, cx: number, cy: number, color: [number, number, number], r: number) {
      gl.useProgram(splatProg); bindQuad(splatProg)
      gl.uniform1i(gl.getUniformLocation(splatProg, 'u_base'), 0)
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t.read.tex)
      gl.uniform2f(gl.getUniformLocation(splatProg, 'u_center'), cx, cy)
      gl.uniform3f(gl.getUniformLocation(splatProg, 'u_color'), ...color)
      gl.uniform1f(gl.getUniformLocation(splatProg, 'u_radius'), r)
      gl.uniform1f(gl.getUniformLocation(splatProg, 'u_ratio'), canvas.width / canvas.height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.write.fbo)
      gl.viewport(0, 0, w, h); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); t.swap()
    }

    function advect(vel: DoubleFBO, src: DoubleFBO, w: number, h: number, dt: number, diss: number) {
      gl.useProgram(advectProg); bindQuad(advectProg)
      gl.uniform1i(gl.getUniformLocation(advectProg, 'u_velocity'), 0)
      gl.uniform1i(gl.getUniformLocation(advectProg, 'u_quantity'), 1)
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, vel.read.tex)
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, src.read.tex)
      gl.uniform1f(gl.getUniformLocation(advectProg, 'u_dt'), dt)
      gl.uniform1f(gl.getUniformLocation(advectProg, 'u_dissipation'), diss)
      gl.bindFramebuffer(gl.FRAMEBUFFER, src.write.fbo)
      gl.viewport(0, 0, w, h); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); src.swap()
    }

    let mx = 0, my = 0, px = -1, py = -1, moved = false
    let dispScale = 0, targetScale = 0
    let seed = 1, seedAccum = 0

    function onMove(e: MouseEvent) {
      mx = e.clientX / canvas.width
      my = 1 - e.clientY / canvas.height
      moved = true

      // Move only the feImage mask — filter region stays full-page
      imgRef.current?.setAttribute('x', String(e.clientX - half))
      imgRef.current?.setAttribute('y', String(e.clientY - half))
    }
    window.addEventListener('mousemove', onMove)

    let last = performance.now(), raf: number

    function loop() {
      raf = requestAnimationFrame(loop)
      const now = performance.now()
      const dt  = Math.min((now - last) / 1000, 0.016)
      last = now

      let speed = 0
      if (moved) {
        const dx = px < 0 ? 0 : (mx - px) * 6
        const dy = py < 0 ? 0 : (my - py) * 6
        speed = Math.sqrt(dx * dx + dy * dy)
        px = mx; py = my
        splat(velocity, SIM_RES, SIM_RES, mx, my, [dx, dy, 0], 0.0004)
        splat(dye, DYE_RES, DYE_RES, mx, my, [0.72, 0.94, 0.75], 0.0012)
        moved = false
      }

      advect(velocity, velocity, SIM_RES, SIM_RES, dt, 0.98)
      advect(velocity, dye,      DYE_RES, DYE_RES, dt, 0.97)

      targetScale = Math.max(targetScale * 0.9, Math.min(speed * 110, 14))
      dispScale += (targetScale - dispScale) * 0.14
      dispRef.current?.setAttribute('scale', dispScale.toFixed(2))

      seedAccum += dt
      if (seedAccum > 0.1) {
        seed = (seed + 1) % 300
        turbRef.current?.setAttribute('seed', String(seed))
        seedAccum = 0
      }

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.useProgram(displayProg); bindQuad(displayProg)
      gl.uniform1i(gl.getUniformLocation(displayProg, 'u_dye'), 0)
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, dye.read.tex)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      root.style.filter = ''
    }
  }, [])

  return (
    <>
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          {/*
            Filter covers the full element — no clipping.
            feFlood provides neutral gray (R=0.5, G=0.5) everywhere = zero displacement.
            feImage mask (radial gradient) moves with cursor.
            feComposite "in" clips noise to cursor area with soft circular edge.
            feComposite "over" blends local noise onto neutral — far from cursor stays neutral.
            feDisplacementMap: neutral (0.5,0.5) = no shift; noise near cursor = warp.
          */}
          <filter id="fluid-warp" colorInterpolationFilters="sRGB">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.025 0.03"
              numOctaves="2"
              seed="1"
              result="noise"
            />
            {/* Neutral mid-gray base: R=G=0.5 → zero displacement */}
            <feFlood floodColor="rgb(128,128,128)" floodOpacity="1" result="neutral" />
            {/* Radial gradient mask positioned at cursor */}
            <feImage
              ref={imgRef}
              result="mask"
              x={-half} y={-half}
              width={LENS_SIZE} height={LENS_SIZE}
              preserveAspectRatio="none"
            />
            {/* Clip noise to the circular cursor area */}
            <feComposite in="noise" in2="mask" operator="in" result="localNoise" />
            {/* Where mask is transparent, fall back to neutral gray */}
            <feComposite in="localNoise" in2="neutral" operator="over" result="dispMap" />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="dispMap"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  )
}
