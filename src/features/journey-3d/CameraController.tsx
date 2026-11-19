import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraControllerProps {
  scrollProgress: number
}

export const CameraController: React.FC<CameraControllerProps> = ({ scrollProgress }) => {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 0, 5))
  const targetLook = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const p = Math.max(0, Math.min(1, scrollProgress))

    if (p <= 0.15) {
      // Chapter 1: Hero (0 to 15%) - Camera slowly pushes forward
      const norm = p / 0.15
      targetPos.current.set(0, 0, 5 - norm * 1.5) // 5 -> 3.5
      targetLook.current.set(0, 0, 0)
    } else if (p <= 0.30) {
      // Chapter 2: Reveal (15% to 30%) - Camera advances into droplets
      const norm = (p - 0.15) / 0.15
      targetPos.current.set(0, 0, 3.5 - norm * 1.5) // 3.5 -> 2.0
      targetLook.current.set(0, 0, -2)
    } else if (p <= 0.45) {
      // Chapter 3: Services (30% to 45%) - Positioned to look past 3D cards
      const norm = (p - 0.30) / 0.15
      targetPos.current.set(0, 0, 2.0 - norm * 2.0) // 2.0 -> 0.0
      targetLook.current.set(0, -1, -5)
    } else if (p <= 0.65) {
      // Chapter 4: Descent (45% to 65%) - Camera descends vertically into earth strata
      const norm = (p - 0.45) / 0.20
      targetPos.current.set(0, -norm * 14, 0) // Y: 0 -> -14
      targetLook.current.set(0, -norm * 14 - 3, -5)
    } else if (p <= 0.85) {
      // Chapter 5: Water Tunnel (65% to 85%) - Moves through the water tunnel
      const norm = (p - 0.65) / 0.20
      targetPos.current.set(0, -18, -norm * 18) // moves along Z in tunnel
      targetLook.current.set(0, -18, -norm * 18 - 8)
    } else {
      // Chapter 6: Surface & Finale (85% to 100%) - Camera rises to surface
      const norm = (p - 0.85) / 0.15
      targetPos.current.set(0, -18 + norm * 18, -4 + (1 - norm) * -4) // rises back to Y: 0
      targetLook.current.set(0, 0, -4)
    }

    // Smooth lerp (under 60fps constraint)
    camera.position.lerp(targetPos.current, 0.08)
    camera.lookAt(targetLook.current)
  })

  return null
}

export default CameraController
