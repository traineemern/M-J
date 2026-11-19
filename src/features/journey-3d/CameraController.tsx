import React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { riverCurve } from './riverCurve'

interface CameraControllerProps {
  scrollProgress: number
}

export const CameraController: React.FC<CameraControllerProps> = ({ scrollProgress }) => {
  const { camera } = useThree()

  // Unconditional frame loop: smooth camera progression along the river curve
  useFrame((state) => {
    // Clamp progress between 0 and 0.98 to allow lookAhead
    const p = Math.max(0, Math.min(0.979, scrollProgress))
    const lookAheadProgress = Math.min(0.999, p + 0.02)

    const point = riverCurve.getPointAt(p)
    const lookAtPoint = riverCurve.getPointAt(lookAheadProgress)

    // Gentle camera sway (0.1 units, slow sine)
    const t = state.clock.getElapsedTime()
    const sway = Math.sin(t * 1.2) * 0.1

    // Camera height is 3 units above water surface, centered on the river channel
    const targetCamX = point.x + sway
    const targetCamY = point.y + 3.0
    const targetCamZ = point.z

    // Smooth lerp to avoid abrupt jumps
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.12)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.12)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.12)

    // Camera looks ahead down the river
    camera.lookAt(lookAtPoint.x, lookAtPoint.y + 1.8, lookAtPoint.z)
  })

  return null
}

export default CameraController
