import React, { useMemo, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Truck } from './models/Truck'
import { RigMast } from './models/RigMast'
import { Manager } from './models/Manager'
import { DIORAMA_LAYOUT, PLATFORM } from '@/features/diorama/layout'
import { CUTAWAY_BOUNDS, getDioramaBeatTimeline, getDioramaModelState, type DioramaModelState } from './beats'

interface JourneySceneProps {
  progress: number
  onDrawCallCount?: (calls: number) => void
  isMobile?: boolean
  surfaceOnly?: boolean
}

const at = (id: string) => {
  const item = DIORAMA_LAYOUT.find((entry) => entry.id === id)!
  return [item.x, item.z] as const
}
const PLATFORM_TOP = PLATFORM.top

const white = { color: '#f8fafc', roughness: 0.35, clearcoat: 0.6 }
const blue = { color: '#0369a1', roughness: 0.2, clearcoat: 0.8 }

function Card({ title, children, position }: { title: string; children: React.ReactNode; position: [number, number, number] }) {
  return (
    <Html position={position} center distanceFactor={12} transform sprite>
      <article className="diorama-card" aria-label={title}>
        <h3>{title}</h3>
        <div>{children}</div>
        <a href="/services">Learn more</a>
      </article>
    </Html>
  )
}

function Tree({ position, canopy = '#a5f3fc' }: { position: [number, number, number]; canopy?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 1.3, 7]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.65, 0]} castShadow>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshPhysicalMaterial color={canopy} roughness={0.55} />
      </mesh>
    </group>
  )
}

function SurfaceRig() {
  const [x, z] = at('drill-rig-and-flag')
  return (
    <group position={[x, PLATFORM_TOP, z]}>
      <mesh position={[0, 0.22, 0]} castShadow><boxGeometry args={[2.8, 0.44, 2]} /><meshPhysicalMaterial color="#075985" roughness={0.35} /></mesh>
      <mesh position={[0, 2.25, 0]} castShadow><boxGeometry args={[0.32, 4, 0.32]} /><meshPhysicalMaterial color="#64748b" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, 3.2, 0]} castShadow><boxGeometry args={[1.6, 0.24, 0.34]} /><meshPhysicalMaterial color="#0369a1" metalness={0.45} roughness={0.3} /></mesh>
      <mesh position={[0, 4.35, 0]}><cylinderGeometry args={[0.05, 0.05, 0.7, 8]} /><meshPhysicalMaterial color="#f8fafc" /></mesh>
      <mesh position={[0.24, 4.56, 0]}><planeGeometry args={[0.48, 0.28]} /><meshPhysicalMaterial color="#38bdf8" side={THREE.DoubleSide} /></mesh>
    </group>
  )
}

function WellHead({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.68, 16]} />
        <meshPhysicalMaterial {...blue} />
      </mesh>
      <mesh position={[0, 0.73, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.1, 16]} />
        <meshPhysicalMaterial {...white} />
      </mesh>
    </group>
  )
}

