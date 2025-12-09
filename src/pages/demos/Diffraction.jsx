import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateDiffraction } from '../../physics/WavesOptics'
import DiffractionVisualization from '../../components/visualizations/DiffractionVisualization'
import ParameterControl from '../../components/ParameterControl'
import { ChartJSPhysicsChart as PhysicsChart } from '../../components/charts/ChartJSPhysicsChart'

export const Diffraction = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [wavelength, setWavelength] = useState(500e-9) // 500 nm
  const [slitWidth, setSlitWidth] = useState(1e-6) // 1 micrometer
  const [slitSeparation, setSlitSeparation] = useState(5e-6) // 5 micrometers
  const [distance, setDistance] = useState(1) // 1 meter
  const [intensity, setIntensity] = useState(1)
  const [mode, setMode] = useState('single') // 'single' or 'double'
  const [chartData, setChartData] = useState([])

  // Calculate diffraction pattern for chart
  useEffect(() => {
    const points = []
    // Calculate range based on distance to show relevant part of screen
    // tan(theta) = y/L. Screen is 4m high (-2 to 2).
    // max theta = atan(2/1) approx 1.1 rad.
    // We'll sample a smaller range for the chart to show detail
    const maxAngle = 0.1 // radians
    
    for (let angle = -maxAngle; angle <= maxAngle; angle += 0.0005) {
      const result = calculateDiffraction({
        wavelength,
        slitWidth,
        slitSeparation,
        distance,
        angle,
        intensity,
        mode
      })
      points.push({
        x: (angle * 180) / Math.PI, // Convert to degrees
        y: result.intensity,
      })
    }
    setChartData(points)
  }, [wavelength, slitWidth, slitSeparation, distance, intensity, mode])

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
            <span className="gradient-text">Diffraction & Interference</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore single-slit diffraction and double-slit interference patterns
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mode</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setMode('single')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      mode === 'single'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                    }`}
                  >
                    Single Slit
                  </button>
                  <button
                    onClick={() => setMode('double')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      mode === 'double'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                    }`}
                  >
                    Double Slit
                  </button>
                </div>
              </div>

              <ParameterControl
                label="Wavelength"
                value={wavelength * 1e9} // Convert to nm for display
                onChange={(val) => setWavelength(val * 1e-9)}
                min={380}
                max={780}
                step={1}
                unit=" nm"
              />

              <ParameterControl
                label="Slit Width (a)"
                value={slitWidth * 1e6} // Convert to micrometers
                onChange={(val) => setSlitWidth(val * 1e-6)}
                min={0.5}
                max={20}
                step={0.1}
                unit=" μm"
              />

              {mode === 'double' && (
                <ParameterControl
                  label="Slit Separation (d)"
                  value={slitSeparation * 1e6} // Convert to micrometers
                  onChange={(val) => setSlitSeparation(val * 1e-6)}
                  min={2} // Must be larger than slit width usually
                  max={50}
                  step={0.5}
                  unit=" μm"
                />
              )}

              <ParameterControl
                label="Screen Distance (L)"
                value={distance}
                onChange={setDistance}
                min={0.1}
                max={5}
                step={0.1}
                unit=" m"
              />
              
              <ParameterControl
                label="Intensity (I₀)"
                value={intensity}
                onChange={setIntensity}
                min={0.1}
                max={2}
                step={0.1}
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Physics Info</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Single Slit:</strong> Creates a broad central maximum with narrower, dimmer side fringes. Width ∝ λ/a.
                </p>
                {mode === 'double' && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Double Slit:</strong> Creates equally spaced interference fringes modulated by the single-slit envelope. Fringe spacing ∝ λ/d.
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Canvas and Chart */}
          <div className="lg:col-span-3 space-y-6">
            {/* 3D Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[500px] rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800"
            >
              <Canvas
                camera={{ position: [0, 0, 4], fov: 45 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <gridHelper args={[20, 20]} position={[0, -2, 0]} />
                <DiffractionVisualization
                  wavelength={wavelength}
                  slitWidth={slitWidth}
                  slitSeparation={slitSeparation}
                  distance={distance}
                  intensity={intensity}
                  mode={mode}
                  theme={theme}
                />
              </Canvas>
            </motion.div>

            {/* Intensity Pattern Chart */}
            <PhysicsChart
              data={chartData}
              label={`${mode === 'single' ? 'Diffraction' : 'Interference'} Intensity Pattern`}
              color="#9b59b6"
              xLabel="Angle (degrees)"
              yLabel="Relative Intensity"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Diffraction

