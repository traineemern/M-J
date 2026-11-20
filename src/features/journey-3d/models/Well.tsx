import React, { useMemo } from 'react'
import * as THREE from 'three'

interface WellProps {
  progress: number
}

/**
 * Well Casing, Slotted Screen, Gravel Pack & Rising Water Column.
 * Centered precisely on the borehole at [0.6, 0, 0].
 */
export const Well: React.FC<WellProps> = ({ progress }) => {
  // Visible from Beat 7 onwards (progress >= 0.705)
  if (progress < 0.705) {
    return null
  }

  // Casing lowers into borehole in Beat 7 (0.705 to 0.74)
  const casingDescent = Math.min(1, (progress - 0.705) / 0.035)
  const casingY = (1 - casingDescent) * 4.0

  // Water level inside casing:
  // Beat 7 (0.74 to 0.825): Water rises inside casing from bottom (-5.5) up to steady aquifer level (-3.8)
  // Beat 8 (0.83 to 0.905): Water surges up to surface collar (0.3) for splash
  // Beat 9: Steady at pitless adapter depth (-0.35)
  let waterHeight = 0.5
  let waterY = -5.2
  const waterWave = Math.sin(progress * 24) * 0.03

  if (progress >= 0.74 && progress < 0.825) {
    const t = (progress - 0.74) / 0.085
    // Rises from bottom of screen to aquifer top
    waterHeight = 0.5 + t * 1.8
    waterY = -5.2 + (t * 1.8) / 2 + waterWave
  } else if (progress >= 0.825 && progress < 0.905) {
    // Rises to surface wellhead collar
    waterHeight = 7.2
    waterY = -3.2
  } else if (progress >= 0.905) {
    // Pitless adapter line depth
    waterHeight = 6.6
    waterY = -3.5
  }

  // Pre-generate gravel positions around the screen (36 instances, max 40 per spec)
  const gravelMatrices = useMemo(() => {
    const matrices: THREE.Matrix4[] = []
    const tempMatrix = new THREE.Matrix4()
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2
      const radius = 0.32 + Math.sin(i * 3) * 0.08
      const y = -4.5 + Math.sin(i * 7) * 0.8
      tempMatrix.setPosition(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
      matrices.push(tempMatrix.clone())
    }
    return matrices
  }, [])

  return (
    <group position={[0.6, casingY, 0]}>
      {/* Surface Wellhead Cap & Collar */}
      <group position={[0, 0.25, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.5, 20]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Sanitary Well Cap */}
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 20]} />
          <meshStandardMaterial color="#0369a1" roughness={0.4} />
        </mesh>
      </group>

      {/* Main Steel Casing Pipe (runs down through cutaway) */}
      <mesh position={[0, -3.5, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 7.0, 20]} />
        <meshStandardMaterial
          color="#0284c7"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Screened Slotted Section in Ground Water Band (-3.8 to -5.2) */}
      <mesh position={[0, -4.5, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 1.4, 20]} />
        <meshStandardMaterial color="#38bdf8" wireframe roughness={0.2} />
      </mesh>

      {/* Gravel Pack around Screen (Single InstancedMesh: 1 draw call) */}
      <instancedMesh
        args={[undefined, undefined, 36]}
        onUpdate={(self) => {
          gravelMatrices.forEach((mat, idx) => {
            self.setMatrixAt(idx, mat)
          })
          self.instanceMatrix.needsUpdate = true
        }}
      >
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </instancedMesh>

      {/* Water Column rising inside Casing */}
      {progress >= 0.74 && (
        <mesh position={[0, waterY, 0]}>
          <cylinderGeometry args={[0.16, 0.16, waterHeight, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.65}
            roughness={0.15}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  )
}
