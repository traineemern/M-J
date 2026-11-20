import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { DIORAMA_LAYOUT } from '@/features/diorama/layout'

interface TruckProps {
  progress: number
}

/**
 * Low-poly M&J service truck:
 * - Cab, flatbed, two axles, 4 wheels, white trim strip, blue nameplate.
 * - Drives in from the left edge during Beat 2 (0.18..0.28).
 * - In Beat 5 (0.47..0.53), stabilizer outriggers extend down to the ground.
 */
export const Truck: React.FC<TruckProps> = ({ progress }) => {
  const truckRef = useRef<THREE.Group>(null)
  const truckFootprint = DIORAMA_LAYOUT.find((item) => item.id === 'truck')!

  useEffect(() => {
    truckRef.current?.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.renderOrder = 2
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material) => { material.depthWrite = true })
    })
  }, [progress])

  // Position interpolation
  let posX = truckFootprint.x
  let posZ = truckFootprint.z
  let rotY = 0
  let wheelRot = 0

  if (progress >= 0.18 && progress < 0.28) {
    const t = Math.max(0, Math.min(1, (progress - 0.18) / 0.10))
    posX = -22 * (1 - t) + truckFootprint.x * t
    posZ = 0
    rotY = 0
    wheelRot = t * Math.PI * 16 // wheels spin while driving
  } else {
    posX = truckFootprint.x
    posZ = truckFootprint.z
    rotY = 0
  }

  // Stabilizer outriggers extension in Beat 5 (0.47 to 0.53)
  let legExtend = 0
  if (progress >= 0.47) {
    legExtend = Math.min(1, (progress - 0.47) / 0.05)
  }

  return (
    <group ref={truckRef} position={[posX + 0.225, 0.51, posZ]} rotation={[0, rotY, 0]} renderOrder={2}>
      {/* Truck Cab (Dark blue / water-900) */}
      <mesh position={[-1.6, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.2, 1.4]} />
        <meshStandardMaterial color="#0c4a6e" roughness={0.4} depthWrite />
      </mesh>

      {/* Cab Windshield & Windows (Sky blue glass) */}
      <mesh position={[-1.55, 1.05, 0]}>
        <boxGeometry args={[1.3, 0.6, 1.42]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.2} transparent opacity={0.8} />
      </mesh>

      {/* White Trim Strip along sides */}
      <mesh position={[-0.4, 0.55, 0]}>
        <boxGeometry args={[4.2, 0.12, 1.42]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>

      {/* Truck Flatbed / Chassis (Water-800) */}
      <mesh position={[0.5, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.4, 1.4]} />
        <meshStandardMaterial color="#0369a1" roughness={0.5} />
      </mesh>

      {/* Blue Name Plate on Cab Door */}
      <mesh position={[-1.6, 0.55, 0.72]}>
        <boxGeometry args={[0.7, 0.25, 0.02]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      <mesh position={[-1.6, 0.55, -0.72]}>
        <boxGeometry args={[0.7, 0.25, 0.02]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* 4 Wheels (Instanced Single Draw Call) */}
      <instancedMesh
        args={[undefined, undefined, 4]}
        onUpdate={(self) => {
          const m = new THREE.Matrix4()
          const rotM = new THREE.Matrix4().makeRotationZ(wheelRot)
          const alignM = new THREE.Matrix4().makeRotationX(Math.PI / 2)
          const coords = [
            [-1.8, -0.1, 0.8],
            [-1.8, -0.1, -0.8],
            [1.2, -0.1, 0.8],
            [1.2, -0.1, -0.8],
          ]
          coords.forEach(([x, y, z], idx) => {
            m.makeTranslation(x, y, z)
            m.multiply(rotM)
            m.multiply(alignM)
            self.setMatrixAt(idx, m)
          })
          self.instanceMatrix.needsUpdate = true
        }}
        castShadow
      >
        <cylinderGeometry args={[0.36, 0.36, 0.26, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </instancedMesh>

      {/* Stabilizer Outrigger Legs (Extend down in Beat 5) */}
      <group position={[1.4, 0.2 - legExtend * 0.35, 0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.4 + legExtend * 0.35, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} />
        </mesh>
        {/* Foot Pad */}
        <mesh position={[0, -0.2 - legExtend * 0.175, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.05, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
      <group position={[1.4, 0.2 - legExtend * 0.35, -0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.4 + legExtend * 0.35, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.2 - legExtend * 0.175, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.05, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </group>
  )
}
