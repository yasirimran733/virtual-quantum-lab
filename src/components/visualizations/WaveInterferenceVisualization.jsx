import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Wave Interference Visualization Component
 * Displays animated wavefronts and interference patterns
 */
export const WaveInterferenceVisualization = ({ 
  sources = [],
  waveData = [],
  time = 0,
  showInterference = true 
}) => {
  const waveMeshRef = useRef()
  const sourcesRef = useRef([])

  // Create wave mesh
  useEffect(() => {
    if (!waveMeshRef.current) return

    const size = 20
    const segments = 100
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
    
    // Update vertices based on wave interference
    const positions = geometry.attributes.position
    const colors = new Float32Array(positions.count * 3)

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      
      let amplitude = 0
      sources.forEach((source) => {
        const dx = x - source.position.x
        const dy = y - source.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const wave = source.amplitude * Math.sin(2 * Math.PI * (distance / source.wavelength - source.frequency * time))
        amplitude += wave
      })

      // Normalize amplitude for color
      const normalized = (amplitude + 2) / 4 // Map from [-2, 2] to [0, 1]
      colors[i * 3] = normalized
      colors[i * 3 + 1] = normalized
      colors[i * 3 + 2] = 1
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    if (waveMeshRef.current.geometry) {
      waveMeshRef.current.geometry.dispose()
    }
    waveMeshRef.current.geometry = geometry
  }, [sources, time, showInterference])

  // Animate wave
  useFrame((state) => {
    if (waveMeshRef.current && sources.length > 0) {
      const positions = waveMeshRef.current.geometry.attributes.position
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        
        let z = 0
        sources.forEach((source) => {
          const dx = x - source.position.x
          const dy = y - source.position.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const wave = source.amplitude * Math.sin(2 * Math.PI * (distance / source.wavelength - source.frequency * state.clock.elapsedTime))
          z += wave
        })
        
        positions.setZ(i, z * 0.1) // Scale down for visualization
      }
      
      positions.needsUpdate = true
    }
  })

  return (
    <>
      {/* Wave surface */}
      <mesh ref={waveMeshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <bufferGeometry />
        <meshStandardMaterial 
          vertexColors
          wireframe={false}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Wave sources */}
      {sources.map((source, index) => (
        <mesh 
          key={`source-${index}`}
          position={[source.position.x, source.position.y, 0.5]}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#4ecdc4"
            emissive="#4ecdc4"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </>
  )
}

export default WaveInterferenceVisualization

