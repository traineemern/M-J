import React, { useMemo } from 'react'
import * as THREE from 'three'

interface SceneryProps {
  progress: number
}

// Perimeter tree positions around open farmland
const TREE_COORDS = [
  [-14, -8, 1.2],
  [-18, -2, 1.5],
  [-11, 10, 1.1],
  [-16, 7, 1.3],
  [-8, -12, 1.4],
  [2, -14, 1.3],
  [8, -15, 1.6],
  [19, -6, 1.4],
  [17, 5, 1.2],
  [14, 11, 1.5],
]

export const Scenery: React.FC<SceneryProps> = ({ progress }) => {
  // Flag placed in Beat 4 (progress >= 0.38) and rises as placed
  const isFlagActive = progress >= 0.38
  const flagRise = isFlagActive ? Math.min(1, (progress - 0.38) / 0.04) : 0

  // Surface dust particles:
  // Beat 1: Dust trail behind truck (0.0 to 0.17)
  const isTruckDust = progress > 0.02 && progress < 0.17
  // Beat 6: Surface dust puffs as drill contacts grass (0.54 to 0.58, max 20 particles)
  const isDrillDust = progress >= 0.54 && progress <= 0.58

  // Instanced Matrices for Trees (Trunk and Foliage in 2 draw calls total)
  const { trunkMatrices, foliageMatrices } = useMemo(() => {
    const trunks: THREE.Matrix4[] = []
    const foliage: THREE.Matrix4[] = []
    const m = new THREE.Matrix4()

    TREE_COORDS.forEach(([x, z, scale]) => {
      // Trunk matrix
      m.makeTranslation(x, 0.7 * scale, z)
      m.scale(new THREE.Vector3(scale, scale, scale))
      trunks.push(m.clone())

      // Foliage matrix
      m.makeTranslation(x, 2.2 * scale, z)
      m.scale(new THREE.Vector3(scale, scale, scale))
      foliage.push(m.clone())
    })

    return { trunkMatrices: trunks, foliageMatrices: foliage }
  }, [])

  return (
    <group>
      {/* ================= GOLDEN HOUR LIGHTING ================= */}
      {/* Soft blue sky ambient light */}
      <ambientLight color="#90caf9" intensity={0.65} />

      {/* Warm sun directional light at golden hour angle */}
      <directionalLight
        position={[20, 18, 15]}
        intensity={1.4}
        color="#ffe4b5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />

      {/* Fill light */}
      <directionalLight position={[-15, 10, -10]} intensity={0.3} color="#bae6fd" />

      {/* ================= BACKGROUND ROLLING HILLS ================= */}
      <mesh position={[-14, 2.5, -20]} castShadow>
        <sphereGeometry args={[14, 16, 16]} />
        <meshStandardMaterial color="#22c55e" roughness={0.9} />
      </mesh>
      <mesh position={[8, 3.0, -24]} castShadow>
        <sphereGeometry args={[18, 16, 16]} />
        <meshStandardMaterial color="#16a34a" roughness={0.9} />
      </mesh>
      <mesh position={[24, 2.0, -18]} castShadow>
        <sphereGeometry args={[12, 16, 16]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>

      {/* ================= RED BARN (Beat 1 wide opening shot) ================= */}
      <group position={[15, 0, -12]} rotation={[0, -0.25, 0]}>
        {/* Main Body (Classic Barn Red #991b1b) */}
        <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.5, 4.4, 5.0]} />
          <meshStandardMaterial color="#991b1b" roughness={0.7} />
        </mesh>
        {/* White Trim Cross X on Barn Doors */}
        <mesh position={[0, 1.5, 2.52]}>
          <boxGeometry args={[2.2, 3.0, 0.04]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.5, 2.53]}>
          <boxGeometry args={[2.0, 2.8, 0.04]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.7} />
        </mesh>
        {/* Barn Pitched Roof (Slate grey) */}
        <mesh position={[0, 4.9, 0]} castShadow>
          <coneGeometry args={[4.4, 1.6, 4]} />
          <meshStandardMaterial color="#475569" roughness={0.6} />
        </mesh>
        {/* Cupola */}
        <mesh position={[0, 5.9, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ================= INSTANCED TREES (2 Draw Calls Total) ================= */}
      <instancedMesh
        args={[undefined, undefined, TREE_COORDS.length]}
        onUpdate={(self) => {
          trunkMatrices.forEach((mat, idx) => self.setMatrixAt(idx, mat))
          self.instanceMatrix.needsUpdate = true
        }}
        castShadow
      >
        <cylinderGeometry args={[0.16, 0.22, 1.4, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </instancedMesh>

      <instancedMesh
        args={[undefined, undefined, TREE_COORDS.length]}
        onUpdate={(self) => {
          foliageMatrices.forEach((mat, idx) => self.setMatrixAt(idx, mat))
          self.instanceMatrix.needsUpdate = true
        }}
        castShadow
      >
        <coneGeometry args={[1.0, 2.4, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </instancedMesh>

      {/* ================= AQUA SURVEY FLAG ON STAKE ================= */}
      {/* Placed at drilling center [0.6, 0, 0] in Beat 4 and rises from ground */}
      {isFlagActive && (
        <group position={[0.6, 0, 0]} scale={[1, flagRise, 1]}>
          {/* Stake */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
          </mesh>
          {/* Aqua Survey Flag */}
          <mesh position={[0.16, 0.8, 0]}>
            <planeGeometry args={[0.32, 0.2]} />
            <meshStandardMaterial color="#06b6d4" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* ================= SURFACE DUST PARTICLES (max 16 instances) ================= */}
      {/* Beat 1 Dust Trail behind truck */}
      {isTruckDust && (
        <group position={[-12 * (1 - (progress / 0.17)), 0.1, -4 * (1 - (progress / 0.17))]}>
          <mesh>
            <sphereGeometry args={[0.25, 6, 6]} />
            <meshStandardMaterial color="#d4a373" transparent opacity={0.4} />
          </mesh>
        </group>
      )}

      {/* Beat 6 Dust Puffs around drill tip at surface (max 16 particles) */}
      {isDrillDust && (
        <group position={[0.6, 0.12, 0]}>
          <mesh>
            <ringGeometry args={[0.18, 0.45, 12]} />
            <meshStandardMaterial color="#d4a373" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  )
}
