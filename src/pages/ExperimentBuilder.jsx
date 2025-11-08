import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import SimulationCanvas from '../components/SimulationCanvas'
import ObjectToolbox from '../components/experiment/ObjectToolbox'
import ObjectProperties from '../components/experiment/ObjectProperties'
import ExperimentCanvas from '../components/experiment/ExperimentCanvas'
import {
  saveExperiment,
  loadExperiment,
  getSavedExperiments,
  deleteExperiment,
  exportExperiment,
  importExperiment,
  generateExperimentId,
  saveCurrentExperiment,
  loadCurrentExperiment,
} from '../utils/experimentStorage'

/**
 * Experiment Builder Page
 * Allows users to create custom physics experiments with drag-and-drop
 * 
 * TODO: Add formula integration for real-time physics calculations
 * TODO: Add collision detection and interaction between objects
 */
export const ExperimentBuilder = () => {
  const { theme } = useTheme()
  const [simulationType, setSimulationType] = useState('classical')
  const [objects, setObjects] = useState([])
  const [selectedObjectId, setSelectedObjectId] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [simulationParams, setSimulationParams] = useState({})
  const [experimentName, setExperimentName] = useState('')
  const [savedExperiments, setSavedExperiments] = useState({})
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [simulationData, setSimulationData] = useState(null)

  // Load saved experiments on mount
  useEffect(() => {
    setSavedExperiments(getSavedExperiments())
    // Try to load auto-saved experiment
    const autoSaved = loadCurrentExperiment()
    if (autoSaved) {
      setObjects(autoSaved.objects || [])
      setSimulationType(autoSaved.simulationType || 'classical')
      setExperimentName(autoSaved.name || '')
    }
  }, [])

  // Auto-save current experiment every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (objects.length > 0) {
        saveCurrentExperiment({
          objects,
          simulationType,
          name: experimentName,
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [objects, simulationType, experimentName])

  // Handle object addition
  const handleObjectAdd = useCallback((newObject) => {
    setObjects((prev) => [...prev, newObject])
    setSelectedObjectId(newObject.id)
  }, [])

  // Handle object update
  const handleObjectUpdate = useCallback((updatedObject) => {
    setObjects((prev) =>
      prev.map((obj) => (obj.id === updatedObject.id ? updatedObject : obj))
    )
  }, [])

  // Handle object deletion
  const handleObjectDelete = useCallback(() => {
    if (selectedObjectId) {
      setObjects((prev) => prev.filter((obj) => obj.id !== selectedObjectId))
      setSelectedObjectId(null)
    }
  }, [selectedObjectId])

  // Handle object selection
  const handleObjectSelect = useCallback((objectId) => {
    setSelectedObjectId(objectId)
  }, [])

  // Get selected object
  const selectedObject = objects.find((obj) => obj.id === selectedObjectId)

  // Get simulation function based on type
  const getSimulationFunction = () => {
    const functionMap = {
      classical: 'simulateProjectile',
      electromagnetism: 'calculateElectricField',
      waves: 'calculateInterference',
      quantum: 'calculateWaveFunction',
      relativity: 'calculateTimeDilation',
    }
    return functionMap[simulationType] || null
  }

  // Get module name for SimulationCanvas
  const getModuleName = () => {
    const moduleMap = {
      classical: 'ClassicalMechanics',
      electromagnetism: 'Electromagnetism',
      waves: 'WavesOptics',
      quantum: 'QuantumMechanics',
      relativity: 'Relativity',
    }
    return moduleMap[simulationType] || 'ClassicalMechanics'
  }

  // Convert objects to simulation parameters
  useEffect(() => {
    const params = {}
    
    // TODO: Convert objects to appropriate simulation parameters based on type
    // This will be expanded as physics formulas are fully integrated
    if (simulationType === 'classical') {
      const particle = objects.find((obj) => obj.type === 'particle')
      if (particle) {
        params.velocity = Math.sqrt(
          (particle.properties.velocity?.x || 0) ** 2 +
          (particle.properties.velocity?.y || 0) ** 2
        ) || 20
        params.angle = particle.properties.angle || 45
        params.gravity = particle.properties.gravity || 9.8
        params.mass = particle.properties.mass || 1
      }
    } else if (simulationType === 'electromagnetism') {
      const charges = objects.filter((obj) => obj.type === 'charge')
      params.charges = charges.map((charge) => ({
        q: charge.properties.charge || 1,
        position: charge.position,
      }))
    } else if (simulationType === 'waves') {
      const sources = objects.filter((obj) => obj.type === 'waveSource')
      params.sources = sources.map((source) => ({
        position: source.position,
        amplitude: source.properties.amplitude || 1,
        frequency: source.properties.frequency || 1,
        wavelength: source.properties.wavelength || 2,
        phase: source.properties.phase || 0,
      }))
      // Add mirrors and slits if present
      const mirrors = objects.filter((obj) => obj.type === 'mirror')
      if (mirrors.length > 0) {
        params.mirrors = mirrors.map((mirror) => ({
          position: mirror.position,
          angle: mirror.properties.angle || 0,
          reflectivity: mirror.properties.reflectivity || 1,
        }))
      }
      const slits = objects.filter((obj) => obj.type === 'slit')
      if (slits.length > 0) {
        params.slits = slits.map((slit) => ({
          position: slit.position,
          width: slit.properties.width || 1e-6,
          distance: slit.properties.distance || 1,
          type: slit.properties.type || 'single',
        }))
      }
    } else if (simulationType === 'quantum') {
      const particles = objects.filter((obj) => obj.type === 'particleCloud' || obj.type === 'quantumSource')
      if (particles.length > 0) {
        params.particles = particles.map((particle) => ({
          position: { x: particle.position.x || 0, y: particle.position.y || 0, z: 0 },
          momentum: particle.properties.momentum || 1,
          mass: particle.properties.mass || 1,
          amplitude: particle.properties.amplitude || 1,
          wavelength: particle.properties.wavelength || 2,
          uncertainty: particle.properties.uncertainty || 0.1,
        }))
      }
    } else if (simulationType === 'relativity') {
      const relativisticObjects = objects.filter((obj) => 
        obj.type === 'relativisticObject' || obj.type === 'movingGrid' || obj.type === 'clock'
      )
      if (relativisticObjects.length > 0) {
        const primaryObj = relativisticObjects[0]
        params.velocity = primaryObj.properties.velocity || primaryObj.properties.beta || 0.5
        params.properLength = primaryObj.properties.properLength || 2
        params.properTime = primaryObj.properties.properTime || 1
        params.beta = params.velocity
      }
    }

    setSimulationParams(params)
  }, [objects, simulationType])

  // Handle save
  const handleSave = () => {
    if (!experimentName.trim()) {
      setShowSaveDialog(true)
      return
    }

    const experimentId = generateExperimentId()
    const success = saveExperiment(experimentId, {
      name: experimentName,
      objects,
      simulationType,
      createdAt: new Date().toISOString(),
    })

    if (success) {
      setSavedExperiments(getSavedExperiments())
      alert('Experiment saved successfully!')
      setShowSaveDialog(false)
    } else {
      alert('Failed to save experiment')
    }
  }

  // Handle load
  const handleLoad = (experimentId) => {
    const experiment = loadExperiment(experimentId)
    if (experiment) {
      setObjects(experiment.objects || [])
      setSimulationType(experiment.simulationType || 'classical')
      setExperimentName(experiment.name || '')
      setSelectedObjectId(null)
      alert('Experiment loaded successfully!')
    }
  }

  // Handle export
  const handleExport = () => {
    const data = {
      name: experimentName || 'Untitled Experiment',
      simulationType,
      objects,
      exportedAt: new Date().toISOString(),
    }
    const json = exportExperiment(data)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${experimentName || 'experiment'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Handle import
  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = importExperiment(e.target.result)
        if (data) {
          setObjects(data.objects || [])
          setSimulationType(data.simulationType || 'classical')
          setExperimentName(data.name || '')
          setSelectedObjectId(null)
          alert('Experiment imported successfully!')
        } else {
          alert('Failed to import experiment. Invalid file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  // Clear canvas
  const handleClear = () => {
    if (confirm('Are you sure you want to clear all objects?')) {
      setObjects([])
      setSelectedObjectId(null)
      setExperimentName('')
    }
  }

  const simulationTypes = [
    { id: 'classical', name: 'Classical Mechanics', icon: '🌊' },
    { id: 'electromagnetism', name: 'Electromagnetism', icon: '⚡' },
    { id: 'waves', name: 'Waves & Optics', icon: '🌐' },
    { id: 'quantum', name: 'Quantum Mechanics', icon: '⚛️' },
    { id: 'relativity', name: 'Relativity', icon: '🚀' },
  ]

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            <span className="gradient-text">Experiment Builder</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create custom physics experiments with drag-and-drop tools
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4"
        >
          {/* Simulation Type Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Simulation:</label>
            <select
              value={simulationType}
              onChange={(e) => setSimulationType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              {simulationTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Experiment Name */}
          <input
            type="text"
            value={experimentName}
            onChange={(e) => setExperimentName(e.target.value)}
            placeholder="Experiment name..."
            className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors text-sm"
            >
              💾 Save
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
            >
              📤 Export
            </button>
            <label className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm cursor-pointer">
              📥 Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
            >
              🗑️ Clear
            </button>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                isRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-lg'
              }`}
            >
              {isRunning ? '⏹️ Stop' : '▶️ Run'}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Object Toolbox */}
          <div className="lg:col-span-1 space-y-6">
            <ObjectToolbox
              simulationType={simulationType}
              onObjectAdd={handleObjectAdd}
              theme={theme}
            />

            {/* Saved Experiments */}
            {Object.keys(savedExperiments).length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-lg font-display font-bold mb-4">Saved Experiments</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {Object.entries(savedExperiments).map(([id, exp]) => (
                    <div
                      key={id}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{exp.name || 'Untitled'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(exp.savedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleLoad(id)}
                          className="p-1 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 rounded"
                          title="Load"
                        >
                          📂
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this experiment?')) {
                              deleteExperiment(id)
                              setSavedExperiments(getSavedExperiments())
                            }
                          }}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* 2D Canvas for Object Placement */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ExperimentCanvas
                objects={objects}
                onObjectUpdate={handleObjectUpdate}
                onObjectSelect={handleObjectSelect}
                selectedObjectId={selectedObjectId}
                simulationType={simulationType}
                className="h-[400px]"
              />
            </motion.div>

            {/* 3D Simulation Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="h-[500px]"
            >
              <SimulationCanvas
                moduleName={getModuleName()}
                simulationFunction={isRunning ? getSimulationFunction() : null}
                simulationParams={simulationParams}
                className="h-full"
                isRunning={isRunning}
                onSimulationUpdate={setSimulationData}
              />
            </motion.div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="lg:col-span-1">
            <ObjectProperties
              selectedObject={selectedObject}
              onUpdate={handleObjectUpdate}
              theme={theme}
            />

            {/* Object List */}
            {objects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 glass rounded-xl p-6"
              >
                <h3 className="text-lg font-display font-bold mb-4">Objects ({objects.length})</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {objects.map((obj) => (
                    <div
                      key={obj.id}
                      onClick={() => handleObjectSelect(obj.id)}
                      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedObjectId === obj.id
                          ? 'bg-primary-100 dark:bg-primary-900 border-2 border-primary-500'
                          : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'
                      }`}
                    >
                      <span className="text-xl">{obj.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{obj.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{obj.type}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Delete this object?')) {
                            handleObjectDelete()
                          }
                        }}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Simulation Data Display */}
            {isRunning && simulationData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 glass rounded-xl p-6"
              >
                <h3 className="text-lg font-display font-bold mb-4">Simulation Data</h3>
                <div className="space-y-2 text-sm">
                  {simulationData.time !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Time:</span>
                      <span className="font-semibold">{simulationData.time.toFixed(2)} s</span>
                    </div>
                  )}
                  {simulationData.position && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Position:</span>
                      <span className="font-semibold">
                        ({simulationData.position.x?.toFixed(2) || 0}, {simulationData.position.y?.toFixed(2) || 0})
                      </span>
                    </div>
                  )}
                  {simulationData.velocity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Velocity:</span>
                      <span className="font-semibold">
                        {typeof simulationData.velocity === 'number' 
                          ? `${simulationData.velocity.toFixed(2)} m/s`
                          : `(${simulationData.velocity.x?.toFixed(2) || 0}, ${simulationData.velocity.y?.toFixed(2) || 0})`
                        }
                      </span>
                    </div>
                  )}
                  {simulationData.gamma !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gamma (γ):</span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        {simulationData.gamma.toFixed(3)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-display font-bold mb-4">Save Experiment</h3>
              <input
                type="text"
                value={experimentName}
                onChange={(e) => setExperimentName(e.target.value)}
                placeholder="Enter experiment name..."
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && experimentName.trim()) {
                    handleSave()
                  }
                }}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (experimentName.trim()) {
                      handleSave()
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExperimentBuilder
