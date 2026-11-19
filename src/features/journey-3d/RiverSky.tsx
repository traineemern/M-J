import React, { useMemo, useEffect } from 'react'
import * as THREE from 'three'

export const RiverSky: React.FC = () => {
  const skyGeometry = useMemo(() => new THREE.PlaneGeometry(300, 120), [])

  const skyMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 256)
      grad.addColorStop(0, '#f0f9ff')   // water-50
      grad.addColorStop(0.5, '#e0f2fe') // light sky
      grad.addColorStop(0.85, '#bae6fd')
      grad.addColorStop(1, '#ffffff')   // horizon glow
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 16, 256)
    }
    const texture = new THREE.CanvasTexture(canvas)
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  }, [])

  useEffect(() => {
    return () => {
      skyGeometry.dispose()
      skyMaterial.dispose()
    }
  }, [skyGeometry, skyMaterial])

  return (
    <mesh
      name="river-sky-plane"
      geometry={skyGeometry}
      material={skyMaterial}
      position={[0, 40, -230]}
    />
  )
}
