/**
 * Waves & Optics Physics Module
 * Handles: diffraction, interference, reflection, refraction
 */

import * as THREE from "three";

/**
 * Calculate Wave Interference
 * @param {Object} params - Wave parameters
 * @param {Array} params.waves - Array of wave objects {amplitude, frequency, phase, position: {x, y}}
 * @param {Object} params.point - Point to calculate interference at {x, y}
 * @param {number} params.time - Current time (s)
 * @returns {Object} Resultant wave amplitude and phase
 */
export const calculateInterference = (params = {}) => {
  const {
    waves = [
      { amplitude: 1, frequency: 1, phase: 0, position: { x: 0, y: 0 } },
    ],
    point = { x: 0, y: 0 },
    time = 0,
  } = params;

  let totalAmplitude = 0;
  let totalPhase = 0;

  // Calculate superposition of waves
  waves.forEach((wave) => {
    const distance = Math.sqrt(
      Math.pow(point.x - wave.position.x, 2) +
        Math.pow(point.y - wave.position.y, 2)
    );
    const phase = wave.phase + 2 * Math.PI * wave.frequency * time - distance;
    totalAmplitude += wave.amplitude * Math.cos(phase);
  });

  return {
    amplitude: totalAmplitude,
    intensity: totalAmplitude * totalAmplitude,
    point,
    time,
  };
};

/**
 * Calculate Diffraction Pattern
 * @param {Object} params - Diffraction parameters
 * @param {number} params.wavelength - Wavelength (m)
 * @param {number} params.slitWidth - Slit width 'a' (m)
 * @param {number} params.slitSeparation - Slit separation 'd' (m)
 * @param {number} params.distance - Distance to screen 'L' (m)
 * @param {number} params.angle - Angle from center (radians)
 * @param {number} params.intensity - Base intensity I0
 * @param {string} params.mode - 'single' or 'double'
 * @returns {Object} Intensity at angle
 */
export const calculateDiffraction = (params = {}) => {
  const {
    wavelength = 500e-9, // 500 nm (visible light)
    slitWidth = 1e-6, // 1 micrometer
    slitSeparation = 5e-6, // 5 micrometers
    distance = 1,
    angle = 0,
    intensity: I0 = 1,
    mode = "single",
  } = params;

  const sinTheta = Math.sin(angle);

  // Beta for single-slit diffraction envelope
  // β = (π * a * sin(θ)) / λ
  const beta = (Math.PI * slitWidth * sinTheta) / wavelength;

  // Single slit diffraction factor: (sin(β) / β)^2
  // Limit as β -> 0 is 1
  const diffractionFactor = beta !== 0 ? Math.pow(Math.sin(beta) / beta, 2) : 1;

  let totalIntensity = 0;

  if (mode === "single") {
    totalIntensity = I0 * diffractionFactor;
  } else if (mode === "double") {
    // Alpha for double-slit interference
    // α = (π * d * sin(θ)) / λ
    const alpha = (Math.PI * slitSeparation * sinTheta) / wavelength;

    // Interference factor: cos^2(α)
    const interferenceFactor = Math.pow(Math.cos(alpha), 2);

    // Combined intensity
    totalIntensity = I0 * interferenceFactor * diffractionFactor;
  }

  return {
    intensity: totalIntensity,
    angle,
    wavelength,
    slitWidth,
    slitSeparation,
    mode,
  };
};

/**
 * Calculate Reflection
 * @param {Object} params - Reflection parameters
 * @param {Object} params.incidentRay - Incident ray {direction: {x, y, z}, position: {x, y, z}}
 * @param {Object} params.normal - Surface normal vector {x, y, z}
 * @returns {Object} Reflected ray
 */