function HouseAndPump({ progress }: { progress: number }) {
  const tapRunning = progress >= 0.95
  return (
    <>
      {/* Farmhouse and porch at the rear left */}
      <group position={[at('farmhouse')[0], PLATFORM_TOP, at('farmhouse')[1]]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[4.3, 3, 3.7]} /><meshPhysicalMaterial {...white} /></mesh>
        <mesh position={[0, 3.35, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[3.25, 1.15, 4]} /><meshPhysicalMaterial color="#075985" roughness={0.28} clearcoat={0.7} /></mesh>
        <mesh position={[0, 1.65, 1.88]}><boxGeometry args={[3.5, 0.9, 0.05]} /><meshPhysicalMaterial color="#bae6fd" roughness={0.12} transparent opacity={0.8} /></mesh>
        <mesh position={[0, 0.17, 2.25]} receiveShadow><boxGeometry args={[3.6, 0.3, 0.9]} /><meshPhysicalMaterial {...white} /></mesh>
        <mesh position={[2.2, 0.65, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.045, 0.045, 0.45, 8]} /><meshPhysicalMaterial color="#64748b" metalness={0.7} roughness={0.25} /></mesh>
        <mesh position={[2.2, 0.38, 2.95]}><boxGeometry args={[0.8, 0.22, 0.58]} /><meshPhysicalMaterial color="#cbd5e1" roughness={0.55} /></mesh>
        {tapRunning && <mesh position={[2.2, 0.28, 2.95]}><boxGeometry args={[0.68, 0.06, 0.46]} /><meshPhysicalMaterial color="#38bdf8" roughness={0.15} clearcoat={0.8} /></mesh>}
        {tapRunning && <mesh position={[2.2, 0.58, 2.48]}><cylinderGeometry args={[0.025, 0.025, 0.35, 8]} /><meshPhysicalMaterial color="#38bdf8" roughness={0.15} clearcoat={0.8} transparent opacity={0.85} /></mesh>}
      </group>
      {/* Pump service hut at front left */}
      <group position={[at('pump-house')[0], 0.05, at('pump-house')[1]]}>
        <mesh position={[0, 1, 0]} castShadow><boxGeometry args={[4.2, 2, 3.2]} /><meshPhysicalMaterial {...white} /></mesh>
        <mesh position={[0, 2.1, 0]} castShadow><boxGeometry args={[4.5, 0.28, 3.5]} /><meshPhysicalMaterial color="#0369a1" roughness={0.25} clearcoat={0.8} /></mesh>
        <mesh position={[0, 1, 1.62]}><boxGeometry args={[2.8, 0.9, 0.04]} /><meshPhysicalMaterial color="#bae6fd" roughness={0.12} transparent opacity={0.72} /></mesh>
        <mesh position={[0, 0.28, 0]}><boxGeometry args={[1.2, 0.38, 1.2]} /><meshPhysicalMaterial color="#0c4a6e" roughness={0.35} /></mesh>
      </group>
    </>
  )
}

function Tank() {
  return (
    <group position={[at('storage-tank')[0], 0.05, at('storage-tank')[1]]}>
      <mesh position={[0, 2.45, 0]} castShadow><cylinderGeometry args={[2, 2, 4.8, 24]} /><meshPhysicalMaterial {...white} /></mesh>
      <mesh position={[0, 2.85, 0]}><cylinderGeometry args={[2.02, 2.02, 0.6, 24]} /><meshPhysicalMaterial {...blue} /></mesh>
      <mesh position={[0, 4.9, 0]}><cylinderGeometry args={[1.98, 1.98, 0.18, 24]} /><meshPhysicalMaterial {...white} /></mesh>
    </group>
  )
}

function Pond({ state, reducedMotion }: { state: DioramaModelState; reducedMotion: boolean }) {
  const surface = useRef<THREE.Mesh>(null)
  const waveTime = useRef({ value: 0 })
  const waterMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: '#0284c7', roughness: 0.2, clearcoat: 0.8, transparent: true, opacity: 0.9,
    })
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uWaveTime = waveTime.current
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uWaveTime;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.z += sin(position.x * 2.4 + uWaveTime) * 0.045 + cos(position.y * 1.8 + uWaveTime * 0.7) * 0.035;')
    }
    return material
  }, [])
  useFrame(({ clock }) => {
    if (reducedMotion) return
    waveTime.current.value = clock.elapsedTime
  })
  return (
    <group position={[at('pond')[0], 0.15, at('pond')[1]]}>
      <mesh><cylinderGeometry args={[4.2, 4.2, 0.2, 12]} /><meshPhysicalMaterial color="#bae6fd" roughness={0.42} /></mesh>
      <mesh ref={surface} position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.9, 12]} />
        <primitive object={waterMaterial} attach="material" />
      </mesh>
      {state === 'water-splash' && <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.8, 0.06, 6, 16]} /><meshBasicMaterial color="#e0f2fe" transparent opacity={0.72} /></mesh>}
    </group>
  )
}

