/**
 * Classical Mechanics Physics Module
 * Handles: motion, collisions, pendulum, projectile physics
 */

import * as THREE from 'three'

/**
 * Projectile Motion Simulation
 * @param {Object} params - Simulation parameters
 * @param {number} params.velocity - Initial velocity (m/s)
 * @param {number} params.angle - Launch angle (degrees)
 * @param {number} params.gravity - Gravity acceleration (m/s²)
 * @param {number} params.mass - Mass of projectile (kg)
 * @param {number} params.time - Current time (s)
 * @returns {Object} Position and velocity data
 */
export const simulateProjectile = (params = {}) => {
  const {
    velocity = 20,
    angle = 45,
    gravity = 9.8,
    mass = 1,
    time = 0,
  } = params

  // Convert angle to radians
  const angleRad = (angle * Math.PI) / 180

  // Calculate initial velocities
  const vx = velocity * Math.cos(angleRad)
  const vy = velocity * Math.sin(angleRad)

  // Calculate position at time t
  const x = vx * time
  const y = vy * time - 0.5 * gravity * time * time

  // Calculate velocity at time t
  const vxCurrent = vx
  const vyCurrent = vy - gravity * time
  const speed = Math.sqrt(vxCurrent * vxCurrent + vyCurrent * vyCurrent)

  // Calculate energy
  const kineticEnergy = 0.5 * mass * speed * speed
  const potentialEnergy = mass * gravity * y
  const totalEnergy = kineticEnergy + potentialEnergy

  return {
    position: { x, y, z: 0 },
    velocity: { x: vxCurrent, y: vyCurrent, z: 0 },
    speed,
    energy: { kinetic: kineticEnergy, potential: potentialEnergy, total: totalEnergy },
    time,
  }
}

/**
 * Pendulum Simulation
 * @param {Object} params - Simulation parameters
 * @param {number} params.length - Pendulum length (m)
 * @param {number} params.angle - Initial angle (radians)
 * @param {number} params.gravity - Gravity acceleration (m/s²)
 * @param {number} params.time - Current time (s)
 * @returns {Object} Angle and position data
 */
export const simulatePendulum = (params = {}) => {
  const {
    length = 1,
    angle = Math.PI / 4,
    gravity = 9.8,
    time = 0,
  } = params

  // Simple harmonic motion approximation (small angle)
  const omega = Math.sqrt(gravity / length)
  const currentAngle = angle * Math.cos(omega * time)
  const angularVelocity = -angle * omega * Math.sin(omega * time)

  // Calculate position
  const x = length * Math.sin(currentAngle)
  const y = -length * Math.cos(currentAngle)

  return {
    angle: currentAngle,
    angularVelocity,
    position: { x, y, z: 0 },
    length,
    time,
  }
}

/**
 * Collision Detection and Response (1D Elastic Collision)
 * @param {Object} params - Collision parameters
 * @param {Object} params.object1 - First object {mass, velocity: {x, y}}
 * @param {Object} params.object2 - Second object {mass, velocity: {x, y}}
 * @param {number} params.restitution - Coefficient of restitution (0-1)
 * @returns {Object} Post-collision velocities and momenta
 */
export const calculateCollision = (params = {}) => {
  const {
    object1 = { mass: 1, velocity: { x: 1, y: 0 } },
    object2 = { mass: 1, velocity: { x: -1, y: 0 } },
    restitution = 1, // Perfectly elastic
  } = params

  // Conservation of momentum: m1*v1 + m2*v2 = m1*v1' + m2*v2'
  // For elastic collision: v1' = ((m1 - m2)*v1 + 2*m2*v2) / (m1 + m2)
  //                        v2' = ((m2 - m1)*v2 + 2*m1*v1) / (m1 + m2)
  
  const m1 = object1.mass
  const m2 = object2.mass
  const v1x = object1.velocity.x
  const v2x = object2.velocity.x

  // Calculate final velocities (1D collision along x-axis)
  const v1xFinal = ((m1 - m2) * v1x + 2 * m2 * v2x) / (m1 + m2) * restitution
  const v2xFinal = ((m2 - m1) * v2x + 2 * m1 * v1x) / (m1 + m2) * restitution

  // Calculate momenta
  const p1Initial = m1 * v1x
  const p2Initial = m2 * v2x
  const p1Final = m1 * v1xFinal
  const p2Final = m2 * v2xFinal
  const totalMomentum = p1Initial + p2Initial
  const totalMomentumFinal = p1Final + p2Final

  // Calculate kinetic energy
  const ke1Initial = 0.5 * m1 * v1x * v1x
  const ke2Initial = 0.5 * m2 * v2x * v2x
  const ke1Final = 0.5 * m1 * v1xFinal * v1xFinal
  const ke2Final = 0.5 * m2 * v2xFinal * v2xFinal
  const totalKEInitial = ke1Initial + ke2Initial
  const totalKEFinal = ke1Final + ke2Final

  return {
    object1: {
      velocity: { x: v1xFinal, y: object1.velocity.y, z: 0 },
      momentum: { x: p1Final, y: 0, z: 0 },
      kineticEnergy: ke1Final,
    },
    object2: {
      velocity: { x: v2xFinal, y: object2.velocity.y, z: 0 },
      momentum: { x: p2Final, y: 0, z: 0 },
      kineticEnergy: ke2Final,
    },
    totalMomentum: { initial: totalMomentum, final: totalMomentumFinal },
    totalKineticEnergy: { initial: totalKEInitial, final: totalKEFinal },
    restitution,
  }
}

/**
 * Force Calculation (Newton's Second Law)
 * @param {Object} params - Force parameters
 * @param {number} params.mass - Mass (kg)
 * @param {Object} params.acceleration - Acceleration vector {x, y, z}
 * @returns {Object} Force vector
 */
export const calculateForce = (params = {}) => {
  const {
    mass = 1,
    acceleration = { x: 0, y: -9.8, z: 0 },
  } = params

  return {
    x: mass * acceleration.x,
    y: mass * acceleration.y,
    z: mass * acceleration.z,
  }
}

/**
 * Create 3D Visualization Scene for Classical Mechanics
 * @param {Object} scene - Three.js scene object
 * @param {Object} params - Visualization parameters
 * @returns {Object} Scene objects and controls
 */
export const createClassicalMechanicsScene = (scene, params = {}) => {
  // Clear existing objects (placeholder)
  // TODO: Add proper scene management

  // Create coordinate axes
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // Create grid helper
  const gridHelper = new THREE.GridHelper(20, 20)
  scene.add(gridHelper)

  // Placeholder for projectile visualization
  const projectileGeometry = new THREE.SphereGeometry(0.1, 16, 16)
  const projectileMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
  const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial)
  scene.add(projectile)

  // Placeholder for pendulum visualization
  const pendulumGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8)
  const pendulumMaterial = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
  const pendulum = new THREE.Mesh(pendulumGeometry, pendulumMaterial)
  scene.add(pendulum)

  return {
    projectile,
    pendulum,
    axesHelper,
    gridHelper,
    update: (simulationData) => {
      // TODO: Update 3D objects based on simulation data
      if (simulationData.position) {
        projectile.position.set(
          simulationData.position.x,
          simulationData.position.y,
          simulationData.position.z || 0
        )
      }
    },
  }
}

/**
 * Export all classical mechanics functions
 */
export default {
  simulateProjectile,
  simulatePendulum,
  calculateCollision,
  calculateForce,
  createClassicalMechanicsScene,
}

