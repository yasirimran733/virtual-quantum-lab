import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateElectricField } from '../../physics/Electromagnetism'
import ElectricFieldVisualization from '../../components/visualizations/ElectricFieldVisualization'
import ParameterControl from '../../components/ParameterControl'

export const ElectricFieldEnhanced = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [charges, setCharges] = useState([
    { id: 1, q: 1, position: { x: -2, y: 0, z: 0 } },
    { id: 2, q: -1, position: { x: 2, y: 0, z: 0 } },
  ])
  const [selectedCharge, setSelectedCharge] = useState(1)
  const [showFieldLines, setShowFieldLines] = useState(true)
  const [showVectors, setShowVectors] = useState(true)
  const [fieldData, setFieldData] = useState([])

  // Calculate field at grid points
  useEffect(() => {
    const gridSize = 10
    const step = 0.8
    const points = []

    for (let x = -gridSize; x <= gridSize; x += step) {
      for (let y = -gridSize; y <= gridSize; y += step) {
        // Skip points too close to any charge
        let tooClose = false
        for (const charge of charges) {
          const dx = x - charge.position.x
          const dy = y - charge.position.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 0.5) {
            tooClose = true
            break
          }
        }
        if (tooClose) continue

        const field = calculateElectricField({
          charges: charges.map((c) => ({
            q: c.q,
            position: c.position,
          })),
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

    // Sample points for performance
    setFieldData(points.filter((_, i) => i % 2 === 0))
  }, [charges])

  const selectedChargeData = charges.find((c) => c.id === selectedCharge)

  const handleChargeUpdate = (id, updates) => {
    setCharges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    )
  }

  const handleAddCharge = () => {
    const newId = Math.max(...charges.map((c) => c.id), 0) + 1
    setCharges([
      ...charges,
      {
        id: newId,
        q: 1,
        position: { x: 0, y: 0, z: 0 },
      },
    ])
    setSelectedCharge(newId)
  }

  const handleRemoveCharge = (id) => {
    if (charges.length > 1) {
      setCharges((prev) => prev.filter((c) => c.id !== id))
      if (selectedCharge === id) {
        setSelectedCharge(charges[0]?.id || 1)
      }
    }
  }

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
            Explore electric fields around multiple point charges
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Charge List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold">Charges</h2>
                <button
                  onClick={handleAddCharge}
                  className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {charges.map((charge) => (
                  <div
                    key={charge.id}
                    onClick={() => setSelectedCharge(charge.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCharge === charge.id
                        ? 'bg-primary-100 dark:bg-primary-900 border-2 border-primary-500'
                        : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">
                          {charge.q > 0 ? '⚡' : '⚡'}
                        </span>
                        <span className="font-medium text-sm">
                          Charge {charge.id}
                        </span>
                      </div>
                      {charges.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveCharge(charge.id)
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      q = {charge.q.toFixed(2)} C
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Selected Charge Properties */}
            {selectedChargeData && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-xl p-6 space-y-6"
              >
                <h2 className="text-xl font-display font-bold">
                  Charge {selectedChargeData.id} Properties
                </h2>

                <ParameterControl
                  label="Charge Value"
                  value={selectedChargeData.q}
                  onChange={(val) =>
                    handleChargeUpdate(selectedChargeData.id, { q: val })
                  }
                  min={-5}
                  max={5}
                  step={0.1}
                  unit=" C"
                />

                <ParameterControl
                  label="Position X"
                  value={selectedChargeData.position.x}
                  onChange={(val) =>
                    handleChargeUpdate(selectedChargeData.id, {
                      position: { ...selectedChargeData.position, x: val },
                    })
                  }
                  min={-5}
                  max={5}
                  step={0.1}
                  unit=" m"
                />

                <ParameterControl
                  label="Position Y"
                  value={selectedChargeData.position.y}
                  onChange={(val) =>
                    handleChargeUpdate(selectedChargeData.id, {
                      position: { ...selectedChargeData.position, y: val },
                    })
                  }
                  min={-5}
                  max={5}
                  step={0.1}
                  unit=" m"
                />
              </motion.div>
            )}

            {/* Display Options */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Display Options</h2>
              <div className="space-y-3">
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
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Field Information</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Electric field strength follows the inverse square law.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Field lines point away from positive charges and toward negative charges.
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
                  charges={charges.map((c) => ({
                    q: c.q,
                    position: c.position,
                  }))}
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

export default ElectricFieldEnhanced

