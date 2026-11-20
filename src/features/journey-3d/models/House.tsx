import React from 'react'
import { isHouseVisible } from '@/data/journey'

interface HouseProps {
  progress: number
}

/**
 * Farmhouse, porch, outdoor faucet, and buried water connection.
 * Per spec: The house does not appear in beats 1 to 8; it appears ONLY in beat 9.
 */
export const House: React.FC<HouseProps> = ({ progress }) => {
  // Enforce visibility rule: Beats 1-8 are completely clear of the house
  if (!isHouseVisible(progress)) {
    return null
  }

  // Tap turns on in Beat 9 once manager reaches it (progress >= 0.95)
  const isTapRunning = progress >= 0.95

  return (
    <group>
      {/* ================= FARMHOUSE WITH PORCH (Midground right) ================= */}
      <group position={[7.5, 0, 0]}>
        {/* Main Two-Story House Body (Crisp white #f8fafc) */}
        <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 4.4, 4.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>

        {/* Pitched Roof (Navy slate blue #1e293b) */}
        <mesh position={[0, 4.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[3.8, 1.5, 4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>

        {/* Windows with blue frames */}
        {[-1.3, 1.3].map((x, i) => (
          <group key={i}>
            <mesh position={[x, 3.0, 2.12]}>
              <boxGeometry args={[0.7, 0.9, 0.05]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.2} transparent opacity={0.8} />
            </mesh>
            <mesh position={[x, 1.4, 2.12]}>
              <boxGeometry args={[0.7, 0.9, 0.05]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.2} transparent opacity={0.8} />
            </mesh>
          </group>
        ))}

        {/* Front Porch (overhang + 2 white posts) */}
        <mesh position={[0, 0.15, 2.6]} receiveShadow>
          <boxGeometry args={[3.6, 0.3, 1.2]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
        <mesh position={[-1.6, 1.2, 3.1]}>
          <cylinderGeometry args={[0.06, 0.06, 2.2, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[1.6, 1.2, 3.1]}>
          <cylinderGeometry args={[0.06, 0.06, 2.2, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Porch Roof */}
        <mesh position={[0, 2.35, 2.6]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[3.8, 0.12, 1.4]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Outdoor Spigot / Faucet on side wall */}
        <group position={[-2.42, 0.9, 0]}>
          {/* Faucet Body */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.16, 8]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Tap Handle Valve */}
          <mesh position={[-0.08, 0.06, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.03, 8]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Spout Curving Down */}
          <mesh position={[-0.08, -0.05, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.1, 8]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} />
          </mesh>

          {/* Water Basin / Trough on ground */}
          <mesh position={[-0.1, -0.65, 0]}>
            <boxGeometry args={[0.5, 0.35, 0.6]} />
            <meshStandardMaterial color="#64748b" roughness={0.8} />
          </mesh>
          {/* Water in Basin */}
          {isTapRunning && (
            <mesh position={[-0.1, -0.5, 0]}>
              <boxGeometry args={[0.42, 0.06, 0.52]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} />
            </mesh>
          )}

          {/* Water Droplet Stream from Faucet */}
          {isTapRunning && (
            <mesh position={[-0.08, -0.28, 0]}>
              <cylinderGeometry args={[0.02, 0.025, 0.38, 8]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.6}
                roughness={0.1}
                transparent
                opacity={0.85}
              />
            </mesh>
          )}
        </group>
      </group>

      {/* ================= BURIED WATER LINE PIPE ================= */}
      {/* Runs underground from casing [0.6, 0, 0] to house [5.1, 0, 0] */}
      <group>
        {/* Buried Trench Strip Indicator */}
        <mesh position={[2.85, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.5, 0.28]} />
          <meshStandardMaterial color="#a16207" roughness={0.9} />
        </mesh>
        {/* Underground Polyethylene Pipe (Blue) */}
        <mesh position={[2.85, -0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 4.5, 10]} />
          <meshStandardMaterial color="#0284c7" metalness={0.4} />
        </mesh>
      </group>
    </group>
  )
}
