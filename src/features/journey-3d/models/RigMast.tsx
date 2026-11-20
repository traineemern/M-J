import React, { useRef } from 'react'
import * as THREE from 'three'

interface RigMastProps {
  progress: number
}

const BRACE_HEIGHTS = [0.8, 1.6, 2.4, 3.2, 4.0, 4.7]

/**
 * Drilling Mast & Rotary Head:
 * - Stays attached to truck bed hinge at [posX + 0.6, 1.0, 0] at all times.
 * - Horizontal resting position during Beats 1-4.
 * - Rises to vertical in Beat 5 (0.47 to 0.53) on its hinge.
 * - Beat 6: Drill head lowers pipe onto flag at surface (0.54 to 0.58), then penetrates Michigan earth (0.58 to 0.70).
 * - Beat 7 (0.71 to 0.82): Drill lifts out of borehole up mast rails, leaving open hole for casing.
 */
export const RigMast: React.FC<RigMastProps> = ({ progress }) => {
  const pipeRef = useRef<THREE.Mesh>(null)

  if (progress < 0.18) return null

  // Mast remains aligned with the truck as it parks on the left.
  let truckPosX = -9
  if (progress >= 0.18 && progress < 0.28) {
    const t = Math.max(0, Math.min(1, (progress - 0.18) / 0.1))
    truckPosX = -22 * (1 - t) - 9 * t
  }

  // Mast vertical rotation on hinge:
  // Beats 1-4: horizontal resting (-1.45 rad)
  // Beat 5 (0.47 to 0.53): rises smoothly to vertical (0 rad)
  let mastRotZ = -1.45
  if (progress >= 0.47 && progress <= 0.53) {
    const t = (progress - 0.47) / 0.06
    mastRotZ = -1.45 * (1 - t)
  } else if (progress > 0.53) {
    mastRotZ = 0
  }

  // Drill head descent along mast rails and pipe penetration depth:
  // Action 1 (0.54 to 0.58): Drill head lowers pipe from crown to surface (tip y: 0)
  // Action 2 (0.58 to 0.70): Drill penetrates earth from y: 0 down to y: -6.5
  // Beat 7 (0.71 to 0.76): Drill lifts back out of hole up mast rails
  let drillHeadY = 3.8
  let pipeTipY = 1.0
  let pipeSpin = 0
  let isPipeVisible = progress >= 0.54

  if (progress >= 0.54 && progress <= 0.58) {
    const t = (progress - 0.54) / 0.04
    drillHeadY = 3.8 - t * 2.0 // descends down rails
    pipeTipY = 1.8 - t * 1.8 // approaches grass surface y: 0
    pipeSpin = progress * Math.PI * 30
  } else if (progress > 0.58 && progress <= 0.68) {
    const t = (progress - 0.58) / 0.10
    drillHeadY = 1.8
    pipeTipY = -t * 6.5 // penetrates ground to bedrock depth
    pipeSpin = progress * Math.PI * 60
  } else if (progress > 0.68 && progress <= 0.70) {
    // Final part of Beat 6: lift the drill clear before casing or water appear.
    const retractT = Math.min(1, (progress - 0.68) / 0.02)
    drillHeadY = 1.8 + retractT * 2.0
    pipeTipY = -6.5 + retractT * 6.5
    pipeSpin = 0
    if (retractT >= 1) {
      isPipeVisible = false
    }
  } else if (progress > 0.70) {
    drillHeadY = 3.8
    isPipeVisible = false
  }

  return (
    <group position={[truckPosX + 0.6, 1.0, 0]}>
      {/* Permanent Hinge Base attached to truck bed */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>

      {/* Rotating Mast Assembly */}
      <group rotation={[0, 0, mastRotZ]}>
        {/* Mast Lattice Rails (4 vertical thin steel beams) */}
        <mesh position={[-0.2, 2.4, 0.25]} castShadow>
          <boxGeometry args={[0.06, 4.8, 0.06]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>
        <mesh position={[0.2, 2.4, 0.25]} castShadow>
          <boxGeometry args={[0.06, 4.8, 0.06]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>
        <mesh position={[-0.2, 2.4, -0.25]} castShadow>
          <boxGeometry args={[0.06, 4.8, 0.06]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>
        <mesh position={[0.2, 2.4, -0.25]} castShadow>
          <boxGeometry args={[0.06, 4.8, 0.06]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>

        {/* Cross Braces (Single instanced draw call) */}
        <instancedMesh
          args={[undefined, undefined, BRACE_HEIGHTS.length]}
          onUpdate={(self) => {
            const m = new THREE.Matrix4()
            BRACE_HEIGHTS.forEach((y, idx) => {
              m.makeTranslation(0, y, 0)
              self.setMatrixAt(idx, m)
            })
            self.instanceMatrix.needsUpdate = true
          }}
        >
          <boxGeometry args={[0.42, 0.04, 0.52]} />
          <meshStandardMaterial color="#0369a1" />
        </instancedMesh>

        {/* Mast Crown Pulley at Top */}
        <mesh position={[0, 4.85, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.4, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
        </mesh>

        {/* Level Bubble Indicator on Mast (Beat 5) */}
        {progress >= 0.47 && progress <= 0.65 && (
          <mesh position={[0.24, 2.2, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.1]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>
        )}

        {/* Drill Head Box (rides the rails down) */}
        <group position={[0, drillHeadY, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.36, 0.5, 0.4]} />
            <meshStandardMaterial color="#f97316" roughness={0.4} />
          </mesh>
          {/* Hydraulic rotary drive motor */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.3, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        </group>

        {/* Spinning Steel Drill Pipe descending into borehole */}
        {isPipeVisible && (
          <group position={[0, pipeTipY + 3.5, 0]}>
            <mesh ref={pipeRef} rotation={[0, pipeSpin, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 7.0, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Carbide Roller Cone Drill Bit at Tip */}
            <mesh position={[0, -3.5, 0]} rotation={[0, pipeSpin * 2, 0]}>
              <coneGeometry args={[0.14, 0.3, 12]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  )
}
