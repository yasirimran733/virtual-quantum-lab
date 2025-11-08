import { motion } from 'framer-motion'

const simulationCategories = [
  {
    title: 'Classical Mechanics',
    simulations: [
      { name: 'Projectile Motion', status: 'Coming Soon', icon: '🎯' },
      { name: 'Pendulum', status: 'Coming Soon', icon: '⏰' },
      { name: 'Collisions', status: 'Coming Soon', icon: '💥' },
    ],
  },
  {
    title: 'Electromagnetism',
    simulations: [
      { name: 'Electric Fields', status: 'Coming Soon', icon: '⚡' },
      { name: 'Magnetic Fields', status: 'Coming Soon', icon: '🧲' },
    ],
  },
  {
    title: 'Waves & Optics',
    simulations: [
      { name: 'Wave Interference', status: 'Coming Soon', icon: '🌊' },
      { name: 'Diffraction', status: 'Coming Soon', icon: '🔍' },
    ],
  },
  {
    title: 'Quantum Mechanics',
    simulations: [
      { name: 'Probability Waves', status: 'Coming Soon', icon: '⚛️' },
      { name: 'Quantum Tunneling', status: 'Coming Soon', icon: '🚪' },
    ],
  },
  {
    title: 'Relativity',
    simulations: [
      { name: 'Time Dilation', status: 'Coming Soon', icon: '⏱️' },
      { name: 'Lorentz Contraction', status: 'Coming Soon', icon: '📏' },
    ],
  },
]

export const Simulations = () => {
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
            <span className="gradient-text">Physics Simulations</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore interactive simulations across various physics domains
          </p>
        </motion.div>

        <div className="space-y-12">
          {simulationCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <h2 className="text-3xl font-display font-bold mb-6 text-gray-800 dark:text-gray-200">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.simulations.map((sim, simIndex) => (
                  <motion.div
                    key={sim.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (simIndex * 0.05) }}
                    whileHover={{ y: -5 }}
                    className="glass rounded-xl p-6 card-hover cursor-pointer"
                  >
                    <div className="text-4xl mb-4">{sim.icon}</div>
                    <h3 className="text-xl font-display font-semibold mb-2">
                      {sim.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {sim.status}
                    </p>
                    <div className="h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

