import * as THREE from 'three'

export const RiverWaterShader = {
  uniforms: {
    uTime: { value: 0 },
    uFlowSpeed: { value: 0.15 },
    uBaseColor: { value: new THREE.Color('#0E5A84') },       // water-700
    uHighlightColor: { value: new THREE.Color('#A9DCF0') },  // water-200
    uFresnelColor: { value: new THREE.Color('#7dd3fc') },    // water-300
    uFoamColor: { value: new THREE.Color('#ffffff') },
    uDeepWaterFactor: { value: 0.0 },                        // Shifts to deeper blue during cutaway
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vec4 mvPosition = viewMatrix * worldPosition;
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uFlowSpeed;
    uniform vec3 uBaseColor;
    uniform vec3 uHighlightColor;
    uniform vec3 uFresnelColor;
    uniform vec3 uFoamColor;
    uniform float uDeepWaterFactor;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    // Procedural 2D noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      // Animated UVs along flow direction
      float flowOffset = uTime * uFlowSpeed;
      vec2 uv1 = vec2(vUv.x * 4.0, vUv.y + flowOffset * 1.2);
      vec2 uv2 = vec2(vUv.x * 6.0 + 0.3, vUv.y * 1.5 - flowOffset * 0.8);

      // Two layers of procedural noise for ripples sampled at different speeds
      float n1 = noise(uv1 * 3.0);
      float n2 = noise(uv2 * 5.0);
      float ripple = n1 * 0.6 + n2 * 0.4;

      // Base water color blended with highlights
      vec3 waterColor = mix(uBaseColor, uHighlightColor, ripple * 0.6);

      // Deep water aquifer color shift during cutaway (Chapter 4)
      vec3 deepAquiferColor = vec3(0.015, 0.22, 0.38); // deeper aquifer blue
      waterColor = mix(waterColor, deepAquiferColor, uDeepWaterFactor);

      // Bank foam: edge distance from channel center > 0.85 of half-width
      // vUv.x goes from 0 (left bank) to 1 (right bank), center is 0.5
      float bankDist = abs(vUv.x - 0.5) * 2.0; // 0 at center, 1 at bank
      float foamEdge = smoothstep(0.82, 0.98, bankDist);
      float foamNoise = noise(vec2(vUv.x * 20.0, vUv.y * 8.0 + flowOffset * 2.0));
      float foam = foamEdge * (0.6 + 0.4 * foamNoise);

      // Fresnel edge tint using view direction and surface normal
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.5);
      vec3 surfaceWithFresnel = mix(waterColor, uFresnelColor, fresnel * 0.45);

      // Combine water surface with foam
      vec3 finalColor = mix(surfaceWithFresnel, uFoamColor, foam * 0.85);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
}
