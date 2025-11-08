import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-xl"
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </motion.div>
    </motion.button>
  )
}

