import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateElectricField } from '../../physics/Electromagnetism'
import ElectricFieldVisualization from '../../components/visualizations/ElectricFieldVisualization'
import ParameterControl from '../../components/ParameterControl'

export const ElectricField = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [charge, setCharge] = useState(1)
  const [chargeX, setChargeX] = useState(0)
  const [chargeY, setChargeY] = useState(0)
  const [showFieldLines, setShowFieldLines] = useState(true)
  const [showVectors, setShowVectors] = useState(true)
  const [fieldData, setFieldData] = useState([])

  // Calculate field at grid points
  useEffect(() => {
    const gridSize = 10
    const step = 1
    const points = []

    for (let x = -gridSize; x <= gridSize; x += step) {
      for (let y = -gridSize; y <= gridSize; y += step) {
        // Skip points too close to charge
        const dx = x - chargeX
        const dy = y - chargeY
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 0.5) continue

        const field = calculateElectricField({
          charges: [{ q: charge, position: { x: chargeX, y: chargeY, z: 0 } }],
          point: { x, y, z: 0 },
        })

        if (field.magnitude > 0.1) {
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

    // Sample points for performance (show every 3rd point)
    setFieldData(points.filter((_, i) => i % 3 === 0))
  }, [charge, chargeX, chargeY])

  const charges = [{ q: charge, position: { x: chargeX, y: chargeY, z: 0 } }]

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
            <span className="gradient-text">Electric Field Visualization</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore electric fields around point charges
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
                label="Charge"
                value={charge}
                onChange={setCharge}
                min={-5}
                max={5}
                step={0.1}
                unit=" C"
              />

              <ParameterControl
                label="Position X"
                value={chargeX}
                onChange={setChargeX}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <ParameterControl
                label="Position Y"
                value={chargeY}
                onChange={setChargeY}
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
                  {charge > 0 ? 'Positive' : 'Negative'} charge creates an{' '}
                  {charge > 0 ? 'outward' : 'inward'} electric field.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                  Field strength decreases with distance squared (inverse square law).
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
                <ElectricFieldVisualization
                  charges={charges}
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

export default ElectricField

