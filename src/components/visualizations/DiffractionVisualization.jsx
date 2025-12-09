import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const DiffractionShaderMaterial = {
  uniforms: {
    uWavelength: { value: 500e-9 },
    uSlitWidth: { value: 1e-6 },
    uSlitSeparation: { value: 5e-6 },
    uDistance: { value: 1.0 },
    uIntensity: { value: 1.0 },
    uMode: { value: 0 }, // 0: Single, 1: Double
    uColor: { value: new THREE.Color(0.0, 1.0, 0.0) },
    uResolution: { value: new THREE.Vector2(1, 1) }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uWavelength;
    uniform float uSlitWidth;
    uniform float uSlitSeparation;
    uniform float uDistance;
    uniform float uIntensity;
    uniform int uMode;
    uniform vec3 uColor;
    
    varying vec2 vUv;
    varying vec3 vPosition;

    #define PI 3.14159265359

    void main() {
      // Calculate angle theta based on position on screen
      // vPosition.y is the vertical distance from center
      // tan(theta) = y / L  => theta = atan(y / L)
      float theta = atan(vPosition.y, uDistance);
      float sinTheta = sin(theta);

      // Beta for single-slit diffraction envelope
      // β = (π * a * sin(θ)) / λ
      float beta = (PI * uSlitWidth * sinTheta) / uWavelength;
      
      // Single slit diffraction factor: (sin(β) / β)^2
      float diffractionFactor = 1.0;
      if (abs(beta) > 0.001) {
        diffractionFactor = pow(sin(beta) / beta, 2.0);
      }

      float totalIntensity = 0.0;

      if (uMode == 0) {
        // Single Slit
        totalIntensity = uIntensity * diffractionFactor;
      } else {
        // Double Slit
        // Alpha for interference
        // α = (π * d * sin(θ)) / λ
        float alpha = (PI * uSlitSeparation * sinTheta) / uWavelength;
        float interferenceFactor = pow(cos(alpha), 2.0);
        
        totalIntensity = uIntensity * interferenceFactor * diffractionFactor;
      }

      // Apply intensity to color
      // Use a power curve for better visual dynamic range
      float visualIntensity = pow(totalIntensity, 0.45); 
      
      gl_FragColor = vec4(uColor * visualIntensity, 1.0);
    }
  `
}

export const DiffractionVisualization = ({ 
  wavelength, 
  slitWidth, 
  slitSeparation, 
  distance, 
  intensity, 
  mode,
  theme
}) => {
  const materialRef = useRef()
  
  // Convert wavelength to RGB color for visualization
  const waveColor = useMemo(() => {
    // Simple approximation of spectral color
    const nm = wavelength * 1e9
    const color = new THREE.Color()
    if (nm >= 380 && nm < 440) color.setHSL(0.75 + 0.25 * (440 - nm) / 60, 1, 0.5)
    else if (nm >= 440 && nm < 490) color.setHSL(0.55 + 0.2 * (490 - nm) / 50, 1, 0.5)
    else if (nm >= 490 && nm < 510) color.setHSL(0.45 + 0.1 * (510 - nm) / 20, 1, 0.5)
    else if (nm >= 510 && nm < 580) color.setHSL(0.15 + 0.3 * (580 - nm) / 70, 1, 0.5)
    else if (nm >= 580 && nm < 645) color.setHSL(0.05 + 0.1 * (645 - nm) / 65, 1, 0.5)
    else if (nm >= 645 && nm <= 780) color.setHSL(0.0, 1, 0.5)
    else color.setHex(0xffffff)
    return color
  }, [wavelength])

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uWavelength.value = wavelength
      materialRef.current.uniforms.uSlitWidth.value = slitWidth
      materialRef.current.uniforms.uSlitSeparation.value = slitSeparation
      materialRef.current.uniforms.uDistance.value = distance
      materialRef.current.uniforms.uIntensity.value = intensity
      materialRef.current.uniforms.uMode.value = mode === 'single' ? 0 : 1
      materialRef.current.uniforms.uColor.value = waveColor
    }
  })

  return (
    <>
      <color attach="background" args={[theme === 'dark' ? '#000000' : '#f0f2f5']} />
      <ambientLight intensity={0.1} />
      
      {/* Slit Barrier Representation */}
      <group position={[0, 0, -distance/2]}>
        {mode === 'single' ? (
          <>
            {/* Single Slit: Two barriers with a gap */}
            <mesh position={[0, 2 + slitWidth * 500, 0]}>
              <boxGeometry args={[0.1, 4, 0.1]} />
              <meshStandardMaterial color="#34495e" />
            </mesh>
            <mesh position={[0, -2 - slitWidth * 500, 0]}>
              <boxGeometry args={[0.1, 4, 0.1]} />
              <meshStandardMaterial color="#34495e" />
            </mesh>
          </>
        ) : (
          <>
            {/* Double Slit: Three barriers with two gaps */}
            {/* Top Barrier */}
            <mesh position={[0, 2 + slitSeparation * 250, 0]}>
              <boxGeometry args={[0.1, 4, 0.1]} />
              <meshStandardMaterial color="#34495e" />
            </mesh>
            {/* Middle Barrier */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.1, slitSeparation * 500 - slitWidth * 1000, 0.1]} />
              <meshStandardMaterial color="#34495e" />
            </mesh>
            {/* Bottom Barrier */}
            <mesh position={[0, -2 - slitSeparation * 250, 0]}>
              <boxGeometry args={[0.1, 4, 0.1]} />
              <meshStandardMaterial color="#34495e" />
            </mesh>
          </>
        )}
      </group>

      {/* Screen with diffraction pattern shader */}
      <mesh position={[0, 0, distance/2]}>
        <planeGeometry args={[2, 4]} />
        <shaderMaterial 
          ref={materialRef}
          args={[DiffractionShaderMaterial]}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Light source visualization */}
      <pointLight position={[0, 0, -distance]} intensity={1} color={waveColor} />
      
      {/* Light Beams (Visual Aid) */}
      <mesh position={[0, 0, -distance * 0.75]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, distance/2, 8]} />
        <meshBasicMaterial color={waveColor} transparent opacity={0.3} />
      </mesh>
    </>
  )
}

export default DiffractionVisualization
