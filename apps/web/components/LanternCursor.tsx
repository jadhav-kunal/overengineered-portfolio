'use client'

import { useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

const MODEL = '/dark_lantern_rigged.glb'
const CAM_Z  = 5
const FOV    = 50
// How far below the cursor the lantern center sits (world units, negative = down).
// At scale 0.3 the model top should land at cursor tip, so center must be ~half-model-height below.
const Y_WORLD_OFFSET  = -0.9   // lantern center
const LIGHT_Y_OFFSET  = -0.5   // light ring center (higher than lantern)

// Convert a world-space Y offset to screen pixels, given current window height
function worldToScreenPx(worldY: number): number {
  const halfH = CAM_Z * Math.tan((FOV / 2) * Math.PI / 180) // ~2.33
  return -worldY * window.innerHeight / (2 * halfH)          // flip: -worldY → +screen px down
}

function Lantern() {
  const group = useRef<THREE.Group>(null!)
  const { scene, animations } = useGLTF(MODEL)
  const { actions, names } = useAnimations(animations, group)
  const { viewport } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (names.length > 0) {
      const action = actions[names[0]]
      if (action) {
        action.setLoop(THREE.LoopRepeat, Infinity)
        action.play()
      }
    }
    function onMove(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [actions, names])

  useFrame(() => {
    if (!group.current) return
    const x = mouse.current.x * (viewport.width / 2)
    const y = mouse.current.y * (viewport.height / 2)
    group.current.position.set(x, y + Y_WORLD_OFFSET, 0)
    group.current.rotation.z = Math.sin(performance.now() * 0.0008) * 0.06
  })

  return <primitive ref={group} object={scene} scale={0.03} />
}

export default function LanternCursor() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function update(cx: number, cy: number) {
      const lanternCy = cy + worldToScreenPx(Y_WORLD_OFFSET)
      const lightCy   = cy + worldToScreenPx(LIGHT_Y_OFFSET)

      if (overlayRef.current) {
        const mask = `radial-gradient(circle 270px at ${cx}px ${lightCy}px, transparent 0%, rgba(0,0,0,0.92) 65%, black 100%)`
        overlayRef.current.style.setProperty('-webkit-mask-image', mask)
        overlayRef.current.style.setProperty('mask-image', mask)
      }
      if (glowRef.current) {
        glowRef.current.style.background =
          `radial-gradient(circle 290px at ${cx}px ${lightCy}px, rgba(255,190,40,0.22) 0%, rgba(255,150,20,0.10) 55%, transparent 100%)`
      }
    }
    update(window.innerWidth / 2, window.innerHeight / 2)
    const onMove = (e: MouseEvent) => update(e.clientX, e.clientY)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000000',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      />

      {/* Warm yellow tint over the revealed light area */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 55,
          pointerEvents: 'none',
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 60,
          pointerEvents: 'none',
          background: 'transparent',
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 1, 3]} intensity={5} color="#FFB060" distance={10} />
        <Suspense fallback={null}>
          <Lantern />
        </Suspense>
      </Canvas>
    </>
  )
}

useGLTF.preload(MODEL)
