import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { WaterDroplet } from './WaterDroplet'
import { WellCasing } from './WellCasing'

export const Hero3DCanvas: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 0.8, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} color="#e0f2fe" />
        <directionalLight position={[4, 5, 3]} intensity={1.5} color="#ffffff" castShadow />
        <pointLight position={[-3, -2, -2]} intensity={0.8} color="#0284c7" />

        <WaterDroplet />
        <WellCasing />
      </Canvas>
    </Suspense>
  )
}

export default Hero3DCanvas
