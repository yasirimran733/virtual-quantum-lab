import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

/**
 * Object Toolbox Component
 * Provides draggable tools for each physics category
 * 
 * TODO: Add more specialized objects as physics modules expand
 */
const objectTemplates = {
  classical: [
    { 
      type: 'particle', 
      name: 'Particle', 
      icon: '⚛️', 
      category: 'Classical Mechanics',
      description: 'A point mass with position, velocity, and mass properties',
      defaultProperties: { mass: 1, velocity: { x: 0, y: 0 }, angle: 0, gravity: 9.8 }
    },
    { 
      type: 'pendulum', 
      name: 'Pendulum', 
      icon: '⏰', 
      category: 'Classical Mechanics',
      description: 'A swinging pendulum with length and angle properties',
      defaultProperties: { length: 1, angle: Math.PI / 4, gravity: 9.8 }
    },
    { 
      type: 'block', 
      name: 'Block', 
      icon: '📦', 
      category: 'Classical Mechanics',
      description: 'A solid block with mass and dimensions',
      defaultProperties: { mass: 1, width: 1, height: 1, friction: 0.1 }
    },
  ],
  electromagnetism: [
    { 
      type: 'charge', 
      name: 'Charge', 
      icon: '⚡', 
      category: 'Electromagnetism',
      description: 'Point charge with electric field properties',
      defaultProperties: { charge: 1, position: { x: 0, y: 0, z: 0 } }
    },
    { 
      type: 'magnet', 
      name: 'Magnet', 
      icon: '🧲', 
      category: 'Electromagnetism',
      description: 'Magnetic dipole with field strength',
      defaultProperties: { strength: 1, direction: { x: 0, y: 1, z: 0 } }
    },
    { 
      type: 'fieldMarker', 
      name: 'Field Marker', 
      icon: '🌐', 
      category: 'Electromagnetism',
      description: 'Marker to visualize field at a point',
      defaultProperties: { showVector: true, showLines: true }
    },
  ],
  waves: [
    { 
      type: 'waveSource', 
      name: 'Wave Source', 
      icon: '🌊', 
      category: 'Waves & Optics',
      description: 'Point source of waves with frequency and amplitude',
      defaultProperties: { amplitude: 1, frequency: 1, wavelength: 2, phase: 0 }
    },
    { 
      type: 'mirror', 
      name: 'Mirror', 
      icon: '🪞', 
      category: 'Waves & Optics',
      description: 'Reflective surface for wave reflection',
      defaultProperties: { reflectivity: 1, angle: 0, position: { x: 0, y: 0 } }
    },
    { 
      type: 'slit', 
      name: 'Slit', 
      icon: '🔍', 
      category: 'Waves & Optics',
      description: 'Single or double slit for diffraction',
      defaultProperties: { width: 1e-6, distance: 1, type: 'single' }
    },
    { 
      type: 'lens', 
      name: 'Lens', 
      icon: '🔬', 
      category: 'Waves & Optics',
      description: 'Optical lens with focal length',
      defaultProperties: { focalLength: 5, refractiveIndex: 1.5, diameter: 2 }
    },
  ],
  quantum: [
    { 
      type: 'particleCloud', 
      name: 'Particle Cloud', 
      icon: '☁️', 
      category: 'Quantum Mechanics',
      description: 'Quantum particle with probability distribution (placeholder)',
      defaultProperties: { amplitude: 1, wavelength: 2, momentum: 1, uncertainty: 0.1 }
    },
    { 
      type: 'quantumSource', 
      name: 'Quantum Source', 
      icon: '⚛️', 
      category: 'Quantum Mechanics',
      description: 'Source of quantum waves (placeholder)',
      defaultProperties: { waveFunction: 'gaussian', width: 1, center: { x: 0, y: 0 } }
    },
  ],
  relativity: [
    { 
      type: 'relativisticObject', 
      name: 'Relativistic Object', 
      icon: '🚀', 
      category: 'Relativity',
      description: 'Object moving at relativistic speeds with time dilation and length contraction',
      defaultProperties: { velocity: 0.5, properLength: 2, properTime: 1, beta: 0.5 }
    },
    { 
      type: 'movingGrid', 
      name: 'Moving Grid', 
      icon: '📏', 
      category: 'Relativity',
      description: 'Grid element to visualize spacetime contraction',
      defaultProperties: { scale: 1, showContraction: true, velocity: 0.5 }
    },
    { 
      type: 'clock', 
      name: 'Clock', 
      icon: '⏰', 
      category: 'Relativity',
      description: 'Clock to visualize time dilation effects',
      defaultProperties: { properTime: 1, velocity: 0.5, position: { x: 0, y: 0 } }
    },
  ],
}

export const ObjectToolbox = ({ 
  simulationType = 'classical', 
  onObjectAdd,
  theme = 'light'
}) => {
  const [selectedCategory, setSelectedCategory] = useState(simulationType)
  
  // Sync selected category with simulation type
  useEffect(() => {
    setSelectedCategory(simulationType)
  }, [simulationType])
  
  const tools = objectTemplates[selectedCategory] || []

  const handleToolClick = (tool) => {
    if (onObjectAdd) {
      const newObject = {
        id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: tool.type,
        name: tool.name,
        icon: tool.icon,
        category: tool.category,
        position: { x: 0, y: 0, z: 0 },
        properties: { ...tool.defaultProperties },
        label: tool.name,
      }
      onObjectAdd(newObject)
    }
  }

  const categories = [
    { id: 'classical', name: 'Classical', icon: '🌊' },
    { id: 'electromagnetism', name: 'EM', icon: '⚡' },
    { id: 'waves', name: 'Waves', icon: '🌐' },
    { id: 'quantum', name: 'Quantum', icon: '⚛️' },
    { id: 'relativity', name: 'Relativity', icon: '🚀' },
  ]

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-display font-bold mb-4">Object Toolbox</h2>
      
      {/* Category Selector */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tools List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleToolClick(tool)}
            className="flex items-center space-x-3 p-3 rounded-lg bg-gray-100 dark:bg-dark-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors group"
            title={tool.description}
          >
            <span className="text-2xl">{tool.icon}</span>
            <div className="flex-1">
              <div className="font-medium text-sm">{tool.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {tool.category}
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400">
              Click to add
            </div>
          </motion.div>
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No objects available for this category</p>
        </div>
      )}
    </div>
  )
}

export default ObjectToolbox

