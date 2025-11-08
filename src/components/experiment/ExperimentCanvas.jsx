import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import DraggableObject from './DraggableObject'
import { useTheme } from '../../context/ThemeContext'

/**
 * Experiment Canvas Component
 * 2D canvas for placing and arranging physics objects
 * 
 * TODO: Add grid snapping and coordinate system visualization
 */
export const ExperimentCanvas = ({
  objects = [],
  onObjectUpdate,
  onObjectSelect,
  selectedObjectId = null,
  simulationType = 'classical',
  className = '',
}) => {
  const { theme } = useTheme()
  const canvasRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Update canvas size on mount and resize
  const updateCanvasSize = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setCanvasSize({ width: rect.width, height: rect.height })
    }
  }, [])

  useEffect(() => {
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [updateCanvasSize])

  return (
    <div
      ref={canvasRef}
      className={`relative rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 ${className}`}
      style={{ minHeight: '500px' }}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${theme === 'dark' ? '#475569' : '#cbd5e1'} 1px, transparent 1px),
            linear-gradient(to bottom, ${theme === 'dark' ? '#475569' : '#cbd5e1'} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Center Origin Marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-primary-500 rounded-full"></div>
      </div>

      {/* Coordinate Labels */}
      <div className="absolute top-2 left-2 text-xs text-gray-500 dark:text-gray-400">
        (0, 0)
      </div>
      <div className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400">
        X+
      </div>
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400">
        Y+
      </div>

      {/* Draggable Objects */}
      {objects.map((object) => (
        <DraggableObject
          key={object.id}
          object={object}
          onUpdate={onObjectUpdate}
          onSelect={onObjectSelect}
          isSelected={selectedObjectId === object.id}
          theme={theme}
        />
      ))}

      {/* Empty State */}
      {objects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 opacity-50">🎨</div>
            <p className="text-gray-500 dark:text-gray-400">
              Drag objects from the toolbox to start building
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExperimentCanvas

