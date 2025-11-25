import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { fetchQuantumRandom, getSingleRandom, getMultipleRandom, getRandomHex } from '../utils/qrngApi'

/**
 * ANU QRNG Page
 * Australian National University Quantum Random Number Generator
 * Provides true quantum randomness for physics simulations and experiments
 */
export const QRNG = () => {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)
  const [history, setHistory] = useState([])
  const [config, setConfig] = useState({
    length: 10,
    type: 'uint16',
  })
  const [classicalConfig, setClassicalConfig] = useState({
    length: 10,
    type: 'uint16',
  })

  // Fetch random numbers
  const handleFetch = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await fetchQuantumRandom({
        length: config.length,
        type: config.type,
      })
      
      setResults(data)
      
      // Add to history
      setHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          length: config.length,
          type: config.type,
          data: data.data || data,
        },
        ...prev.slice(0, 9), // Keep last 10
      ])
    } catch (err) {
      setError(err.message || 'Failed to fetch quantum random numbers')
      console.error('QRNG Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Quick fetch single number
  const handleQuickFetch = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const number = await getSingleRandom(config.type)
      setResults({ data: [number], success: true })
      
      setHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          length: 1,
          type: config.type,
          data: [number],
        },
        ...prev.slice(0, 9),
      ])
    } catch (err) {
      setError(err.message || 'Failed to fetch quantum random number')
    } finally {
      setLoading(false)
    }
  }

  // Get hex values
  const handleFetchHex = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const hexValues = await getRandomHex(config.length)
      setResults({ data: hexValues, success: true })
      
      setHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          length: config.length,
          type: 'hex16',
          data: hexValues,
        },
        ...prev.slice(0, 9),
      ])
    } catch (err) {
      setError(err.message || 'Failed to fetch quantum random hex values')
    } finally {
      setLoading(false)
    }
  }

  // Copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  // Format data for display
  const formatData = (data) => {
    if (Array.isArray(data)) {
      return data.join(', ')
    }
    return String(data)
  }

  // Calculate statistics
  const calculateStats = (data) => {
    if (!Array.isArray(data) || data.length === 0) return null
    
    const numbers = data.filter((n) => typeof n === 'number')
    if (numbers.length === 0) return null
    
    const sum = numbers.reduce((a, b) => a + b, 0)
    const avg = sum / numbers.length
    const min = Math.min(...numbers)
    const max = Math.max(...numbers)
    const variance = numbers.reduce((acc, n) => acc + Math.pow(n - avg, 2), 0) / numbers.length
    const stdDev = Math.sqrt(variance)
    
    return { avg, min, max, stdDev, count: numbers.length }
  }

  // Classical RNG Handler
  const handleClassicalFetch = () => {
    setLoading(true)
    setError(null)
    
    // Simulate slight delay for UX consistency
    setTimeout(() => {
      try {
        const length = classicalConfig.length
        const type = classicalConfig.type
        let data = []

        if (type === 'hex16') {
          // Generate hex strings
          for (let i = 0; i < length; i++) {
            const val = Math.floor(Math.random() * 65536)
            data.push(val.toString(16).padStart(4, '0'))
          }
        } else if (type === 'uint16bin') {
          // Generate binary strings
          for (let i = 0; i < length; i++) {
            const val = Math.floor(Math.random() * 65536)
            data.push(val.toString(2).padStart(16, '0'))
          }
        } else {
          // Generate numbers
          const max = type === 'uint8' ? 255 : 65535
          for (let i = 0; i < length; i++) {
            data.push(Math.floor(Math.random() * (max + 1)))
          }
        }

        setResults({ data, success: true, source: 'Classical (Pseudo-Random)' })
        
        setHistory((prev) => [
          {
            timestamp: new Date().toLocaleTimeString(),
            length: length,
            type: type,
            data: data,
            source: 'CRNG'
          },
          ...prev.slice(0, 9),
        ])
      } catch (err) {
        setError('Failed to generate classical random numbers')
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const handleClassicalQuickFetch = () => {
    setLoading(true)
    setError(null)
    
    setTimeout(() => {
      try {
        const type = classicalConfig.type
        let number
        if (type === 'hex16') {
          const val = Math.floor(Math.random() * 65536)
          number = val.toString(16).padStart(4, '0')
        } else if (type === 'uint16bin') {
          const val = Math.floor(Math.random() * 65536)
          number = val.toString(2).padStart(16, '0')
        } else {
          const max = type === 'uint8' ? 255 : 65535
          number = Math.floor(Math.random() * (max + 1))
        }

        setResults({ data: [number], success: true, source: 'Classical (Pseudo-Random)' })
        
        setHistory((prev) => [
          {
            timestamp: new Date().toLocaleTimeString(),
            length: 1,
            type: type,
            data: [number],
            source: 'CRNG'
          },
          ...prev.slice(0, 9),
        ])
      } catch (err) {
        setError('Failed to generate classical random number')
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const handleClassicalHexFetch = () => {
    setLoading(true)
    setError(null)
    
    setTimeout(() => {
      try {
        const length = classicalConfig.length
        let data = []
        for (let i = 0; i < length; i++) {
          const val = Math.floor(Math.random() * 65536)
          data.push(val.toString(16).padStart(4, '0'))
        }

        setResults({ data, success: true, source: 'Classical (Pseudo-Random)' })
        
        setHistory((prev) => [
          {
            timestamp: new Date().toLocaleTimeString(),
            length: length,
            type: 'hex16',
            data: data,
            source: 'CRNG'
          },
          ...prev.slice(0, 9),
        ])
      } catch (err) {
        setError('Failed to generate classical hex values')
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const stats = results?.data ? calculateStats(results.data) : null

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4 inline-block"
          >
            🌀
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="gradient-text">ANU Quantum Random Number Generator</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Generate true quantum randomness using the Australian National University's quantum random number generator.
            Perfect for physics simulations, cryptography, and scientific research.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-2xl font-display font-bold mb-4">Configuration</h2>
              
              {/* Length Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Number of Values (1-1024)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1024"
                  value={config.length}
                  onChange={(e) => setConfig({ ...config, length: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Type Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Number Type
                </label>
                <select
                  value={config.type}
                  onChange={(e) => setConfig({ ...config, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="uint8">uint8 (0-255)</option>
                  <option value="uint16">uint16 (0-65535)</option>
                  <option value="hex16">hex16 (Hexadecimal)</option>
                  <option value="uint16bin">uint16bin (Binary)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFetch}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '🌀 Generating...' : `🌀 Generate ${config.length} Numbers`}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQuickFetch}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⚡ Quick Single Number
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFetchHex}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔢 Generate Hex Values
                </motion.button>
              </div>
            </motion.div>

            {/* Classical RNG Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-2xl font-display font-bold mb-4">Classical RNG</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Standard pseudo-random number generator using deterministic algorithms (Math.random).
              </p>
              
              {/* Length Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Number of Values (1-1024)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1024"
                  value={classicalConfig.length}
                  onChange={(e) => setClassicalConfig({ ...classicalConfig, length: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Type Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Number Type
                </label>
                <select
                  value={classicalConfig.type}
                  onChange={(e) => setClassicalConfig({ ...classicalConfig, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="uint8">uint8 (0-255)</option>
                  <option value="uint16">uint16 (0-65535)</option>
                  <option value="hex16">hex16 (Hexadecimal)</option>
                  <option value="uint16bin">uint16bin (Binary)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClassicalFetch}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '🎲 Generating...' : `🎲 Generate ${classicalConfig.length} Numbers`}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClassicalQuickFetch}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⚡ Quick Single Number
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClassicalHexFetch}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔢 Generate Hex Values
                </motion.button>
              </div>
              
              {error && error.includes('Quantum') && (
                <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center">
                  <span className="mr-1">✔</span> Quantum source temporarily unavailable. Try classical generator above.
                </div>
              )}
            </motion.div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4 bg-red-500/10 border border-red-500/20"
              >
                <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ Error: {error}</p>
              </motion.div>
            )}

            {/* Results Display */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-display font-bold">
                    Results <span className="text-sm font-normal text-gray-500 ml-2">({results.source || 'Quantum Source'})</span>
                  </h2>
                  {results.data && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopy(formatData(results.data))}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
                    >
                      📋 Copy
                    </motion.button>
                  )}
                </div>

                {/* Statistics */}
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Count</div>
                      <div className="text-lg font-bold">{stats.count}</div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Average</div>
                      <div className="text-lg font-bold">{stats.avg.toFixed(2)}</div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min</div>
                      <div className="text-lg font-bold">{stats.min}</div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max</div>
                      <div className="text-lg font-bold">{stats.max}</div>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Std Dev</div>
                      <div className="text-lg font-bold">{stats.stdDev.toFixed(2)}</div>
                    </div>
                  </div>
                )}

                {/* Data Display */}
                <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                    {formatData(results.data || results)}
                  </pre>
                </div>
              </motion.div>
            )}

            {/* History */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-xl p-6"
              >
                <h2 className="text-2xl font-display font-bold mb-4">Recent History</h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-800 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {item.timestamp} • {item.length} × {item.type} <span className="text-xs text-gray-500">({item.source || 'QRNG'})</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {formatData(item.data.slice(0, 5))}
                          {item.data.length > 5 && '...'}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopy(formatData(item.data))}
                        className="ml-2 p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 rounded"
                        title="Copy"
                      >
                        📋
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!results && !error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-12 text-center"
              >
                <div className="text-6xl mb-4">🌀</div>
                <h3 className="text-xl font-display font-bold mb-2">Ready to Generate</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure your settings and click "Generate" to get quantum random numbers
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">
            Quantum vs Classical Randomness – What’s the Difference?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Classical Card */}
            <div className="glass rounded-xl p-8 border-t-4 border-blue-500">
              <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">🔹 Classical RNG (CRNG)</h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start"><span className="mr-2">⚙️</span> Deterministic algorithm</li>
                <li className="flex items-start"><span className="mr-2">🎲</span> Generates pseudo-random numbers</li>
                <li className="flex items-start"><span className="mr-2">🔄</span> Repeatable if seed is known</li>
                <li className="flex items-start"><span className="mr-2">🎮</span> Used for simulations, games, UI effects</li>
                <li className="flex items-start"><span className="mr-2">⚡</span> Faster but predictable</li>
              </ul>
            </div>

            {/* Quantum Card */}
            <div className="glass rounded-xl p-8 border-t-4 border-purple-500">
              <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">🔹 Quantum RNG (QRNG)</h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start"><span className="mr-2">🌌</span> Uses real quantum events: photon arrival, vacuum fluctuations</li>
                <li className="flex items-start"><span className="mr-2">🎲</span> Truly unpredictable</li>
                <li className="flex items-start"><span className="mr-2">🚫</span> Non-deterministic</li>
                <li className="flex items-start"><span className="mr-2">🔐</span> Used in cryptography, secure keys, lottery systems</li>
              </ul>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="glass rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 font-bold text-gray-900 dark:text-white">Feature</th>
                  <th className="p-4 font-bold text-blue-600 dark:text-blue-400">Classical RNG</th>
                  <th className="p-4 font-bold text-purple-600 dark:text-purple-400">Quantum RNG</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 dark:text-gray-300">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 font-semibold">Predictability</td>
                  <td className="p-4">Predictable if seed is known</td>
                  <td className="p-4 font-bold text-green-600 dark:text-green-400">Truly Unpredictable</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 font-semibold">Entropy Source</td>
                  <td className="p-4">Mathematical Formula</td>
                  <td className="p-4">Physical Quantum Phenomena</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 font-semibold">Speed</td>
                  <td className="p-4 font-bold text-green-600 dark:text-green-400">Very Fast (CPU cycles)</td>
                  <td className="p-4">Limited by hardware rate</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 font-semibold">Security</td>
                  <td className="p-4">Vulnerable to reverse-engineering</td>
                  <td className="p-4 font-bold text-green-600 dark:text-green-400">Information-theoretically secure</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Hardware</td>
                  <td className="p-4">Standard CPU</td>
                  <td className="p-4">Specialized Quantum Device</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Physics Explanation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">
            The Physics of Randomness
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text">1. Quantum Vacuum Fluctuations</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                According to quantum mechanics, the vacuum is not empty but filled with fleeting fluctuations of energy. 
                When we measure these fluctuations (or photon arrival times), the result is fundamentally random.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                When a photon hits a beam splitter, it has a 50% probability of being reflected or transmitted. 
                This is not due to lack of knowledge, but an intrinsic property of nature.
              </p>
              
              <div className="bg-gray-100 dark:bg-dark-900 p-4 rounded-lg mb-4 font-mono text-sm">
                <div className="text-gray-500 mb-1">Probability of detection:</div>
                <div className="text-lg">P = |Ψ|²</div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The Born rule states that the probability density of finding a particle at a given point is proportional 
                to the square of the magnitude of its wavefunction Ψ. The collapse of the wavefunction upon measurement 
                yields a truly random result.
              </p>
            </div>

            <div className="glass rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">2. Classical Pseudo-Randomness</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Classical computers are deterministic machines. They cannot generate true randomness. Instead, they use 
                algorithms like the Linear Congruential Generator (LCG) to produce sequences that <em>look</em> random.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                If you know the starting number (seed) and the formula, you can predict every subsequent number perfectly.
              </p>
              
              <div className="bg-gray-100 dark:bg-dark-900 p-4 rounded-lg mb-4 font-mono text-sm">
                <div className="text-gray-500 mb-1">LCG Formula:</div>
                <div className="text-lg">Xₙ₊₁ = (aXₙ + c) mod m</div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Where X is the sequence of pseudo-random values. Since 'a', 'c', and 'm' are constants, the next value 
                depends entirely on the previous one. This makes it unsuitable for high-security cryptography.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">
            Who Uses These Numbers?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">🔐</span> QRNG Applications
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <strong>Cybersecurity:</strong> Generating unbreakable encryption keys</li>
                <li>• <strong>Blockchain:</strong> Ensuring fair consensus and lottery selection</li>
                <li>• <strong>Research:</strong> Monte Carlo simulations requiring true independence</li>
                <li>• <strong>Gaming:</strong> Certified fair gambling systems</li>
              </ul>
            </div>
            
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">🎮</span> CRNG Applications
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <strong>Video Games:</strong> Procedural generation, loot drops, enemy AI</li>
                <li>• <strong>UI Effects:</strong> Particle systems, animations</li>
                <li>• <strong>Basic Simulations:</strong> Educational demos where speed matters</li>
                <li>• <strong>Testing:</strong> Randomized input for software testing</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Future Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 mb-12 text-center"
        >
          <div className="glass rounded-xl p-8 max-w-4xl mx-auto bg-gradient-to-br from-primary-500/5 to-purple-500/5">
            <h2 className="text-3xl font-display font-bold mb-6">Why QRNG is the Future</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              As computing power grows, classical encryption becomes vulnerable. Quantum randomness provides the 
              foundation for post-quantum security, offering true entropy that is physically impossible to reverse-engineer.
            </p>
            
            <div className="flex justify-center items-end h-48 gap-4 max-w-md mx-auto mb-4">
              {/* Simple CSS Bar Chart Visualization of Entropy/Security */}
              <div className="w-1/3 flex flex-col items-center group">
                <div className="w-full bg-blue-400/30 h-32 rounded-t-lg relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 h-[60%] transition-all duration-1000 group-hover:h-[65%]"></div>
                </div>
                <div className="mt-2 text-sm font-bold text-gray-600 dark:text-gray-400">Classical</div>
              </div>
              <div className="w-1/3 flex flex-col items-center group">
                <div className="w-full bg-purple-400/30 h-48 rounded-t-lg relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-500 to-purple-500 h-[95%] transition-all duration-1000 group-hover:h-full animate-pulse"></div>
                </div>
                <div className="mt-2 text-sm font-bold text-primary-600 dark:text-primary-400">Quantum</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Security & Entropy Level</p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default QRNG

