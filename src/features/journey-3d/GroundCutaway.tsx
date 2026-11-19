import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GroundCutawayProps {
  scrollProgress: number
}

export const GroundCutaway: React.FC<GroundCutawayProps> = ({ scrollProgress }) => {
  const groupRef = useRef<THREE.Group>(null)

  // Single cutaway vertical plane showing soil, subsoil, groundwater aquifer, and bedrock
  const cutawayGeometry = useMemo(() => new THREE.PlaneGeometry(36, 14), [])

  // Texture-like strata material with colored bands
  const cutawayMaterial = useMemo(() => {
    // Canvas texture with 4 geological strata layers
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Top Soil (0 - 15 ft)
      ctx.fillStyle = '#2d1e18'
      ctx.fillRect(0, 0, 64, 40)
      // Sub Soil (15 - 60 ft)
      ctx.fillStyle = '#4e342e'
      ctx.fillRect(0, 40, 64, 60)
      // Ground Water Aquifer (60 - 160 ft)
      const grad = ctx.createLinearGradient(0, 100, 0, 180)
      grad.addColorStop(0, '#0369a1')
      grad.addColorStop(0.5, '#38bdf8')
      grad.addColorStop(1, '#0284c7')
      ctx.fillStyle = grad
      ctx.fillRect(0, 100, 64, 80)
      // Bed Rock (160+ ft)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 180, 64, 76)
    }
    const texture = new THREE.CanvasTexture(canvas)
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide,
    })
  }, [])

  // Unconditional useFrame hook - visibility toggled inside callback
  useFrame(() => {
    if (!groupRef.current) return
    const isCutawayActive = scrollProgress >= 0.40 && scrollProgress <= 0.70
    groupRef.current.visible = isCutawayActive
  })

  useEffect(() => {
    return () => {
      cutawayGeometry.dispose()
      cutawayMaterial.dispose()
    }
  }, [cutawayGeometry, cutawayMaterial])

  return (
    <group
      ref={groupRef}
      name="ground-cutaway-group"
      position={[-7.5, -4.5, -118]}
      rotation={[0, Math.PI / 8, 0]}
    >
      <mesh
        geometry={cutawayGeometry}
        material={cutawayMaterial}
      />
    </group>
  )
}
