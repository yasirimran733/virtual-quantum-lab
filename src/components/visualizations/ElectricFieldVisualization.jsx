import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Electric Field Visualization Component
 * Displays charges, field lines, and vector field
 */
export const ElectricFieldVisualization = ({ 
  charges = [],
  fieldData = [],
  showFieldLines = true,
  showVectors = true 
}) => {
  const fieldLinesRef = useRef([])
  const groupRef = useRef(new THREE.Group())

  // Create field lines
  useEffect(() => {
    // Clear existing lines
    groupRef.current.clear()
    fieldLinesRef.current = []

    if (!showFieldLines || charges.length === 0) return

    // Generate field lines from each charge
    charges.forEach((charge) => {
      const numLines = 12
      
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2
        const points = []
        
        // Generate field line points
        for (let r = 0.5; r < 10; r += 0.2) {
          const x = charge.position.x + r * Math.cos(angle)
          const y = charge.position.y + r * Math.sin(angle)
          const z = 0
          points.push(new THREE.Vector3(x, y, z))
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({ 
          color: charge.q > 0 ? 0xff4444 : 0x4444ff,
          opacity: 0.6,
          transparent: true
        })
        const line = new THREE.Line(geometry, material)
        groupRef.current.add(line)
        fieldLinesRef.current.push(line)
      }
    })
  }, [charges, showFieldLines])

  return (
    <>
      {/* Render charges */}
      {charges.map((charge, index) => (
        <mesh 
          key={`charge-${index}`}
          position={[charge.position.x, charge.position.y, charge.position.z]}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={charge.q > 0 ? '#ff4444' : '#4444ff'}
            emissive={charge.q > 0 ? '#ff4444' : '#4444ff'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Render field lines */}
      {showFieldLines && <primitive object={groupRef.current} />}

      {/* Render vector field */}
      {showVectors && fieldData.map((field, index) => {
        if (field.magnitude < 0.1) return null
        const direction = new THREE.Vector3(field.x, field.y, field.z).normalize()
        const origin = new THREE.Vector3(field.point.x, field.point.y, field.point.z)
        const length = Math.min(field.magnitude * 0.3, 1)
        const arrow = new THREE.ArrowHelper(direction, origin, length, 0xffff00, 0.05, 0.03)
        return (
          <primitive key={`vector-${index}`} object={arrow} />
        )
      })}
    </>
  )
}

export default ElectricFieldVisualization

