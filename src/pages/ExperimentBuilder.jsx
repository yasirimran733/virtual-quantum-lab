import { motion } from 'framer-motion'

const tools = [
  { name: 'Particle', icon: '⚛️', color: 'from-blue-500 to-cyan-500' },
  { name: 'Charge', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { name: 'Mirror', icon: '🪞', color: 'from-gray-400 to-gray-600' },
  { name: 'Lens', icon: '🔍', color: 'from-purple-500 to-pink-500' },
  { name: 'Block', icon: '📦', color: 'from-green-500 to-emerald-500' },
  { name: 'Field', icon: '🌐', color: 'from-indigo-500 to-blue-500' },
]

export const ExperimentBuilder = () => {
  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="gradient-text">Experiment Builder</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create custom physics experiments with drag-and-drop tools
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-xl p-6 sticky top-20">
              <h2 className="text-xl font-display font-bold mb-4">
                Tools
              </h2>
              <div className="space-y-3">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-100 dark:bg-dark-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                  >
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="font-medium">{tool.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Canvas Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-xl p-8 min-h-[600px] flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🎨
                </motion.div>
                <h3 className="text-2xl font-display font-bold mb-2">
                  Canvas Area
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Drag and drop tools here to build your experiment
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Coming Soon: Interactive drag-and-drop builder
                </p>
              </div>
            </div>

            {/* Properties Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 glass rounded-xl p-6"
            >
              <h3 className="text-lg font-display font-bold mb-4">
                Properties
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mass (kg)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="1.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Velocity (m/s)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.0"
                  />
                </div>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Run Simulation
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

