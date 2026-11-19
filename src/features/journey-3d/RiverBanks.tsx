import React, { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { riverCurve } from './riverCurve'

const BANK_INSTANCE_COUNT = 120

export const RiverBanks: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // Low-poly boulder/bank geometry
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(0.85, 0), [])

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        roughness: 0.85,
        metalness: 0.1,
        flatShading: true,
      }),
    []
  )

  useEffect(() => {
    if (!meshRef.current) return
    const mesh = meshRef.current

    const dummy = new THREE.Object3D()
    const up = new THREE.Vector3(0, 1, 0)

    const colors = [
      new THREE.Color('#2d1e18'), // soil-dark
      new THREE.Color('#d4b483'), // sand
      new THREE.Color('#64748b'), // rock grey
      new THREE.Color('#475569'), // slate rock
    ]

    const halfCount = BANK_INSTANCE_COUNT / 2 // 60 per bank
    const channelHalfWidth = 7.0

    for (let i = 0; i < BANK_INSTANCE_COUNT; i++) {
      const isRight = i >= halfCount
      const bankIndex = isRight ? i - halfCount : i
      const t = bankIndex / halfCount

      const center = riverCurve.getPointAt(t)
      const tangent = riverCurve.getTangentAt(t).normalize()
      const binormal = new THREE.Vector3().crossVectors(tangent, up).normalize()

      // Position just outside the water edge (7.0 + jitter)
      const sideSign = isRight ? 1 : -1
      const lateralDistance = channelHalfWidth + 0.4 + (Math.sin(i * 13.7) * 0.5 + 0.5) * 1.8

      const posX = center.x + binormal.x * (lateralDistance * sideSign)
      const posY = center.y - 0.2 + (Math.cos(i * 7.1) * 0.5 + 0.5) * 0.4
      const posZ = center.z + binormal.z * (lateralDistance * sideSign)

      dummy.position.set(posX, posY, posZ)

      // Random scale and rotation for natural low-poly rocks
      const scaleX = 0.8 + Math.abs(Math.sin(i * 3.3)) * 0.9
      const scaleY = 0.6 + Math.abs(Math.cos(i * 5.1)) * 0.7
      const scaleZ = 0.8 + Math.abs(Math.sin(i * 7.7)) * 0.9
      dummy.scale.set(scaleX, scaleY, scaleZ)

      dummy.rotation.set(
        Math.sin(i * 1.1) * Math.PI,
        Math.cos(i * 2.3) * Math.PI,
        Math.sin(i * 3.7) * Math.PI
      )
      dummy.updateMatrix()

      mesh.setMatrixAt(i, dummy.matrix)

      // Color assignment: soil-dark, sand, rock-grey
      const color = colors[i % colors.length]
      mesh.setColorAt(i, color)
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  return (
    <instancedMesh
      ref={meshRef}
      name="river-banks-instanced"
      args={[geometry, material, BANK_INSTANCE_COUNT]}
      castShadow={false}
      receiveShadow={false}
    />
  )
}
