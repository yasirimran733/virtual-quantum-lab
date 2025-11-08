import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateMagneticField } from '../../physics/Electromagnetism'
import ParameterControl from '../../components/ParameterControl'
import * as THREE from 'three'

/**
 * Magnetic Field Visualization Component
 */
const MagneticFieldVisualization = ({ 
  current, 
  fieldData = [],
  showFieldLines = true,
  showVectors = true 
}) => {
  const fieldLinesRef = useRef(new THREE.Group())

  useEffect(() => {
    fieldLinesRef.current.clear()

    if (!showFieldLines || !current) return

    // Generate circular field lines around current
    const numLines = 16
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2
      const points = []
      const radius = 0.5

      for (let r = radius; r < 8; r += 0.2) {
        const x = current.position.x + r * Math.cos(angle)
        const y = current.position.y + r * Math.sin(angle)
        const z = current.position.z
        points.push(new THREE.Vector3(x, y, z))
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({ 
        color: 0x3b82f6,
        opacity: 0.6,
        transparent: true
      })
      const line = new THREE.Line(geometry, material)
      fieldLinesRef.current.add(line)
    }
  }, [current, showFieldLines])

  return (
    <>
      {/* Current wire */}
      {current && (
        <mesh position={[current.position.x, current.position.y, current.position.z]}>
          <cylinderGeometry args={[0.1, 0.1, 5, 16]} />
          <meshStandardMaterial 
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Field lines */}
      {showFieldLines && <primitive object={fieldLinesRef.current} />}

      {/* Vector field */}
      {showVectors && fieldData.map((field, index) => {
        if (field.magnitude < 0.1) return null
        const direction = new THREE.Vector3(field.x, field.y, field.z).normalize()
        const origin = new THREE.Vector3(field.point.x, field.point.y, field.point.z)
        const length = Math.min(field.magnitude * 0.3, 1)
        const arrow = new THREE.ArrowHelper(direction, origin, length, 0x3b82f6, 0.05, 0.03)
        return <primitive key={`vector-${index}`} object={arrow} />
      })}
    </>
  )
}

export const MagneticField = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [current, setCurrent] = useState(1) // Current in Amperes
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [direction, setDirection] = useState({ x: 0, y: 1, z: 0 })
  const [showFieldLines, setShowFieldLines] = useState(true)
  const [showVectors, setShowVectors] = useState(true)
  const [fieldData, setFieldData] = useState([])

  // Calculate magnetic field at grid points
  useEffect(() => {
    const gridSize = 8
    const step = 0.8
    const points = []

    for (let x = -gridSize; x <= gridSize; x += step) {
      for (let y = -gridSize; y <= gridSize; y += step) {
        const dx = x - currentX
        const dy = y - currentY
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 0.5) continue

        const field = calculateMagneticField({
          current: {
            I: current,
            direction,
            position: { x: currentX, y: currentY, z: 0 },
          },
          point: { x, y, z: 0 },
        })

        if (field.magnitude > 0.05) {
          points.push({
            point: { x, y, z: 0 },
            x: field.x,
            y: field.y,
            z: field.z,
            magnitude: field.magnitude,
          })
        }
      }
    }

    setFieldData(points.filter((_, i) => i % 2 === 0))
  }, [current, currentX, currentY, direction])

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/simulations')}
            className="mb-4 text-primary-600 dark:text-primary-400 hover:underline"
          >
            ← Back to Simulations
          </button>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            <span className="gradient-text">Magnetic Field Visualization</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore magnetic fields around current-carrying wires
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-6 space-y-6"
            >
              <h2 className="text-xl font-display font-bold">Parameters</h2>

              <ParameterControl
                label="Current"
                value={current}
                onChange={setCurrent}
                min={-5}
                max={5}
                step={0.1}
                unit=" A"
              />

              <ParameterControl
                label="Position X"
                value={currentX}
                onChange={setCurrentX}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <ParameterControl
                label="Position Y"
                value={currentY}
                onChange={setCurrentY}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <div className="pt-4 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFieldLines}
                    onChange={(e) => setShowFieldLines(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Field Lines</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showVectors}
                    onChange={(e) => setShowVectors(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Vector Field</span>
                </label>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Field Information</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Magnetic field forms circular loops around current-carrying wires (right-hand rule).
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Field strength decreases with distance from the wire.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[600px] rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800"
            >
              <Canvas
                camera={{ position: [0, 0, 15], fov: 50 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <gridHelper args={[20, 20]} />
                <axesHelper args={[5]} />
                <MagneticFieldVisualization
                  current={{
                    I: current,
                    direction,
                    position: { x: currentX, y: currentY, z: 0 },
                  }}
                  fieldData={fieldData}
                  showFieldLines={showFieldLines}
                  showVectors={showVectors}
                />
              </Canvas>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MagneticField

