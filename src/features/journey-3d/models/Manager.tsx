import React, { useEffect, useMemo, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { getManagerClipForProgress, type ManagerClip } from '../beats'
import { disposeManagerModel } from './ManagerDisposal'

const CHARACTER_PATH = '/models/manager-character.glb'
const CLIP_PATHS = [
  '/models/manager-idle.glb',
  '/models/manager-walk.glb',
  '/models/manager-kneel.glb',
  '/models/manager-stand-up.glb',
  '/models/manager-look.glb',
  '/models/manager-clipboard.glb',
]

interface ManagerProps {
  progress: number
  isMobile?: boolean
}

function cloneModel(scene: THREE.Group, isMobile: boolean) {
  const clone = cloneSkinned(scene) as THREE.Group
  clone.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    object.geometry = object.geometry.clone()
    const cloneMaterial = (material: THREE.Material) => {
      const next = material.clone()
      for (const [key, value] of Object.entries(next)) {
        if (value instanceof THREE.Texture) {
          ;(next as unknown as Record<string, unknown>)[key] = value.clone()
        }
      }
      return next
    }
    object.material = Array.isArray(object.material)
      ? object.material.map(cloneMaterial)
      : cloneMaterial(object.material)
    object.castShadow = !isMobile
    object.frustumCulled = true
  })
  return clone
}

function getManagerPosition(progress: number): { x: number; z: number; rotation: number } {
  if (progress < 0.34) {
    const t = THREE.MathUtils.clamp((progress - 0.29) / 0.05, 0, 1)
    return { x: THREE.MathUtils.lerp(9, 2.5, t), z: 5, rotation: -Math.PI / 2 }
  }
  if (progress < 0.465) return { x: 2.5, z: 4.9, rotation: Math.PI }
  if (progress < 0.83) return { x: 3.2, z: 3.4, rotation: Math.PI / 8 }
  if (progress < 0.91) return { x: 2.2, z: 2, rotation: -Math.PI / 3 }
  const t = THREE.MathUtils.clamp((progress - 0.91) / 0.09 / 0.6, 0, 1)
  return {
    x: THREE.MathUtils.lerp(2.2, -10.8, t),
    z: THREE.MathUtils.lerp(2, -4.8, t),
    rotation: t < 1 ? -Math.PI / 2 : Math.PI,
  }
}

export const Manager: React.FC<ManagerProps> = ({ progress, isMobile = false }) => {
  const groupRef = useRef<THREE.Group>(null)
  const activeAction = useRef<THREE.AnimationAction | null>(null)
  const modelGltf = useGLTF(CHARACTER_PATH, true)
  const clipGltfs = useGLTF(CLIP_PATHS, true)
  const model = useMemo(() => cloneModel(modelGltf.scene, isMobile), [modelGltf.scene, isMobile])
  const animations = useMemo(
    () => (clipGltfs as { animations: THREE.AnimationClip[] }[]).flatMap((gltf) => gltf.animations),
    [clipGltfs],
  )
  const { actions, mixer } = useAnimations(animations, groupRef)
  const activeClip = getManagerClipForProgress(progress)
  const position = getManagerPosition(progress)

  useEffect(() => {
    if (!activeClip) return
    const nextAction = actions[activeClip as ManagerClip]
    if (!nextAction) return

    const previous = activeAction.current
    if (previous && previous !== nextAction) previous.fadeOut(0.25)
    nextAction.reset().fadeIn(previous ? 0.25 : 0).play()
    activeAction.current = nextAction
  }, [activeClip, actions])

  useEffect(() => () => disposeManagerModel(model, mixer, groupRef.current ?? model), [mixer, model])

  if (!activeClip) return null

  return (
    <group
      ref={groupRef}
      position={[position.x, 0, position.z]}
      rotation={[0, position.rotation, 0]}
      scale={0.91}
    >
      <primitive object={model} dispose={null} />
    </group>
  )
}

useGLTF.preload(CHARACTER_PATH)
CLIP_PATHS.forEach((path) => useGLTF.preload(path))
