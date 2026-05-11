'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

const MODEL = '/reyce_nuclear_hammer_girl_with_animation.glb'

// Fraction through the animation when the hammer hits the ground.
// Check the console log of animation duration and tune this value.
const IMPACT_RATIO = 0.48

function Girl({ onImpact }: { onImpact: () => void }) {
  const group = useRef<THREE.Group>(null!)
  const { scene, animations } = useGLTF(MODEL)
  const { actions, names } = useAnimations(animations, group)
  const impactFired = useRef(false)

  useEffect(() => {
    if (!names.length) return
    const clip = animations[0]
    console.log('[HammerGirl] clip:', names[0], '| duration:', clip?.duration.toFixed(2), 's')
    console.log('[HammerGirl] impact fires at:', (clip?.duration * IMPACT_RATIO).toFixed(2), 's')

    const action = actions[names[0]]
    if (action) {
      action.setLoop(THREE.LoopOnce, 1)
      action.clampWhenFinished = true
      action.play()
    }
  }, [actions, names, animations])

  useFrame(() => {
    const action = actions[names[0]]
    if (!action) return

    const t = action.time
    const impactTime = action.getClip().duration * IMPACT_RATIO

    if (t >= impactTime && !impactFired.current) {
      impactFired.current = true
      onImpact()
    }
    // Reset flag at start of each loop so it fires every cycle
    if (t < impactTime * 0.1) {
      impactFired.current = false
    }
  })

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1.3}
      position={[0, -1.5, 0]}
    />
  )
}

export default function HammerGirl({ onImpact }: { onImpact: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 500,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 5, 3]} intensity={2.5} />
      <directionalLight position={[-3, 2, -2]} intensity={0.8} />
      <Suspense fallback={null}>
        <Girl onImpact={onImpact} />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL)
