import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateReflection, calculateRefraction } from '../../physics/WavesOptics'
import ParameterControl from '../../components/ParameterControl'
import * as THREE from 'three'

/**
 * Reflection and Refraction Visualization
 */
const ReflectionRefractionVisualization = ({
  incidentRay,
  normal,
  n1,
  n2,
  showReflection,
  showRefraction,
}) => {
  const reflectionResult = showReflection
    ? calculateReflection({
        incidentRay,
        normal,
      })
    : null

  const refractionResult = showRefraction
    ? calculateRefraction({
        incidentRay,
        normal,
        n1,
        n2,
      })
    : null

  return (
    <>
      {/* Surface */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 0.1]} />
        <meshStandardMaterial
          color="#95a5a6"
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Normal vector */}
      <primitive
        object={new THREE.ArrowHelper(
          new THREE.Vector3(normal.x, normal.y, normal.z).normalize(),
          new THREE.Vector3(0, 0, 0),
          2,
          0x000000,
          0.1,
          0.05
        )}
      />

      {/* Incident ray */}
      <primitive
        object={new THREE.ArrowHelper(
          new THREE.Vector3(incidentRay.direction.x, incidentRay.direction.y, incidentRay.direction.z).normalize(),
          new THREE.Vector3(incidentRay.position.x, incidentRay.position.y, incidentRay.position.z),
          3,
          0x3498db,
          0.15,
          0.08
        )}
      />

      {/* Reflected ray */}
      {reflectionResult && (
        <primitive
          object={new THREE.ArrowHelper(
            new THREE.Vector3(reflectionResult.direction.x, reflectionResult.direction.y, reflectionResult.direction.z).normalize(),
            new THREE.Vector3(reflectionResult.position.x, reflectionResult.position.y, reflectionResult.position.z),
            3,
            0xe74c3c,
            0.15,
            0.08
          )}
        />
      )}

      {/* Refracted ray */}
      {refractionResult && refractionResult.direction && (
        <primitive
          object={new THREE.ArrowHelper(
            new THREE.Vector3(refractionResult.direction.x, refractionResult.direction.y, refractionResult.direction.z).normalize(),
            new THREE.Vector3(0, -1, 0),
            3,
            0x2ecc71,
            0.15,
            0.08
          )}
        />
      )}

      {/* Critical angle indicator */}
      {refractionResult && refractionResult.criticalAngle && (
        <mesh position={[0, -2, 0]}>
          <planeGeometry args={[8, 0.1]} />
          <meshStandardMaterial color="#f39c12" transparent opacity={0.3} />
        </mesh>
      )}
    </>
  )
}

export const ReflectionRefraction = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [incidentAngle, setIncidentAngle] = useState(30) // degrees
  const [n1, setN1] = useState(1.0) // Air
  const [n2, setN2] = useState(1.5) // Glass
  const [showReflection, setShowReflection] = useState(true)
  const [showRefraction, setShowRefraction] = useState(true)

  // Calculate incident ray direction from angle
  const incidentRay = {
    direction: {
      x: Math.sin((incidentAngle * Math.PI) / 180),
      y: -Math.cos((incidentAngle * Math.PI) / 180),
      z: 0,
    },
    position: { x: -3, y: 2, z: 0 },
  }

  const normal = { x: 0, y: 1, z: 0 }

  // Calculate critical angle
  const criticalAngle =
    n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null

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
            <span className="gradient-text">Reflection & Refraction</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore Snell's law and the law of reflection
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
                label="Incident Angle"
                value={incidentAngle}
                onChange={setIncidentAngle}
                min={0}
                max={90}
                step={1}
                unit="°"
              />

              <ParameterControl
                label="n₁ (Medium 1)"
                value={n1}
                onChange={setN1}
                min={1.0}
                max={2.5}
                step={0.1}
              />

              <ParameterControl
                label="n₂ (Medium 2)"
                value={n2}
                onChange={setN2}
                min={1.0}
                max={2.5}
                step={0.1}
              />

              <div className="pt-4 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showReflection}
                    onChange={(e) => setShowReflection(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Reflection</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRefraction}
                    onChange={(e) => setShowRefraction(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Refraction</span>
                </label>
              </div>
            </motion.div>

            {/* Calculated Values */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Calculated Values</h2>
              <div className="space-y-2 text-sm">
                {(() => {
                  const refraction = calculateRefraction({
                    incidentRay,
                    normal,
                    n1,
                    n2,
                  })
                  const angleRad = (incidentAngle * Math.PI) / 180
                  const refractedAngle =
                    refraction.direction && !refraction.criticalAngle
                      ? Math.asin(
                          (n1 / n2) * Math.sin(angleRad)
                        ) * (180 / Math.PI)
                      : null

                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Refracted Angle:
                        </span>
                        <span className="font-semibold">
                          {refractedAngle
                            ? `${refractedAngle.toFixed(1)}°`
                            : 'TIR'}
                        </span>
                      </div>
                      {criticalAngle && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Critical Angle:
                          </span>
                          <span className="font-semibold">
                            {criticalAngle.toFixed(1)}°
                          </span>
                        </div>
                      )}
                      {refraction.criticalAngle && (
                        <div className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                          Total Internal Reflection (TIR)
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Information</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Snell's Law:</strong> n₁sin(θ₁) = n₂sin(θ₂)
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Reflection:</strong> Angle of incidence = Angle of reflection
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
                camera={{ position: [0, 0, 10], fov: 50 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <gridHelper args={[20, 20]} />
                <axesHelper args={[5]} />
                <ReflectionRefractionVisualization
                  incidentRay={incidentRay}
                  normal={normal}
                  n1={n1}
                  n2={n2}
                  showReflection={showReflection}
                  showRefraction={showRefraction}
                />
              </Canvas>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReflectionRefraction

