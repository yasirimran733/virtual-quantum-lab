import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../context/ThemeContext'
import { PhysicsEngine } from '../physics'

/**
 * Scene Content Component
 * Handles Three.js scene setup and physics engine integration
 */
const SceneContent = ({ moduleName, simulationType, simulationFunction, simulationParams, onSimulationUpdate, theme, isRunning }) => {
  const { scene } = useThree()
  const engineRef = useRef(null)
  const sceneObjectsRef = useRef(null)
  const animationFrameRef = useRef(null)
  const timeRef = useRef(0)

  // Initialize physics engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new PhysicsEngine()
    }

    // Initialize module with scene
    if (scene && engineRef.current) {
      const module = moduleName || simulationType || 'ClassicalMechanics'
      sceneObjectsRef.current = engineRef.current.initializeModule(module, scene, {
        theme,
      })
    }

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [scene, moduleName, simulationType, theme])

  // Animation loop
  useEffect(() => {
    if (!simulationFunction || !engineRef.current || !isRunning) {
      timeRef.current = 0
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const animate = () => {
      timeRef.current += 0.016 // ~60fps
      
      const result = engineRef.current.simulate(simulationFunction, {
        ...simulationParams,
        time: timeRef.current,
      })

      if (onSimulationUpdate && result) {
        onSimulationUpdate(result)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [simulationFunction, simulationParams, onSimulationUpdate, isRunning])

  return null
}

/**
 * Simulation Canvas Component
 * Provides a responsive 3D canvas for physics simulations with Three.js
 */
export const SimulationCanvas = ({
  simulationType = 'classical',
  moduleName = null,
  simulationFunction = null,
  simulationParams = {},
  onSimulationUpdate = null,
  className = '',
  isRunning = false,
}) => {
  const { theme } = useTheme()

  return (
    <div
      className={`relative w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 ${className}`}
    >
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        {/* Lighting */}
        <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={theme === 'dark' ? 0.8 : 1}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />

        {/* Grid and axes helpers */}
        <gridHelper args={[20, 20]} />
        <axesHelper args={[5]} />

        {/* Scene content with physics engine */}
        <SceneContent
          moduleName={moduleName}
          simulationType={simulationType}
          simulationFunction={simulationFunction}
          simulationParams={simulationParams}
          onSimulationUpdate={onSimulationUpdate}
          theme={theme}
          isRunning={isRunning}
        />
      </Canvas>

      {/* Canvas overlay info */}
      <div className="absolute top-4 left-4 glass rounded-lg px-4 py-2 text-sm backdrop-blur-xl">
        <div className="font-semibold text-gray-700 dark:text-gray-200">
          {moduleName ? moduleName.replace(/([A-Z])/g, ' $1').trim() : (simulationType.charAt(0).toUpperCase() + simulationType.slice(1))} Simulation
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {isRunning ? (simulationFunction || 'Running...') : 'Paused - Click Run to start'}
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 glass rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-400 backdrop-blur-xl">
        <div>🖱️ Left: Rotate | 🖱️ Right: Pan | 🖱️ Scroll: Zoom</div>
      </div>
    </div>
  )
}

export default SimulationCanvas

