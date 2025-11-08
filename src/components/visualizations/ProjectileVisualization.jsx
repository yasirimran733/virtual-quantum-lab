import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Projectile Motion Visualization Component
 * Displays projectile trajectory with real-time updates
 */
export const ProjectileVisualization = ({ 
  position, 
  velocity, 
  trajectory = [],
  isRunning = false 
}) => {
  const projectileRef = useRef()
  const trailRef = useRef()
  const trajectoryLineRef = useRef()

  // Update projectile position
  useFrame(() => {
    if (projectileRef.current && position) {
      projectileRef.current.position.set(position.x, position.y, position.z)
    }
  })

  // Create trajectory line
  useEffect(() => {
    if (trajectoryLineRef.current && trajectory.length > 0) {
      const points = trajectory.map(p => new THREE.Vector3(p.x, p.y, p.z))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      trajectoryLineRef.current.geometry.dispose()
      trajectoryLineRef.current.geometry = geometry
    }
  }, [trajectory])

  return (
    <>
      {/* Projectile sphere */}
      <mesh ref={projectileRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.5} />
      </mesh>

      {/* Trajectory line */}
      <line ref={trajectoryLineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#4ecdc4" linewidth={2} />
      </line>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>

      {/* Launch point indicator */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* Velocity vector arrow */}
      {velocity && (() => {
        const direction = new THREE.Vector3(velocity.x, velocity.y, velocity.z).normalize()
        const origin = new THREE.Vector3(position.x, position.y, position.z)
        const length = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2) * 0.5
        const arrow = new THREE.ArrowHelper(direction, origin, length, 0x3498db, 0.1, 0.05)
        return <primitive object={arrow} />
      })()}
    </>
  )
}

export default ProjectileVisualization

