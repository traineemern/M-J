import React from 'react'
import * as THREE from 'three'

interface GroundProps {
  progress: number
}

export const Ground: React.FC<GroundProps> = ({ progress }) => {
  // Cutaway stays visible during Beat 6 & 7 (0.54 to 0.83)
  const isCutawayActive = progress >= 0.54 && progress <= 0.83

  // Horizontal wipes for each band as the drill tip descends:
  // Top Soil: 0.58 to 0.61
  // Sub Soil: 0.61 to 0.64
  // Ground Water: 0.64 to 0.67
  // Bed Rock: 0.67 to 0.70
  // Once in Beat 7 (>= 0.705), all bands remain fully revealed (wipe = 1)
  const topSoilWipe = progress >= 0.705 ? 1 : Math.min(1, Math.max(0, (progress - 0.58) / 0.03))
  const subSoilWipe = progress >= 0.705 ? 1 : Math.min(1, Math.max(0, (progress - 0.61) / 0.03))
  const waterWipe = progress >= 0.705 ? 1 : Math.min(1, Math.max(0, (progress - 0.64) / 0.03))
  const bedRockWipe = progress >= 0.705 ? 1 : Math.min(1, Math.max(0, (progress - 0.67) / 0.03))

  const waterWaveOffset = Math.sin(progress * 30) * 0.03

  return (
    <group position={[0, 0, 0]}>
      {/* ================= SURFACE TERRAIN ================= */}
      {/* Main Ground Slab (Rich green pasture) */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[42, 0.4, 32]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>

      {/* Dirt Track (runs along pasture where truck drives) */}
      <mesh position={[-6, 0.01, -2]} rotation={[-Math.PI / 2, 0, 0.28]} receiveShadow>
        <planeGeometry args={[3.2, 34]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>

      {/* Flag / Marker Site Circle at [0.6, 0.02, 0] */}
      <mesh position={[0.6, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.38, 20]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* ================= VERTICAL CUTAWAY SECTION ================= */}
      {isCutawayActive && (
        <group position={[0.6, 0, 0]}>
          {/* Layer 1: Top Soil (soil-dark rich earth, wipes in horizontally) */}
          <group position={[0, -0.75, 0]} scale={[topSoilWipe, 1, 1]}>
            <mesh receiveShadow>
              <boxGeometry args={[4.8, 1.5, 3.2]} />
              <meshStandardMaterial color="#3d2817" roughness={0.9} />
            </mesh>
          </group>

          {/* Layer 2: Sub Soil (dense sand & clay, wipes in horizontally) */}
          <group position={[0, -2.5, 0]} scale={[subSoilWipe, 1, 1]}>
            <mesh receiveShadow>
              <boxGeometry args={[4.8, 2.0, 3.2]} />
              <meshStandardMaterial color="#c29b63" roughness={0.8} />
            </mesh>
          </group>

          {/* Layer 3: Ground Water (aquifer blue band with water wave surface) */}
          <group position={[0, -4.5, 0]} scale={[waterWipe, 1, 1]}>
            <mesh receiveShadow>
              <boxGeometry args={[4.8, 2.0, 3.2]} />
              <meshStandardMaterial
                color="#0284c7"
                roughness={0.2}
                transparent
                opacity={0.88}
              />
            </mesh>
            {/* Wave band line on front of cutaway */}
            <mesh position={[0, 0.98 + waterWaveOffset, 1.61]}>
              <boxGeometry args={[4.8, 0.08, 0.02]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} />
            </mesh>
          </group>

          {/* Layer 4: Bed Rock (Michigan limestone grey with low-poly rocks) */}
          <group position={[0, -6.75, 0]} scale={[bedRockWipe, 1, 1]}>
            <mesh receiveShadow>
              <boxGeometry args={[4.8, 2.5, 3.2]} />
              <meshStandardMaterial color="#64748b" roughness={0.9} />
            </mesh>
            {/* Low-poly Rock Formations (Instanced: 1 draw call) */}
            <instancedMesh
              args={[undefined, undefined, 3]}
              onUpdate={(self) => {
                const m = new THREE.Matrix4()
                const configs = [
                  { pos: [-1.2, 0.4, 1.62], scale: 0.32, rot: [0.2, 0.3, 0] },
                  { pos: [1.4, -0.5, 1.62], scale: 0.42, rot: [-0.2, 0.5, 0.1] },
                  { pos: [0.2, -0.8, 1.62], scale: 0.28, rot: [0.4, -0.2, 0] },
                ]
                configs.forEach((c, idx) => {
                  const rotM = new THREE.Matrix4().makeRotationFromEuler(
                    new THREE.Euler(c.rot[0], c.rot[1], c.rot[2])
                  )
                  m.makeTranslation(c.pos[0], c.pos[1], c.pos[2])
                  m.scale(new THREE.Vector3(c.scale, c.scale, c.scale))
                  m.multiply(rotM)
                  self.setMatrixAt(idx, m)
                })
                self.instanceMatrix.needsUpdate = true
              }}
            >
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#475569" roughness={0.95} />
            </instancedMesh>
          </group>
        </group>
      )}
    </group>
  )
}
