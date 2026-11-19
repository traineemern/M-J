import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { riverCurve, createRiverRibbonGeometry } from './riverCurve'
import { RiverWaterShader } from './RiverShader'

interface RiverWaterProps {
  scrollProgress: number
}

export const RiverWater: React.FC<RiverWaterProps> = ({ scrollProgress }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // 1. River Surface Ribbon Geometry (200 x 24 segments, 14 units wide)
  const waterGeometry = useMemo(() => {
    return createRiverRibbonGeometry(riverCurve, 200, 24, 14, 0)
  }, [])

  // 2. Riverbed Geometry (under the water at yOffset = -1.6, 15 units wide)
  const bedGeometry = useMemo(() => {
    return createRiverRibbonGeometry(riverCurve, 120, 12, 15.5, -1.6)
  }, [])

  // 3. Custom River Shader Material
  const waterMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(RiverWaterShader.uniforms),
      vertexShader: RiverWaterShader.vertexShader,
      fragmentShader: RiverWaterShader.fragmentShader,
      transparent: false,
      side: THREE.DoubleSide,
    })
  }, [])

  // 4. Dark blue-grey Riverbed Material so depth reads clearly
  const bedMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#082f49', // dark blue-grey riverbed
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide,
    })
  }, [])

  // Unconditional frame loop - updates flow time, scroll-linked speed & deep aquifer factor
  useFrame((_state, delta) => {
    if (!materialRef.current) return

    // Dynamic speed based on chapter progress:
    // 0-0.15: 0.15 (gentle source)
    // 0.15-0.30: 0.30 (speed doubles as river narrows)
    // 0.30-0.45: 0.20
    // 0.45-0.65: 0.22 (aquifer cutaway)
    // 0.65-0.85: 0.12 (wide reach, eases back)
    // 0.85-1.0: 0.10
    let targetSpeed = 0.15
    let deepFactor = 0.0

    if (scrollProgress >= 0.15 && scrollProgress < 0.30) {
      targetSpeed = 0.30 // doubles
    } else if (scrollProgress >= 0.30 && scrollProgress < 0.45) {
      targetSpeed = 0.20
    } else if (scrollProgress >= 0.45 && scrollProgress <= 0.65) {
      targetSpeed = 0.22
      deepFactor = 0.85 // groundwater aquifer shift
    } else if (scrollProgress > 0.65 && scrollProgress <= 0.85) {
      targetSpeed = 0.12 // eases back in wide reach
    } else if (scrollProgress > 0.85) {
      targetSpeed = 0.10
    }

    materialRef.current.uniforms.uFlowSpeed.value = targetSpeed
    materialRef.current.uniforms.uDeepWaterFactor.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uDeepWaterFactor.value,
      deepFactor,
      0.08
    )
    materialRef.current.uniforms.uTime.value += delta
  })

  // Dispose geometries and materials on unmount
  useEffect(() => {
    return () => {
      waterGeometry.dispose()
      bedGeometry.dispose()
      waterMaterial.dispose()
      bedMaterial.dispose()
    }
  }, [waterGeometry, bedGeometry, waterMaterial, bedMaterial])

  return (
    <group name="river-group">
      {/* River Surface Ribbon */}
      <mesh
        name="river-water-mesh"
        geometry={waterGeometry}
        material={waterMaterial}
        ref={(mesh) => {
          if (mesh) {
            materialRef.current = mesh.material as THREE.ShaderMaterial
          }
        }}
      />

      {/* Riverbed Mesh */}
      <mesh
        name="river-bed-mesh"
        geometry={bedGeometry}
        material={bedMaterial}
      />
    </group>
  )
}
