import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ParameterControl from '../ParameterControl'

/**
 * Object Properties Editor Component
 * Allows editing properties of selected objects
 * 
 * TODO: Add validation and formula integration for each property type
 */
export const ObjectProperties = ({ 
  selectedObject, 
  onUpdate,
  theme = 'light'
}) => {
  const [properties, setProperties] = useState(selectedObject?.properties || {})

  useEffect(() => {
    if (selectedObject) {
      setProperties(selectedObject.properties || {})
    }
  }, [selectedObject])

  const handlePropertyChange = (key, value, isNested = false, nestedKey = null) => {
    const newProperties = { ...properties }
    
    if (isNested && nestedKey) {
      if (!newProperties[key]) {
        newProperties[key] = {}
      }
      newProperties[key][nestedKey] = value
    } else {
      newProperties[key] = value
    }
    
    setProperties(newProperties)
    
    if (onUpdate && selectedObject) {
      onUpdate({
        ...selectedObject,
        properties: newProperties,
      })
    }
  }

  if (!selectedObject) {
    return (
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-display font-bold mb-4">Properties</h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">Select an object to edit its properties</p>
        </div>
      </div>
    )
  }

  const renderPropertyInput = (key, value, label, unit = '', min = null, max = null, step = 0.1) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Nested object (e.g., velocity: { x: 0, y: 0 })
      return (
        <div key={key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {Object.keys(value).map((nestedKey) => (
            <ParameterControl
              key={nestedKey}
              label={`${label} ${nestedKey.toUpperCase()}`}
              value={value[nestedKey]}
              onChange={(val) => handlePropertyChange(key, val, true, nestedKey)}
              min={min || -100}
              max={max || 100}
              step={step}
              unit={unit}
              type="input"
            />
          ))}
        </div>
      )
    }

    return (
      <ParameterControl
        key={key}
        label={label}
        value={typeof value === 'number' ? value : 0}
        onChange={(val) => handlePropertyChange(key, val)}
        min={min !== null ? min : (typeof value === 'number' && value < 0 ? -100 : 0)}
        max={max !== null ? max : 100}
        step={step}
        unit={unit}
        type="input"
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-bold">Properties</h3>
        <div className="text-2xl">{selectedObject.icon}</div>
      </div>
      
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-dark-700">
        <div className="font-semibold text-sm text-gray-700 dark:text-gray-300">
          {selectedObject.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {selectedObject.category}
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {Object.entries(properties).map(([key, value]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
          let unit = ''
          let min = null
          let max = null
          let step = 0.1

          // Set appropriate units and ranges based on property type
          if (key.includes('mass')) {
            unit = ' kg'
            min = 0.1
            max = 100
          } else if (key.includes('velocity') || key.includes('speed')) {
            unit = ' m/s'
            min = -100
            max = 100
          } else if (key.includes('charge')) {
            unit = ' C'
            min = -10
            max = 10
          } else if (key.includes('angle')) {
            unit = '°'
            min = -180
            max = 180
            step = 1
          } else if (key.includes('length') || key.includes('width') || key.includes('height')) {
            unit = ' m'
            min = 0.1
            max = 10
          } else if (key.includes('frequency')) {
            unit = ' Hz'
            min = 0.1
            max = 10
          } else if (key.includes('amplitude')) {
            min = 0
            max = 5
          } else if (key.includes('wavelength')) {
            unit = ' m'
            min = 0.1
            max = 10
          } else if (key.includes('gravity')) {
            unit = ' m/s²'
            min = 0
            max = 20
          } else if (key.includes('velocity') && typeof value === 'number' && selectedObject.category === 'Relativity') {
            unit = ' c' // Speed of light fraction
            min = 0
            max = 0.99
            step = 0.01
          } else if (key.includes('beta')) {
            unit = ' c'
            min = 0
            max = 0.99
            step = 0.01
          } else if (key.includes('momentum')) {
            unit = ' kg⋅m/s'
            min = 0.1
            max = 10
          } else if (key.includes('uncertainty')) {
            unit = ''
            min = 0
            max = 1
          } else if (key.includes('properLength') || key.includes('properTime')) {
            unit = key.includes('Length') ? ' m' : ' s'
            min = 0.1
            max = 10
          } else if (key.includes('reflectivity') || key.includes('friction')) {
            unit = ''
            min = 0
            max = 1
            step = 0.01
          } else if (key.includes('focalLength')) {
            unit = ' m'
            min = 0.1
            max = 20
          } else if (key.includes('refractiveIndex')) {
            unit = ''
            min = 1.0
            max = 3.0
            step = 0.1
          } else if (key.includes('width') && selectedObject.type === 'slit') {
            unit = ' μm'
            min = 0.1
            max = 10
            step = 0.1
          }

          return renderPropertyInput(key, value, label, unit, min, max, step)
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
        <button
          onClick={() => {
            if (onUpdate && selectedObject) {
              onUpdate({
                ...selectedObject,
                properties,
              })
            }
          }}
          className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Apply Changes
        </button>
      </div>
    </motion.div>
  )
}

export default ObjectProperties

