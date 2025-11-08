/**
 * Electromagnetism Physics Module
 * Handles: electric & magnetic field visualizations
 */

import * as THREE from 'three'

/**
 * Calculate Electric Field at a Point
 * @param {Object} params - Field calculation parameters
 * @param {Array} params.charges - Array of charge objects {q, position: {x, y, z}}
 * @param {Object} params.point - Point to calculate field at {x, y, z}
 * @returns {Object} Electric field vector
 */
export const calculateElectricField = (params = {}) => {
  const {
    charges = [{ q: 1, position: { x: 0, y: 0, z: 0 } }],
    point = { x: 1, y: 0, z: 0 },
  } = params

  const k = 8.99e9 // Coulomb's constant (N⋅m²/C²)
  let fieldX = 0
  let fieldY = 0
  let fieldZ = 0

  // Calculate field from each charge
  charges.forEach((charge) => {
    const dx = point.x - charge.position.x
    const dy = point.y - charge.position.y
    const dz = point.z - charge.position.z
    const r = Math.sqrt(dx * dx + dy * dy + dz * dz)

    if (r > 0) {
      const r3 = r * r * r
      const fieldMagnitude = (k * charge.q) / r3
      fieldX += fieldMagnitude * dx
      fieldY += fieldMagnitude * dy
      fieldZ += fieldMagnitude * dz
    }
  })

  return {
    x: fieldX,
    y: fieldY,
    z: fieldZ,
    magnitude: Math.sqrt(fieldX * fieldX + fieldY * fieldY + fieldZ * fieldZ),
  }
}

/**
 * Calculate Magnetic Field at a Point
 * @param {Object} params - Field calculation parameters
 * @param {Object} params.current - Current element {I, direction: {x, y, z}, position: {x, y, z}}
 * @param {Object} params.point - Point to calculate field at {x, y, z}
 * @returns {Object} Magnetic field vector
 */
export const calculateMagneticField = (params = {}) => {
  const {
    current = { I: 1, direction: { x: 1, y: 0, z: 0 }, position: { x: 0, y: 0, z: 0 } },
    point = { x: 1, y: 0, z: 0 },
  } = params

  const mu0 = 4 * Math.PI * 1e-7 // Permeability of free space

  // Placeholder for Biot-Savart law calculation
  // TODO: Implement full Biot-Savart law

  return {
    x: 0,
    y: 0,
    z: 0,
    magnitude: 0,
  }
}

/**
 * Calculate Lorentz Force
 * @param {Object} params - Force parameters
 * @param {Object} params.charge - Charge value (C)
 * @param {Object} params.velocity - Velocity vector {x, y, z}
 * @param {Object} params.electricField - Electric field vector {x, y, z}
 * @param {Object} params.magneticField - Magnetic field vector {x, y, z}
 * @returns {Object} Force vector
 */
export const calculateLorentzForce = (params = {}) => {
  const {
    charge = 1,
    velocity = { x: 0, y: 0, z: 0 },
    electricField = { x: 0, y: 0, z: 0 },
    magneticField = { x: 0, y: 0, z: 0 },
  } = params

  // F = q(E + v × B)
  // Electric force: qE
  const electricForce = {
    x: charge * electricField.x,
    y: charge * electricField.y,
    z: charge * electricField.z,
  }

  // Magnetic force: q(v × B)
  const crossProduct = {
    x: velocity.y * magneticField.z - velocity.z * magneticField.y,
    y: velocity.z * magneticField.x - velocity.x * magneticField.z,
    z: velocity.x * magneticField.y - velocity.y * magneticField.x,
  }

  const magneticForce = {
    x: charge * crossProduct.x,
    y: charge * crossProduct.y,
    z: charge * crossProduct.z,
  }

  // Total force
  return {
    x: electricForce.x + magneticForce.x,
    y: electricForce.y + magneticForce.y,
    z: electricForce.z + magneticForce.z,
    electric: electricForce,
    magnetic: magneticForce,
  }
}

/**
 * Create 3D Visualization Scene for Electromagnetism
 * @param {Object} scene - Three.js scene object
 * @param {Object} params - Visualization parameters
 * @returns {Object} Scene objects and controls
 */
export const createElectromagnetismScene = (scene, params = {}) => {
  // Clear existing objects (placeholder)
  // TODO: Add proper scene management

  // Create coordinate axes
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // Placeholder for charge visualization
  const chargeGeometry = new THREE.SphereGeometry(0.2, 16, 16)
  const positiveMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 })
  const negativeMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff })
  const positiveCharge = new THREE.Mesh(chargeGeometry, positiveMaterial)
  const negativeCharge = new THREE.Mesh(chargeGeometry, negativeMaterial)
  scene.add(positiveCharge)
  scene.add(negativeCharge)

  // Placeholder for field lines
  const fieldLineGeometry = new THREE.BufferGeometry()
  const fieldLineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 })
  const fieldLines = new THREE.LineSegments(fieldLineGeometry, fieldLineMaterial)
  scene.add(fieldLines)

  // Placeholder for vector field arrows
  const arrowHelper = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, 0),
    1,
    0xff0000
  )
  scene.add(arrowHelper)

  return {
    positiveCharge,
    negativeCharge,
    fieldLines,
    arrowHelper,
    update: (fieldData) => {
      // TODO: Update field visualizations based on field calculations
      if (fieldData.magnitude) {
        arrowHelper.setLength(fieldData.magnitude)
        arrowHelper.setDirection(
          new THREE.Vector3(fieldData.x, fieldData.y, fieldData.z).normalize()
        )
      }
    },
  }
}

/**
 * Export all electromagnetism functions
 */
export default {
  calculateElectricField,
  calculateMagneticField,
  calculateLorentzForce,
  createElectromagnetismScene,
}

