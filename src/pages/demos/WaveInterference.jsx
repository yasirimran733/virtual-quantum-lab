import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'
import { calculateInterference } from '../../physics/WavesOptics'
import WaveInterferenceVisualization from '../../components/visualizations/WaveInterferenceVisualization'
import ParameterControl from '../../components/ParameterControl'

export const WaveInterference = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [source1Amplitude, setSource1Amplitude] = useState(1)
  const [source1Frequency, setSource1Frequency] = useState(1)
  const [source1X, setSource1X] = useState(-2)
  const [source1Y, setSource1Y] = useState(0)
  const [source2Amplitude, setSource2Amplitude] = useState(1)
  const [source2Frequency, setSource2Frequency] = useState(1)
  const [source2X, setSource2X] = useState(2)
  const [source2Y, setSource2Y] = useState(0)
  const [wavelength, setWavelength] = useState(2)
  const [time, setTime] = useState(0)

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.016)
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [])

  const sources = [
    {
      position: { x: source1X, y: source1Y, z: 0 },
      amplitude: source1Amplitude,
      frequency: source1Frequency,
      wavelength: wavelength,
    },
    {
      position: { x: source2X, y: source2Y, z: 0 },
      amplitude: source2Amplitude,
      frequency: source2Frequency,
      wavelength: wavelength,
    },
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
          <button
            onClick={() => navigate('/simulations')}
            className="mb-4 text-primary-600 dark:text-primary-400 hover:underline"
          >
            ← Back to Simulations
          </button>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            <span className="gradient-text">Wave Interference</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Observe constructive and destructive interference patterns
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
              <h2 className="text-xl font-display font-bold">Source 1</h2>

              <ParameterControl
                label="Amplitude"
                value={source1Amplitude}
                onChange={setSource1Amplitude}
                min={0.1}
                max={2}
                step={0.1}
              />

              <ParameterControl
                label="Frequency"
                value={source1Frequency}
                onChange={setSource1Frequency}
                min={0.5}
                max={3}
                step={0.1}
                unit=" Hz"
              />

              <ParameterControl
                label="Position X"
                value={source1X}
                onChange={setSource1X}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <ParameterControl
                label="Position Y"
                value={source1Y}
                onChange={setSource1Y}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6 space-y-6"
            >
              <h2 className="text-xl font-display font-bold">Source 2</h2>

              <ParameterControl
                label="Amplitude"
                value={source2Amplitude}
                onChange={setSource2Amplitude}
                min={0.1}
                max={2}
                step={0.1}
              />

              <ParameterControl
                label="Frequency"
                value={source2Frequency}
                onChange={setSource2Frequency}
                min={0.5}
                max={3}
                step={0.1}
                unit=" Hz"
              />

              <ParameterControl
                label="Position X"
                value={source2X}
                onChange={setSource2X}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />

              <ParameterControl
                label="Position Y"
                value={source2Y}
                onChange={setSource2Y}
                min={-5}
                max={5}
                step={0.1}
                unit=" m"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6 space-y-6"
            >
              <h2 className="text-xl font-display font-bold">Wave Properties</h2>

              <ParameterControl
                label="Wavelength"
                value={wavelength}
                onChange={setWavelength}
                min={0.5}
                max={5}
                step={0.1}
                unit=" m"
              />
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
                camera={{ position: [0, 10, 15], fov: 50 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <gridHelper args={[20, 20]} />
                <axesHelper args={[5]} />
                <WaveInterferenceVisualization
                  sources={sources}
                  time={time}
                  showInterference={true}
                />
              </Canvas>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaveInterference

