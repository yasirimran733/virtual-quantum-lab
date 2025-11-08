import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Relativity Visualization Component
 * Displays time dilation and Lorentz contraction effects
 * 
 * TODO: Implement full Lorentz transformation visualization
 * TODO: Add spacetime diagram visualization
 * TODO: Implement relativistic Doppler effect
 */
export const RelativityVisualization = ({ 
  velocity = 0, // Fraction of light speed (0 to 0.99)
  properLength = 2,
  properTime = 1,
  showTimeDilation = true,
  showLengthContraction = true
}) => {
  const restFrameRef = useRef()
  const movingFrameRef = useRef()
  const clockRestRef = useRef()
  const clockMovingRef = useRef()
  const gridRestRef = useRef()
  const gridMovingRef = useRef()
  const timeRef = useRef(0)

  // Calculate relativistic effects
  const c = 1 // Normalized speed of light
  const beta = Math.min(velocity, 0.99) // Limit to avoid division by zero
  const gamma = 1 / Math.sqrt(1 - beta * beta)
  const contractedLength = properLength / gamma
  const dilatedTime = properTime * gamma

  // Create reference frames
  useEffect(() => {
    // Rest frame (stationary observer)
    if (restFrameRef.current) {
      restFrameRef.current.clear()
      
      // Grid for rest frame
      const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222)
      restFrameRef.current.add(gridHelper)
      
      // Object at rest
      const boxGeometry = new THREE.BoxGeometry(properLength, 0.5, 0.5)
      const boxMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3498db,
        transparent: true,
        opacity: 0.7
      })
      const box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.position.set(0, 0.5, 0)
      restFrameRef.current.add(box)
    }

    // Moving frame
    if (movingFrameRef.current) {
      movingFrameRef.current.clear()
      
      // Grid for moving frame (will be contracted)
      const gridHelper = new THREE.GridHelper(10, 10, 0xff4444, 0xaa2222)
      gridHelper.scale.x = contractedLength / properLength
      movingFrameRef.current.add(gridHelper)
      
      // Contracted object
      const boxGeometry = new THREE.BoxGeometry(contractedLength, 0.5, 0.5)
      const boxMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe74c3c,
        transparent: true,
        opacity: 0.7
      })
      const box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.position.set(0, 0.5, 0)
      movingFrameRef.current.add(box)
    }
  }, [velocity, properLength, contractedLength])

  // Create clocks
  useEffect(() => {
    // Rest frame clock
    if (clockRestRef.current) {
      clockRestRef.current.clear()
      
      const clockGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32)
      const clockMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db })
      const clock = new THREE.Mesh(clockGeometry, clockMaterial)
      clock.position.set(-3, 1, 0)
      clockRestRef.current.add(clock)
      
      // Clock hands
      const handGeometry = new THREE.BoxGeometry(0.02, 0.2, 0.02)
      const handMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
      const hourHand = new THREE.Mesh(handGeometry, handMaterial)
      hourHand.position.set(-3, 1.1, 0)
      clockRestRef.current.add(hourHand)
    }

    // Moving frame clock (runs slower)
    if (clockMovingRef.current) {
      clockMovingRef.current.clear()
      
      const clockGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32)
      const clockMaterial = new THREE.MeshStandardMaterial({ color: 0xe74c3c })
      const clock = new THREE.Mesh(clockGeometry, clockMaterial)
      clock.position.set(3, 1, 0)
      clockMovingRef.current.add(clock)
      
      // Clock hands (slower)
      const handGeometry = new THREE.BoxGeometry(0.02, 0.2, 0.02)
      const handMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
      const hourHand = new THREE.Mesh(handGeometry, handMaterial)
      hourHand.position.set(3, 1.1, 0)
      clockMovingRef.current.add(hourHand)
    }
  }, [velocity])

  // Animate clocks
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime
    
    // Rest frame clock (normal speed)
    if (clockRestRef.current && clockRestRef.current.children.length > 1) {
      const hand = clockRestRef.current.children[1]
      hand.rotation.z = -timeRef.current * 0.5
    }
    
    // Moving frame clock (time dilation - runs slower)
    if (clockMovingRef.current && clockMovingRef.current.children.length > 1) {
      const hand = clockMovingRef.current.children[1]
      hand.rotation.z = -(timeRef.current / gamma) * 0.5
    }
  })

  // Update moving frame position
  useFrame((state) => {
    if (movingFrameRef.current) {
      // Move the frame based on velocity
      const distance = beta * state.clock.elapsedTime * 2
      movingFrameRef.current.position.x = distance
    }
  })

  return (
    <>
      {/* Coordinate axes */}
      <axesHelper args={[10]} />
      
      {/* Grid for reference */}
      <gridHelper args={[20, 20, 0x444444, 0x222222]} />

      {/* Rest frame (stationary observer) */}
      <group ref={restFrameRef} position={[-5, 0, 0]}>
        {showLengthContraction && (
          <>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[properLength, 0.5, 0.5]} />
              <meshStandardMaterial 
                color={0x3498db}
                transparent
                opacity={0.7}
              />
            </mesh>
            {/* Length label */}
            <mesh position={[0, 1, 0]}>
              <planeGeometry args={[properLength * 0.8, 0.3]} />
              <meshStandardMaterial color={0x3498db} transparent opacity={0.3} />
            </mesh>
          </>
        )}
      </group>

      {/* Moving frame (relativistic observer) */}
      <group ref={movingFrameRef} position={[0, 0, 0]}>
        {showLengthContraction && (
          <>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[contractedLength, 0.5, 0.5]} />
              <meshStandardMaterial 
                color={0xe74c3c}
                transparent
                opacity={0.7}
              />
            </mesh>
            {/* Contracted length label */}
            <mesh position={[0, 1, 0]}>
              <planeGeometry args={[contractedLength * 0.8, 0.3]} />
              <meshStandardMaterial color={0xe74c3c} transparent opacity={0.3} />
            </mesh>
          </>
        )}
      </group>

      {/* Clocks for time dilation visualization */}
      {showTimeDilation && (
        <>
          <group ref={clockRestRef} position={[-5, 0, 0]}>
            {/* Clock label */}
            <mesh position={[-3, 1.5, 0]}>
              <planeGeometry args={[1, 0.3]} />
              <meshStandardMaterial color={0x3498db} transparent opacity={0.5} />
            </mesh>
          </group>
          <group ref={clockMovingRef} position={[0, 0, 0]}>
            {/* Clock label */}
            <mesh position={[3, 1.5, 0]}>
              <planeGeometry args={[1, 0.3]} />
              <meshStandardMaterial color={0xe74c3c} transparent opacity={0.5} />
            </mesh>
          </group>
        </>
      )}

      {/* Frame labels */}
      <mesh position={[-5, 2.5, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshStandardMaterial color={0x3498db} transparent opacity={0.6} />
      </mesh>

      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshStandardMaterial color={0xe74c3c} transparent opacity={0.6} />
      </mesh>

      {/* Velocity indicator arrow */}
      {(() => {
        const direction = new THREE.Vector3(1, 0, 0)
        const origin = new THREE.Vector3(0, 1.5, 0)
        const length = Math.max(beta * 3, 0.5)
        const arrow = new THREE.ArrowHelper(direction, origin, length, 0xffff00, 0.2, 0.1)
        return <primitive object={arrow} />
      })()}

      {/* Velocity magnitude indicator */}
      <mesh position={[beta * 1.5, 1.8, 0]}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshStandardMaterial color={0xffff00} transparent opacity={0.7} />
      </mesh>
    </>
  )
}

export default RelativityVisualization

