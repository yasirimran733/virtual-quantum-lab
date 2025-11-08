/**
 * Quantum Mechanics Physics Module
 * Handles: probability wave animation, tunneling
 */

import * as THREE from 'three'

/**
 * Calculate Probability Wave Function (1D)
 * @param {Object} params - Wave function parameters
 * @param {number} params.position - Position (m)
 * @param {number} params.time - Time (s)
 * @param {number} params.momentum - Momentum (kg⋅m/s)
 * @param {number} params.mass - Particle mass (kg)
 * @returns {Object} Wave function amplitude and probability
 */
export const calculateWaveFunction = (params = {}) => {
  const {
    position = 0,
    time = 0,
    momentum = 1,
    mass = 1,
  } = params

  const hbar = 1.0545718e-34 // Reduced Planck constant

  // Simple plane wave: ψ(x,t) = A * exp(i(kx - ωt))
  // For visualization, we'll use the real part
  const k = momentum / hbar // Wave number
  const omega = (hbar * k * k) / (2 * mass) // Angular frequency

  const realPart = Math.cos(k * position - omega * time)
  const imagPart = Math.sin(k * position - omega * time)
  const amplitude = Math.sqrt(realPart * realPart + imagPart * imagPart)
  const probability = amplitude * amplitude

  return {
    amplitude,
    probability,
    realPart,
    imagPart,
    position,
    time,
  }
}

/**
 * Calculate Quantum Tunneling Probability
 * @param {Object} params - Tunneling parameters
 * @param {number} params.energy - Particle energy (J)
 * @param {number} params.barrierHeight - Barrier potential (J)
 * @param {number} params.barrierWidth - Barrier width (m)
 * @param {number} params.mass - Particle mass (kg)
 * @returns {Object} Transmission and reflection probabilities
 */
export const calculateTunneling = (params = {}) => {
  const {
    energy = 1,
    barrierHeight = 2,
    barrierWidth = 1,
    mass = 1,
  } = params

  const hbar = 1.0545718e-34 // Reduced Planck constant

  if (energy > barrierHeight) {
    // Classical transmission (no tunneling needed)
    return {
      transmissionProbability: 1,
      reflectionProbability: 0,
      tunneling: false,
    }
  }

  // Calculate transmission coefficient for quantum tunneling
  const k = Math.sqrt((2 * mass * (barrierHeight - energy)) / (hbar * hbar))
  const transmissionCoefficient = Math.exp(-2 * k * barrierWidth)

  return {
    transmissionProbability: transmissionCoefficient,
    reflectionProbability: 1 - transmissionCoefficient,
    tunneling: true,
  }
}

/**
 * Calculate Uncertainty Principle
 * @param {Object} params - Uncertainty parameters
 * @param {number} params.positionUncertainty - Position uncertainty (m)
 * @param {number} params.momentumUncertainty - Momentum uncertainty (kg⋅m/s)
 * @returns {Object} Uncertainty product and validation
 */
export const calculateUncertainty = (params = {}) => {
  const {
    positionUncertainty = 1e-10, // 1 Angstrom
    momentumUncertainty = 1e-24, // Approximate
  } = params

  const hbar = 1.0545718e-34 // Reduced Planck constant
  const uncertaintyProduct = positionUncertainty * momentumUncertainty
  const minimumUncertainty = hbar / 2

  return {
    uncertaintyProduct,
    minimumUncertainty,
    satisfiesPrinciple: uncertaintyProduct >= minimumUncertainty,
    positionUncertainty,
    momentumUncertainty,
  }
}

/**
 * Calculate Superposition State
 * @param {Object} params - Superposition parameters
 * @param {Array} params.states - Array of quantum states {amplitude, phase, energy}
 * @param {number} params.time - Time (s)
 * @returns {Object} Superposition result
 */
export const calculateSuperposition = (params = {}) => {
  const {
    states = [
      { amplitude: 0.707, phase: 0, energy: 1 },
      { amplitude: 0.707, phase: Math.PI / 2, energy: 2 },
    ],
    time = 0,
  } = params

  const hbar = 1.0545718e-34

  let totalAmplitude = 0
  let totalProbability = 0

  states.forEach((state) => {
    const phase = state.phase - (state.energy * time) / hbar
    // TODO: Implement proper complex exponential
    // Complex exponential: e^(i*phase) = cos(phase) + i*sin(phase)
    // For visualization, use real part
    totalAmplitude += state.amplitude * Math.cos(phase)
    totalProbability += state.amplitude * state.amplitude
  })

  return {
    amplitude: totalAmplitude,
    probability: totalProbability,
    states: states.length,
    time,
  }
}

/**
 * Create 3D Visualization Scene for Quantum Mechanics
 * @param {Object} scene - Three.js scene object
 * @param {Object} params - Visualization parameters
 * @returns {Object} Scene objects and controls
 */
export const createQuantumMechanicsScene = (scene, params = {}) => {
  // Clear existing objects (placeholder)
  // TODO: Add proper scene management

  // Create coordinate axes
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // Placeholder for probability wave visualization
  const waveGeometry = new THREE.PlaneGeometry(10, 10, 100, 100)
  const waveMaterial = new THREE.MeshStandardMaterial({
    color: 0x9b59b6,
    wireframe: false,
    transparent: true,
    opacity: 0.7,
  })
  const probabilityWave = new THREE.Mesh(waveGeometry, waveMaterial)
  scene.add(probabilityWave)

  // Placeholder for particle visualization
  const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16)
  const particleMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
  const particle = new THREE.Mesh(particleGeometry, particleMaterial)
  scene.add(particle)

  // Placeholder for barrier visualization
  const barrierGeometry = new THREE.BoxGeometry(0.5, 5, 5)
  const barrierMaterial = new THREE.MeshStandardMaterial({
    color: 0x34495e,
    transparent: true,
    opacity: 0.5,
  })
  const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial)
  scene.add(barrier)

  return {
    probabilityWave,
    particle,
    barrier,
    update: (quantumData) => {
      // TODO: Update quantum visualizations based on calculations
      if (quantumData.probability !== undefined) {
        // Update probability wave mesh based on wave function
        particle.material.opacity = quantumData.probability
      }
    },
  }
}

/**
 * Export all quantum mechanics functions
 */
export default {
  calculateWaveFunction,
  calculateTunneling,
  calculateUncertainty,
  calculateSuperposition,
  createQuantumMechanicsScene,
}