export const calculateReflection = (params = {}) => {
  const {
    incidentRay = {
      direction: { x: 1, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 0 },
    },
    normal = { x: 0, y: 1, z: 0 },
  } = params;

  // Normalize vectors
  const incident = new THREE.Vector3(
    incidentRay.direction.x,
    incidentRay.direction.y,
    incidentRay.direction.z
  ).normalize();
  const n = new THREE.Vector3(normal.x, normal.y, normal.z).normalize();

  // Reflection formula: R = I - 2(I·N)N
  const dotProduct = incident.dot(n);
  const reflected = incident
    .clone()
    .sub(n.clone().multiplyScalar(2 * dotProduct));

  return {
    direction: { x: reflected.x, y: reflected.y, z: reflected.z },
    position: incidentRay.position,
  };
};

/**
 * Calculate Refraction (Snell's Law)
 * @param {Object} params - Refraction parameters
 * @param {Object} params.incidentRay - Incident ray {direction: {x, y, z}}
 * @param {Object} params.normal - Surface normal {x, y, z}
 * @param {number} params.n1 - Refractive index of medium 1
 * @param {number} params.n2 - Refractive index of medium 2
 * @returns {Object} Refracted ray
 */
export const calculateRefraction = (params = {}) => {
  const {
    incidentRay = { direction: { x: 1, y: 0, z: 0 } },
    normal = { x: 0, y: 1, z: 0 },
    n1 = 1.0, // Air
    n2 = 1.5, // Glass
  } = params;

  // Snell's law: n1 * sin(θ1) = n2 * sin(θ2)
  const incident = new THREE.Vector3(
    incidentRay.direction.x,
    incidentRay.direction.y,
    incidentRay.direction.z
  ).normalize();
  const n = new THREE.Vector3(normal.x, normal.y, normal.z).normalize();

  const cosI = -incident.dot(n);
  const sinI = Math.sqrt(1 - cosI * cosI);
  const sinR = (n1 / n2) * sinI;

  // Check for total internal reflection
  if (sinR > 1) {
    return {
      direction: null, // Total internal reflection
      criticalAngle: true,
    };
  }

  const cosR = Math.sqrt(1 - sinR * sinR);
  const refracted = incident
    .clone()
    .multiplyScalar(n1 / n2)
    .add(n.clone().multiplyScalar((n1 / n2) * cosI - cosR));

  return {
    direction: { x: refracted.x, y: refracted.y, z: refracted.z },
    criticalAngle: false,
  };
};

/**
 * Create 3D Visualization Scene for Waves & Optics
 * @param {Object} scene - Three.js scene object
 * @param {Object} params - Visualization parameters
 * @returns {Object} Scene objects and controls
 */
export const createWavesOpticsScene = (scene, params = {}) => {
  // Clear existing objects (placeholder)
  // TODO: Add proper scene management

  // Create coordinate axes
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // Placeholder for wave visualization
  const waveGeometry = new THREE.PlaneGeometry(10, 10, 50, 50);
  const waveMaterial = new THREE.MeshStandardMaterial({
    color: 0x4ecdc4,
    wireframe: true,
  });
  const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
  scene.add(waveMesh);

  // Placeholder for interference pattern
  const patternGeometry = new THREE.PlaneGeometry(5, 5, 100, 100);
  const patternMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const patternMesh = new THREE.Mesh(patternGeometry, patternMaterial);
  scene.add(patternMesh);

  // Placeholder for ray visualization
  const rayGeometry = new THREE.BufferGeometry();
  const rayMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
  const rays = new THREE.Line(rayGeometry, rayMaterial);
  scene.add(rays);

  return {
    waveMesh,
    patternMesh,
    rays,
    update: (waveData) => {
      // TODO: Update wave visualizations based on wave calculations
      if (waveData.amplitude !== undefined) {
        // Update wave mesh vertices based on interference pattern
      }
    },
  };
};

/**
 * Export all waves & optics functions
 */
export default {
  calculateInterference,
  calculateDiffraction,
  calculateReflection,
  calculateRefraction,
  createWavesOpticsScene,
};
