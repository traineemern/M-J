import { describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import * as THREE from 'three'
import { disposeManagerModel } from './ManagerDisposal'

function readGlbJson(relativePath: string) {
  const data = readFileSync(new URL(relativePath, import.meta.url))
  expect(data.toString('ascii', 0, 4)).toBe('glTF')
  const jsonLength = data.readUInt32LE(12)
  return JSON.parse(data.toString('utf8', 20, 20 + jsonLength).trim()) as {
    nodes: Array<{ name?: string }>
    animations: Array<{
      name?: string
      channels: Array<{ target: { node: number; path: string } }>
    }>
  }
}

describe('manager GLB assets', () => {
  it('includes the walk clip without root or Hips translation tracks', () => {
    const walk = readGlbJson('../../../../public/models/manager-walk.glb')
    const animation = walk.animations[0]
    expect(animation.name).toBe('walk')
    const translatedNodes = animation.channels
      .filter((channel) => channel.target.path === 'translation')
      .map((channel) => walk.nodes[channel.target.node]?.name)
    expect(translatedNodes).toEqual([])
  })

  it('disposes the manager mixer, geometry, materials, texture, and skeleton', () => {
    const root = new THREE.Group()
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshStandardMaterial()
    const texture = new THREE.Texture()
    material.map = texture
    const mesh = new THREE.SkinnedMesh(geometry, material)
    const skeleton = new THREE.Skeleton([])
    mesh.skeleton = skeleton
    root.add(mesh)
    const mixer = new THREE.AnimationMixer(root)
    const geometryDispose = vi.spyOn(geometry, 'dispose')
    const materialDispose = vi.spyOn(material, 'dispose')
    const textureDispose = vi.spyOn(texture, 'dispose')
    const skeletonDispose = vi.spyOn(skeleton, 'dispose')
    const stopAllAction = vi.spyOn(mixer, 'stopAllAction')
    const uncacheRoot = vi.spyOn(mixer, 'uncacheRoot')

    disposeManagerModel(root, mixer)

    expect(stopAllAction).toHaveBeenCalledOnce()
    expect(uncacheRoot).toHaveBeenCalledWith(root)
    expect(geometryDispose).toHaveBeenCalledOnce()
    expect(materialDispose).toHaveBeenCalledOnce()
    expect(textureDispose).toHaveBeenCalledOnce()
    expect(skeletonDispose).toHaveBeenCalledOnce()
  })
})
