import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const topics = [
  {
    id: 'faraday',
    title: "Faraday's Law & Applications",
    description: 'Electromagnetic induction, generators, transformers, and induction heating',
    icon: '🌀',
    concepts: ['Magnetic Flux', 'Faraday\'s Law', 'Lenz\'s Law', 'EMF Induction'],
  },
  {
    id: 'classical',
    title: 'Classical Mechanics',
    description: 'Understanding motion, forces, and energy in everyday objects',
    icon: '🌊',
    concepts: ['Newton\'s Laws', 'Conservation of Energy', 'Momentum', 'Rotational Motion'],
  },
  {
    id: 'electromagnetism',
    title: 'Electromagnetism',
    description: 'Exploring electric and magnetic fields and their interactions',
    icon: '⚡',
    concepts: ['Electric Fields', 'Magnetic Fields', 'Maxwell\'s Equations', 'Electromagnetic Waves'],
  },
  {
    id: 'waves',
    title: 'Waves & Optics',
    description: 'Light, sound, and wave phenomena in nature',
    icon: '🌐',
    concepts: ['Wave Interference', 'Diffraction', 'Reflection & Refraction', 'Doppler Effect'],
  },
  {
    id: 'quantum',
    title: 'Quantum Mechanics',
    description: 'The strange world of particles at the smallest scales',
    icon: '⚛️',
    concepts: ['Wave-Particle Duality', 'Uncertainty Principle', 'Quantum Tunneling', 'Superposition'],
  },
  {
    id: 'relativity',
    title: 'Relativity',
    description: 'Space, time, and the fabric of the universe',
    icon: '🚀',
    concepts: ['Special Relativity', 'Time Dilation', 'Lorentz Contraction', 'General Relativity'],
  },
]

export const Learn = () => {
  const navigate = useNavigate()

  const handleTopicClick = (topicId) => {
    navigate(`/learn/${topicId}`)
  }

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
            <span className="gradient-text">Learn Physics</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore fundamental physics concepts with interactive explanations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => handleTopicClick(topic.id)}
              className="glass rounded-2xl p-6 card-hover cursor-pointer"
            >
              <div className="text-5xl mb-4">{topic.icon}</div>
              <h2 className="text-2xl font-display font-bold mb-3">
                {topic.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {topic.description}
              </p>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Key Concepts:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topic.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="px-3 py-1 text-xs rounded-full bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

