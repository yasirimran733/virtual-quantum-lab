/**
 * Relativity Physics Module
 * Handles: time dilation, Lorentz contraction visual model
 */

import * as THREE from 'three'

/**
 * Calculate Time Dilation
 * @param {Object} params - Time dilation parameters
 * @param {number} params.properTime - Proper time (s)
 * @param {number} params.velocity - Relative velocity (m/s)
 * @param {number} params.c - Speed of light (m/s, default: 3e8)
 * @returns {Object} Dilated time and gamma factor
 */
export const calculateTimeDilation = (params = {}) => {
  const {
    properTime = 1,
    velocity = 0.5 * 3e8, // 0.5c
    c = 3e8, // Speed of light
  } = params

  const beta = velocity / c
  const gamma = 1 / Math.sqrt(1 - beta * beta)
  const dilatedTime = gamma * properTime

  return {
    properTime,
    dilatedTime,
    gamma,
    velocity,
    beta,
  }
}

/**
 * Calculate Lorentz Contraction (Length Contraction)
 * @param {Object} params - Contraction parameters
 * @param {number} params.properLength - Proper length (m)
 * @param {number} params.velocity - Relative velocity (m/s)
 * @param {number} params.c - Speed of light (m/s, default: 3e8)
 * @returns {Object} Contracted length and gamma factor
 */
export const calculateLorentzContraction = (params = {}) => {
  const {
    properLength = 1,
    velocity = 0.5 * 3e8, // 0.5c
    c = 3e8, // Speed of light
  } = params

  const beta = velocity / c
  const gamma = 1 / Math.sqrt(1 - beta * beta)
  const contractedLength = properLength / gamma

  return {
    properLength,
    contractedLength,
    gamma,
    velocity,
    beta,
  }
}

/**
 * Calculate Relativistic Momentum
 * @param {Object} params - Momentum parameters
 * @param {number} params.mass - Rest mass (kg)
 * @param {number} params.velocity - Velocity (m/s)
 * @param {number} params.c - Speed of light (m/s, default: 3e8)
 * @returns {Object} Relativistic momentum and energy
 */
export const calculateRelativisticMomentum = (params = {}) => {
  const {
    mass = 1,
    velocity = 0.5 * 3e8, // 0.5c
    c = 3e8, // Speed of light
  } = params

  const beta = velocity / c
  const gamma = 1 / Math.sqrt(1 - beta * beta)

  // Relativistic momentum: p = γmv
  const momentum = gamma * mass * velocity

  // Total energy: E = γmc²
  const totalEnergy = gamma * mass * c * c

  // Rest energy: E₀ = mc²
  const restEnergy = mass * c * c

  // Kinetic energy: E_k = E - E₀
  const kineticEnergy = totalEnergy - restEnergy

  return {
    momentum,
    totalEnergy,
    restEnergy,
    kineticEnergy,
    gamma,
    velocity,
    beta,
  }
}

/**
 * Calculate Lorentz Transformation
 * @param {Object} params - Transformation parameters
 * @param {Object} params.position - Position in rest frame {x, y, z, t}
 * @param {number} params.velocity - Relative velocity (m/s)
 * @param {number} params.c - Speed of light (m/s, default: 3e8)
 * @returns {Object} Transformed position and time
 */
export const calculateLorentzTransformation = (params = {}) => {
  const {
    position = { x: 0, y: 0, z: 0, t: 0 },
    velocity = 0.5 * 3e8, // 0.5c
    c = 3e8, // Speed of light
  } = params

  const beta = velocity / c
  const gamma = 1 / Math.sqrt(1 - beta * beta)

  // Lorentz transformation (assuming motion along x-axis)
  const x = gamma * (position.x - velocity * position.t)
  const y = position.y
  const z = position.z
  const t = gamma * (position.t - (velocity * position.x) / (c * c))

  return {
    position: { x, y, z, t },
    originalPosition: position,
    gamma,
    velocity,
    beta,
  }
}

/**
 * Create 3D Visualization Scene for Relativity
 * @param {Object} scene - Three.js scene object
 * @param {Object} params - Visualization parameters
 * @returns {Object} Scene objects and controls
 */
export const createRelativityScene = (scene, params = {}) => {
  // Clear existing objects (placeholder)
  // TODO: Add proper scene management

  // Create coordinate axes
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // Placeholder for reference frame visualization
  const frameGeometry = new THREE.BoxGeometry(2, 2, 2)
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x3498db,
    wireframe: true,
  })
  const restFrame = new THREE.Mesh(frameGeometry, frameMaterial)
  const movingFrame = new THREE.Mesh(frameGeometry, frameMaterial)
  movingFrame.material.color.setHex(0xe74c3c)
  scene.add(restFrame)
  scene.add(movingFrame)

  // Placeholder for clock visualization (time dilation)
  const clockGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32)
  const clockMaterial = new THREE.MeshStandardMaterial({ color: 0xf39c12 })
  const clock = new THREE.Mesh(clockGeometry, clockMaterial)
  scene.add(clock)

  // Placeholder for length visualization (Lorentz contraction)
  const lengthGeometry = new THREE.BoxGeometry(1, 0.2, 0.2)
  const lengthMaterial = new THREE.MeshStandardMaterial({ color: 0x2ecc71 })
  const lengthObject = new THREE.Mesh(lengthGeometry, lengthMaterial)
  scene.add(lengthObject)

  return {
    restFrame,
    movingFrame,
    clock,
    lengthObject,
    update: (relativityData) => {
      // TODO: Update relativity visualizations based on calculations
      if (relativityData.contractedLength !== undefined) {
        // Update length object scale based on Lorentz contraction
        lengthObject.scale.x = relativityData.contractedLength / relativityData.properLength
      }
      if (relativityData.gamma !== undefined) {
        // Update moving frame position/scale based on transformation
        movingFrame.position.x = relativityData.velocity * 0.1 // Scaled for visualization
      }
    },
  }
}

/**
 * Export all relativity functions
 */
export default {
  calculateTimeDilation,
  calculateLorentzContraction,
  calculateRelativisticMomentum,
  calculateLorentzTransformation,
  createRelativityScene,
}

