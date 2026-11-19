import * as THREE from 'three'

// 12-point CatmullRomCurve3 defining a ~200 unit river channel
export const RIVER_POINTS: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 0),          // 0%: River source (Chapter 1)
  new THREE.Vector3(3.5, -0.2, -18),   // Gentle bend right
  new THREE.Vector3(6.0, -0.6, -36),   // 15%-30%: River narrows, speed doubles (Chapter 2)
  new THREE.Vector3(2.5, -1.0, -56),   // Gentle meander
  new THREE.Vector3(-4.0, -1.8, -78),  // 30%-45%: Service cards along banks (Chapter 3)
  new THREE.Vector3(-7.0, -3.0, -98),  // Entering cutaway
  new THREE.Vector3(-4.5, -5.5, -118), // 45%-65%: Deep aquifer cutaway (Chapter 4)
  new THREE.Vector3(1.5, -4.5, -138),  // Subterranean flow
  new THREE.Vector3(7.0, -2.5, -158),  // Rising to surface
  new THREE.Vector3(5.0, -1.0, -174),  // 65%-85%: Wide reach (Chapter 5)
  new THREE.Vector3(1.5, -0.2, -188),  // Calming reach
  new THREE.Vector3(0, 0.2, -200),     // 85%-100%: Surface finale (Chapter 6)
]

export const riverCurve = new THREE.CatmullRomCurve3(RIVER_POINTS, false, 'catmullrom', 0.5)

/**
 * Builds a Ribbon PlaneGeometry following the CatmullRom curve.
 * lengthSegments = 200, widthSegments = 24, channelWidth = 14
 */
export function createRiverRibbonGeometry(
  curve: THREE.CatmullRomCurve3,
  lengthSegments = 200,
  widthSegments = 24,
  channelWidth = 14,
  yOffset = 0
): THREE.BufferGeometry {
  const vertexCount = (lengthSegments + 1) * (widthSegments + 1)
  const positions = new Float32Array(vertexCount * 3)
  const normals = new Float32Array(vertexCount * 3)
  const uvs = new Float32Array(vertexCount * 2)
  const indices: number[] = []

  const up = new THREE.Vector3(0, 1, 0)

  for (let i = 0; i <= lengthSegments; i++) {
    const t = i / lengthSegments
    const center = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t).normalize()
    // Normal perpendicular to tangent on XZ plane
    const binormal = new THREE.Vector3().crossVectors(tangent, up).normalize()

    for (let j = 0; j <= widthSegments; j++) {
      const u = j / widthSegments
      const widthOffset = (u - 0.5) * channelWidth

      const vertIndex = i * (widthSegments + 1) + j
      const x = center.x + binormal.x * widthOffset
      const y = center.y + yOffset
      const z = center.z + binormal.z * widthOffset

      positions[vertIndex * 3] = x
      positions[vertIndex * 3 + 1] = y
      positions[vertIndex * 3 + 2] = z

      normals[vertIndex * 3] = 0
      normals[vertIndex * 3 + 1] = 1
      normals[vertIndex * 3 + 2] = 0

      uvs[vertIndex * 2] = u // 0 at left bank, 1 at right bank
      uvs[vertIndex * 2 + 1] = t * 15 // repeat UVs along length for ripple texture
    }
  }

  for (let i = 0; i < lengthSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const a = i * (widthSegments + 1) + j
      const b = (i + 1) * (widthSegments + 1) + j
      const c = (i + 1) * (widthSegments + 1) + (j + 1)
      const d = i * (widthSegments + 1) + (j + 1)

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}
