import * as THREE from 'three'

export function disposeManagerModel(
  model: THREE.Group,
  mixer: THREE.AnimationMixer,
  animationRoot: THREE.Object3D = model,
) {
  mixer.stopAllAction()
  mixer.uncacheRoot(animationRoot)
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    object.geometry.dispose()
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    materials.forEach((material) => {
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) value.dispose()
      }
      material.dispose()
    })
    if (object instanceof THREE.SkinnedMesh) object.skeleton.dispose()
  })
}
