/**
 * Physics Engine Index
 * Central export point for all physics modules
 */

import ClassicalMechanics from './ClassicalMechanics'
import Electromagnetism from './Electromagnetism'
import WavesOptics from './WavesOptics'
import QuantumMechanics from './QuantumMechanics'
import Relativity from './Relativity'

/**
 * Physics Engine Class
 * Main interface for all physics simulations
 */
export class PhysicsEngine {
  constructor() {
    this.modules = {
      classical: ClassicalMechanics,
      electromagnetism: Electromagnetism,
      waves: WavesOptics,
      quantum: QuantumMechanics,
      relativity: Relativity,
    }
    this.currentModule = null
    this.scene = null
    this.sceneObjects = null
  }

  /**
   * Initialize a physics module
   * @param {string} moduleName - Name of the module ('classical', 'electromagnetism', etc.)
   * @param {Object} scene - Three.js scene object
   * @param {Object} params - Initialization parameters
   */
  initializeModule(moduleName, scene, params = {}) {
    if (!this.modules[moduleName]) {
      console.error(`Physics module '${moduleName}' not found`)
      return null
    }

    this.currentModule = moduleName
    this.scene = scene

    // Create scene visualization based on module
    // Map module names to their scene creation functions
    const sceneFunctionMap = {
      classical: 'createClassicalMechanicsScene',
      electromagnetism: 'createElectromagnetismScene',
      waves: 'createWavesOpticsScene',
      quantum: 'createQuantumMechanicsScene',
      relativity: 'createRelativityScene',
    }

    const functionName = sceneFunctionMap[moduleName]
    const createSceneFunction = functionName ? this.modules[moduleName][functionName] : null

    if (createSceneFunction) {
      this.sceneObjects = createSceneFunction(scene, params)
    }

    return this.sceneObjects
  }

  /**
   * Run a simulation step
   * @param {string} functionName - Name of the physics function to call
   * @param {Object} params - Simulation parameters
   * @returns {Object} Simulation results
   */
  simulate(functionName, params = {}) {
    if (!this.currentModule) {
      console.error('No physics module initialized')
      return null
    }

    const module = this.modules[this.currentModule]
    const simulationFunction = module[functionName]

    if (!simulationFunction) {
      console.error(`Function '${functionName}' not found in module '${this.currentModule}'`)
      return null
    }

    const result = simulationFunction(params)

    // Update scene if update function exists
    if (this.sceneObjects && this.sceneObjects.update) {
      this.sceneObjects.update(result)
    }

    return result
  }

  /**
   * Get available functions for current module
   * @returns {Array} List of available function names
   */
  getAvailableFunctions() {
    if (!this.currentModule) {
      return []
    }

    const module = this.modules[this.currentModule]
    return Object.keys(module).filter(
      (key) => typeof module[key] === 'function' && key !== 'createScene'
    )
  }
}

// Export individual modules
export { ClassicalMechanics }
export { Electromagnetism }
export { WavesOptics }
export { QuantumMechanics }
export { Relativity }

// Export default engine instance
export default new PhysicsEngine()

