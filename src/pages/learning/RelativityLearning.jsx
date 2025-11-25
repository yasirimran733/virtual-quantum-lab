import { motion } from 'framer-motion'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { PhysicsCard } from '../../components/physics'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export const RelativityLearning = () => {
  const [velocity, setVelocity] = useState(0.5) // as fraction of c
  const c = 1 // speed of light (normalized)

  // Time dilation factor
  const gamma = 1 / Math.sqrt(1 - (velocity * velocity) / (c * c))
  const timeDilated = 1 * gamma

  // Length contraction
  const lengthContracted = 1 / gamma

  // Time dilation vs velocity graph
  const vData = Array.from({ length: 50 }, (_, i) => (i / 50) * 0.99)
  const gammaData = vData.map(v => 1 / Math.sqrt(1 - (v * v) / (c * c)))

  const dilationChartData = {
    labels: vData.map(v => (v * 100).toFixed(0)),
    datasets: [
      {
        label: 'Time Dilation Factor γ',
        data: gammaData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Time Dilation Factor vs Velocity (% of c)' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="gradient-text">Relativity</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Space, time, and the fabric of the universe
          </p>
        </motion.div>

        {/* Time Dilation */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Time Dilation
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Time Dilation Formula</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    t' = t / √(1 - v²/c²)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where t' = dilated time, t = proper time, v = velocity, c = speed of light
                  </p>
                </div>
              </div>

              {/* Control */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Velocity: {(velocity * 100).toFixed(0)}% of c
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.99"
                  step="0.01"
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Results */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-4">
                  <p className="text-sm font-semibold mb-2">Time Dilation Factor (γ)</p>
                  <p className="text-2xl font-mono text-primary-600 dark:text-primary-400">
                    γ = {gamma.toFixed(3)}
                  </p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm font-semibold mb-2">Dilated Time</p>
                  <p className="text-2xl font-mono text-primary-600 dark:text-primary-400">
                    t' = {timeDilated.toFixed(3)}t
                  </p>
                </div>
              </div>

              {/* Time Dilation Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="500" height="300" viewBox="0 0 500 300" className="w-full max-w-2xl">
                  {/* Stationary observer */}
                  <rect x="50" y="50" width="100" height="150" fill="rgba(59, 130, 246, 0.2)" />
                  <text x="100" y="30" textAnchor="middle" fill="rgb(59, 130, 246)" fontSize="14" fontWeight="bold">
                    Stationary Observer
                  </text>
                  <circle cx="100" cy="150" r="15" fill="rgb(59, 130, 246)" />
                  <text x="100" y="155" textAnchor="middle" fill="white" fontSize="12">Clock</text>

                  {/* Moving frame */}
                  <rect
                    x={200 + velocity * 200}
                    y="50"
                    width="100"
                    height="150"
                    fill="rgba(236, 72, 153, 0.2)"
                  />
                  <text
                    x={250 + velocity * 200}
                    y="30"
                    textAnchor="middle"
                    fill="rgb(236, 72, 153)"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    Moving Frame
                  </text>
                  <circle cx={250 + velocity * 200} cy="150" r="15" fill="rgb(236, 72, 153)" />
                  <text x={250 + velocity * 200} y="155" textAnchor="middle" fill="white" fontSize="12">
                    Clock
                  </text>

                  {/* Velocity arrow */}
                  <line
                    x1="300"
                    y1="200"
                    x2="400"
                    y2="200"
                    stroke="rgb(34, 197, 94)"
                    strokeWidth="3"
                    markerEnd="url(#arrowV)"
                  />
                  <text x="350" y="190" textAnchor="middle" fill="rgb(34, 197, 94)" fontSize="14">
                    v = {(velocity * 100).toFixed(0)}% c
                  </text>
                  <defs>
                    <marker id="arrowV" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="rgb(34, 197, 94)" />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* Graph */}
              <div className="h-64">
                <Line data={dilationChartData} options={chartOptions} />
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Length Contraction */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Length Contraction
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Length Contraction Formula</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    L = L₀ √(1 - v²/c²)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where L = contracted length, L₀ = proper length
                  </p>
                </div>
              </div>

              {/* Length Contraction Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="500" height="200" viewBox="0 0 500 200" className="w-full max-w-2xl">
                  {/* Rest frame */}
                  <rect x="50" y="50" width="200" height="100" fill="rgba(59, 130, 246, 0.2)" />
                  <text x="150" y="30" textAnchor="middle" fill="rgb(59, 130, 246)" fontSize="14" fontWeight="bold">
                    Rest Frame: L₀
                  </text>
                  <line x1="50" y1="100" x2="250" y2="100" stroke="rgb(59, 130, 246)" strokeWidth="4" />

                  {/* Moving frame */}
                  <rect x="50" y="120" width={200 / gamma} height="60" fill="rgba(236, 72, 153, 0.2)" />
                  <text x={50 + 100 / gamma} y="115" textAnchor="middle" fill="rgb(236, 72, 153)" fontSize="14" fontWeight="bold">
                    Moving Frame: L = L₀/γ
                  </text>
                  <line
                    x1="50"
                    y1="150"
                    x2={50 + 200 / gamma}
                    y2="150"
                    stroke="rgb(236, 72, 153)"
                    strokeWidth="4"
                  />
                </svg>
              </div>

              <div className="glass rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Key Insight:</strong> Objects appear shorter in the direction of motion when
                  observed from a different reference frame. The contraction factor is the same as the time
                  dilation factor.
                </p>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Spacetime Diagrams */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Spacetime Diagrams
            </h2>
            <div className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                Spacetime diagrams combine space and time into a single coordinate system, showing how
                events relate in different reference frames.
              </p>

              {/* Spacetime Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="400" height="400" viewBox="0 0 400 400" className="w-full max-w-md">
                  {/* Axes */}
                  <line x1="200" y1="0" x2="200" y2="400" stroke="rgb(59, 130, 246)" strokeWidth="2" />
                  <line x1="0" y1="200" x2="400" y2="200" stroke="rgb(236, 72, 153)" strokeWidth="2" />
                  <text x="210" y="20" fill="rgb(59, 130, 246)" fontSize="14" fontWeight="bold">
                    Time (ct)
                  </text>
                  <text x="380" y="210" fill="rgb(236, 72, 153)" fontSize="14" fontWeight="bold">
                    Space (x)
                  </text>

                  {/* Light cone */}
                  <line x1="200" y1="200" x2="0" y2="0" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                  <line x1="200" y1="200" x2="400" y2="0" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
                  <text x="100" y="100" fill="rgb(34, 197, 94)" fontSize="12">
                    Light Cone
                  </text>

                  {/* World line */}
                  <line x1="200" y1="200" x2="300" y2="100" stroke="rgb(239, 68, 68)" strokeWidth="3" />
                  <text x="280" y="90" fill="rgb(239, 68, 68)" fontSize="12">
                    World Line
                  </text>
                </svg>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Real-World Applications */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Real-World Applications
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-4">
                <h3 className="text-xl font-semibold mb-2">GPS Satellites</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  GPS satellites must account for both special and general relativistic time dilation to
                  maintain accurate positioning. Without corrections, GPS would be off by kilometers.
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <h3 className="text-xl font-semibold mb-2">Particle Accelerators</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Particles accelerated to near light speed experience significant time dilation, allowing
                  unstable particles to travel farther before decaying.
                </p>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Summary */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Summary
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Key Formulas:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Time Dilation: t' = t/√(1 - v²/c²)</li>
                  <li>Length Contraction: L = L₀√(1 - v²/c²)</li>
                  <li>Lorentz Factor: γ = 1/√(1 - v²/c²)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Time is relative, not absolute</li>
                  <li>Length contracts in direction of motion</li>
                  <li>Speed of light is constant in all frames</li>
                  <li>Effects become significant near light speed</li>
                </ul>
              </div>
            </div>
          </PhysicsCard>
        </section>
      </div>
    </div>
  )
}