function CasingStory({ progress, state }: { progress: number; state: DioramaModelState }) {
  const timeline = getDioramaBeatTimeline(progress)
  const casingProgress = THREE.MathUtils.clamp((progress - 0.71) / 0.05, 0, 1)
  const rootY = THREE.MathUtils.lerp(2.1, 0, casingProgress)
  const waterWorldY = progress < 0.83
    ? THREE.MathUtils.lerp(-2.25, -2.05, THREE.MathUtils.clamp((progress - 0.73) / 0.1, 0, 1))
    : THREE.MathUtils.lerp(-2.05, 0.46, THREE.MathUtils.clamp((progress - 0.83) / 0.08, 0, 1))
  const waterLevel = waterWorldY - rootY
  const visible = progress >= 0.71 && (state === 'groundwater' || state === 'water-splash' || state === 'home-delivery')
  return visible ? (
    <group position={[2.5, rootY, 5]}>
      <mesh position={[0, -0.78, 0]} castShadow renderOrder={1}>
        <cylinderGeometry args={[0.26, 0.26, 2.65, 16, 1, true]} />
        <meshPhysicalMaterial color="#0369a1" metalness={0.6} roughness={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={3}>
        <torusGeometry args={[0.29, 0.045, 8, 20]} />
        <meshPhysicalMaterial color="#7dd3fc" metalness={0.5} roughness={0.2} clearcoat={0.8} />
      </mesh>
      {timeline.water && <mesh position={[0, waterLevel, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <circleGeometry args={[0.23, 16]} /><meshPhysicalMaterial color="#38bdf8" roughness={0.15} clearcoat={0.8} />
      </mesh>}
      {state === 'water-splash' && <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.38, 0.035, 6, 20]} /><meshBasicMaterial color="#e0f2fe" transparent opacity={0.8} /></mesh>}
    </group>
  ) : null
}

function Cutaway({ progress }: { progress: number }) {
  const timeline = getDioramaBeatTimeline(progress)
  if (!timeline.cutaway || timeline.cutawayOpacity <= 0) return null
  const opacity = timeline.cutawayOpacity
  const shared = { transparent: opacity < 1, opacity, depthWrite: opacity >= 1 }
  const topDraw = THREE.MathUtils.clamp(timeline.layerProgress / 0.2, 0, 1)
  const subDraw = THREE.MathUtils.clamp((timeline.layerProgress - 0.2) / 0.28, 0, 1)
  const rockDraw = THREE.MathUtils.clamp((timeline.layerProgress - 0.48) / 0.28, 0, 1)
  const waterDraw = timeline.water ? 1 : 0
  const labels = timeline.labels
  const centerX = (CUTAWAY_BOUNDS.minX + CUTAWAY_BOUNDS.maxX) / 2

  const Band = ({ color, y, height, draw }: { color: string; y: number; height: number; draw: number }) => draw > 0 ? (
    <group position={[centerX, y - height / 2, 0]} scale={[1, draw, 1]} renderOrder={1}>
      <mesh position={[0, height / 2, 2.01]} renderOrder={1}><planeGeometry args={[4, height]} /><meshPhysicalMaterial color={color} side={THREE.DoubleSide} depthTest={false} {...shared} /></mesh>
      <mesh position={[2.01, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} renderOrder={1}><planeGeometry args={[4, height]} /><meshPhysicalMaterial color={color} side={THREE.DoubleSide} depthTest={false} {...shared} /></mesh>
    </group>
  ) : null

  const LayerLabel = ({ text, y }: { text: string; y: number }) => (
    <Html position={[centerX - 0.5, y, 2.4]} center distanceFactor={12} transform sprite zIndexRange={[30, 0]}>
      <span className="diorama-layer-label" style={{ opacity: progress < 0.81 ? 1 : 1 - THREE.MathUtils.clamp((progress - 0.81) / 0.02, 0, 1) }}>{text}</span>
    </Html>
  )

  return (
    <group position={[0, 0, 5]} renderOrder={1}>
      <mesh position={[centerX, 0, 0]} renderOrder={1}>
        <boxGeometry args={[4, 0.12, 4]} />
        <meshPhysicalMaterial color="#e2e8f0" roughness={0.55} depthTest={false} {...shared} />
      </mesh>
      <Band color="#a16207" y={-0.225} height={0.55} draw={topDraw} />
      <Band color="#c29b63" y={-0.825} height={0.65} draw={subDraw} />
      <Band color="#64748b" y={-1.51} height={0.72} draw={rockDraw} />
      {waterDraw > 0 && <Band color="#0284c7" y={-2.25} height={0.62} draw={waterDraw} />}
      {labels.includes('TOP SOIL') && <LayerLabel text="TOP SOIL" y={-0.225} />}
      {labels.includes('SUB SOIL') && <LayerLabel text="SUB SOIL" y={-0.825} />}
      {labels.includes('BED ROCK') && <LayerLabel text="BED ROCK" y={-1.51} />}
      {labels.includes('GROUND WATER') && <LayerLabel text="GROUND WATER" y={-2.25} />}
    </group>
  )
}

function DioramaCards({ progress }: { progress: number }) {
  const waterProgress = Math.round(THREE.MathUtils.clamp((progress - 0.71) / 0.19, 0, 1) * 100)
  return (
    <>
      <Card title="Rotary drilling" position={[5.2, 8.5, 1.5]}>
        <p>Drilling for homes, farms, and businesses.</p>
      </Card>
      <Card title="Pump service" position={[-14.5, 4.7, 8.5]}>
        <p>Repair and replacement.</p>
      </Card>
      <Card title="Clean water" position={[15, 5.5, 8]}>
        <p>Water level <strong>[CONFIRM]</strong></p>
        <div className="diorama-progress" role="progressbar" aria-label="Water level progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={waterProgress}><span style={{ width: `${waterProgress}%` }} /></div>
      </Card>
    </>
  )
}

export const JourneyScene: React.FC<JourneySceneProps> = ({ progress, onDrawCallCount, isMobile = false, surfaceOnly = false }) => {
  const { camera, gl, scene, size } = useThree()
  const callsReported = useRef(false)
  const baseAngle = Math.PI / 4
  const whiteMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ ...white }), [])
  const easedAngle = useRef(baseAngle)
  const modelState = getDioramaModelState(progress)

  useFrame(({ pointer }, delta) => {
    const scrollOrbit = Math.sin(Math.min(1, Math.max(0, progress)) * Math.PI) * (8 * Math.PI / 180)
    const mouseOrbit = isMobile ? 0 : pointer.x * (2 * Math.PI / 180)
    easedAngle.current = THREE.MathUtils.damp(easedAngle.current, baseAngle + scrollOrbit + mouseOrbit, 4, delta)
    const angle = easedAngle.current
    const deliveryPullback = THREE.MathUtils.smoothstep(progress, 0.91, 1) * 4
    const aspect = size.width / Math.max(1, size.height)
    const framingScale = surfaceOnly ? Math.min(1.8, Math.max(1, 1.3 / aspect)) : 1
    const radius = (surfaceOnly ? 52 : 54) * framingScale + deliveryPullback
    camera.position.set(
      Math.sin(angle) * radius,
      (surfaceOnly ? 34 : 36) * framingScale + Math.abs(pointer.y) * (isMobile ? 0 : 0.2),
      Math.cos(angle) * radius,
    )
    camera.lookAt(0, surfaceOnly ? 1 : 2, 0)
    if (!callsReported.current && onDrawCallCount && gl.info.render.calls) {
      callsReported.current = true
      onDrawCallCount(gl.info.render.calls)
    }
  })

  React.useEffect(() => () => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      }
    })
    whiteMaterial.dispose()
  }, [scene, whiteMaterial])

  return (
    <>
      <fog attach="fog" args={['#dbeafe', 70, 120]} />
      <hemisphereLight args={['#ffffff', '#e0f2fe', 0.8]} />
      <directionalLight position={[10, 18, 12]} intensity={1.2} castShadow={!isMobile} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-12, 10, 3]} intensity={0.5} />

      {/* Raised white platform, soft grey site pad, and a thin road loop */}
      <mesh position={[0, -0.24, 0]} receiveShadow><boxGeometry args={[40, 0.4, 28]} /><primitive object={whiteMaterial} attach="material" /></mesh>
      <mesh position={[0, 0, 0]} receiveShadow><boxGeometry args={[39.2, 0.1, 27.2]} /><meshPhysicalMaterial color="#e2e8f0" roughness={0.55} clearcoat={0.25} /></mesh>
      <mesh position={[0, 0.055, -13.15]}><boxGeometry args={[38.4, 0.035, 0.3]} /><meshPhysicalMaterial color="#cbd5e1" roughness={0.62} /></mesh>
      <mesh position={[0, 0.055, 13.15]}><boxGeometry args={[38.4, 0.035, 0.3]} /><meshPhysicalMaterial color="#cbd5e1" roughness={0.62} /></mesh>
      <mesh position={[-19.15, 0.055, 0]}><boxGeometry args={[0.3, 0.035, 26]} /><meshPhysicalMaterial color="#cbd5e1" roughness={0.62} /></mesh>
      <mesh position={[19.15, 0.055, 0]}><boxGeometry args={[0.3, 0.035, 26]} /><meshPhysicalMaterial color="#cbd5e1" roughness={0.62} /></mesh>

      <HouseAndPump progress={progress} />
      <Tank />
      <WellHead position={[at('well-head-1')[0], PLATFORM_TOP, at('well-head-1')[1]]} />
      <WellHead position={[at('well-head-2')[0], PLATFORM_TOP, at('well-head-2')[1]]} />
      <WellHead position={[at('well-head-3')[0], PLATFORM_TOP, at('well-head-3')[1]]} />
      <Pond state={modelState} reducedMotion={false} />

      {/* Flag and compact cutaway reveal only during drilling */}
      {!surfaceOnly && progress >= 0.3 && <group position={[at('drill-rig-and-flag')[0], 0, at('drill-rig-and-flag')[1]]}>
        <mesh position={[0, 0.75, 0]}><cylinderGeometry args={[0.035, 0.035, 1.5, 6]} /><meshPhysicalMaterial color="#f8fafc" /></mesh>
        <mesh position={[0.25, 1.34, 0]}><planeGeometry args={[0.48, 0.3]} /><meshPhysicalMaterial color="#38bdf8" side={THREE.DoubleSide} /></mesh>
      </group>}

      {/* Existing drilling story models */}
      <Truck progress={surfaceOnly ? 0 : progress} />
      {!surfaceOnly && <RigMast progress={progress} />}
      {surfaceOnly && <SurfaceRig />}
      {!surfaceOnly && <Cutaway progress={progress} />}
      {!surfaceOnly && <CasingStory progress={progress} state={modelState} />}
      {!surfaceOnly && <Manager progress={progress} isMobile={isMobile} />}

      <Tree position={[at('tree-nw')[0], PLATFORM_TOP, at('tree-nw')[1]]} canopy="#99f6e4" />
      <Tree position={[at('tree-ne')[0], PLATFORM_TOP, at('tree-ne')[1]]} canopy="#a5f3fc" />
      <Tree position={[at('tree-sw')[0], PLATFORM_TOP, at('tree-sw')[1]]} canopy="#99f6e4" />
      <Tree position={[at('tree-se')[0], PLATFORM_TOP, at('tree-se')[1]]} canopy="#a5f3fc" />
      {[-10, -6, -2, 2, 6, 10].flatMap((x, index) => [-13, 13].map((z) => (
        <mesh key={`${index}-${z}`} position={[x, 0.65, z]} castShadow><boxGeometry args={[1.8, 1.2, 0.08]} /><meshPhysicalMaterial {...white} /></mesh>
      )))}
      {!surfaceOnly && <DioramaCards progress={progress} />}
    </>
  )
}

export default JourneyScene
