import { useState } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'

/**
 * Draggable Object Component
 * Represents a physics object that can be placed on the canvas
 * 
 * TODO: Add full physics interaction formulas
 */
export const DraggableObject = ({ 
  object, 
  onUpdate, 
  onSelect, 
  isSelected = false,
  theme = 'light'
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event, info) => {
    setIsDragging(false)
    if (onUpdate) {
      onUpdate({
        ...object,
        position: {
          x: object.position.x + info.offset.x / 50, // Scale for canvas coordinates
          y: object.position.y - info.offset.y / 50,
          z: object.position.z || 0,
        }
      })
    }
  }

  const getObjectColor = () => {
    const colorMap = {
      particle: '#3b82f6',
      pendulum: '#10b981',
      block: '#8b5cf6',
      charge: object.properties?.charge > 0 ? '#ef4444' : '#3b82f6',
      magnet: '#f59e0b',
      fieldMarker: '#06b6d4',
      waveSource: '#8b5cf6',
      mirror: '#6b7280',
      lens: '#ec4899',
      slit: '#06b6d4',
      particleCloud: '#a855f7',
      quantumSource: '#7c3aed',
      relativisticObject: '#f97316',
      movingGrid: '#64748b',
      clock: '#f59e0b',
    }
    return colorMap[object.type] || '#6366f1'
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect && onSelect(object.id)}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
      style={{
        left: `${(object.position.x + 10) * 5}%`,
        top: `${(10 - object.position.y) * 5}%`,
        transform: 'translate(-50%, -50%)',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
        style={{
          backgroundColor: getObjectColor(),
          opacity: isDragging ? 0.7 : 1,
        }}
      >
        {object.icon}
      </div>
      {object.label && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs bg-black/70 text-white px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10"
        >
          {object.label}
        </motion.div>
      )}
      {/* Property value display */}
      {isSelected && object.properties && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-xs bg-primary-500 text-white px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10"
        >
          {(() => {
            const props = object.properties
            if (props.charge !== undefined) return `q: ${props.charge.toFixed(2)} C`
            if (props.mass !== undefined) return `m: ${props.mass.toFixed(2)} kg`
            if (props.velocity !== undefined && typeof props.velocity === 'number') return `v: ${props.velocity.toFixed(2)} c`
            if (props.amplitude !== undefined) return `A: ${props.amplitude.toFixed(2)}`
            if (props.wavelength !== undefined) return `λ: ${props.wavelength.toFixed(2)} m`
            return 'Selected'
          })()}
        </motion.div>
      )}
    </motion.div>
  )
}

export default DraggableObject

