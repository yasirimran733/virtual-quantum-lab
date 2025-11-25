import { motion } from 'framer-motion'
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

export const ElectromagnetismLearning = () => {
  // Field strength vs distance
  const distanceData = Array.from({ length: 50 }, (_, i) => (i + 1) * 0.1)
  const electricFieldData = distanceData.map(r => 1 / (r * r))
  const magneticFieldData = distanceData.map(r => 1 / r)

  const fieldChartData = {
    labels: distanceData.map(d => d.toFixed(1)),
    datasets: [
      {
        label: 'Electric Field E ∝ 1/r²',
        data: electricFieldData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Magnetic Field B ∝ 1/r',
        data: magneticFieldData,
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Field Strength vs Distance' },
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
            <span className="gradient-text">Electromagnetism</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Electric and magnetic fields and their interactions
          </p>
        </motion.div>

        {/* Electric Field */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Electric Field
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Point Charge Electric Field</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    E = kq/r²
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where k = 8.99×10⁹ N·m²/C², q = charge, r = distance
                  </p>
                </div>
              </div>

              {/* Electric Field Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="400" height="400" viewBox="0 0 400 400" className="w-full max-w-md">
                  {/* Positive charge */}
                  <circle cx="200" cy="200" r="20" fill="rgb(239, 68, 68)" />
                  <text x="200" y="207" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                    +
                  </text>

                  {/* Field lines */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 2 * Math.PI) / 12
                    const x1 = 200 + 30 * Math.cos(angle)
                    const y1 = 200 + 30 * Math.sin(angle)
                    const x2 = 200 + 150 * Math.cos(angle)
                    const y2 = 200 + 150 * Math.sin(angle)
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="2"
                        markerEnd="url(#arrowE)"
                      />
                    )
                  })}
                  <defs>
                    <marker id="arrowE" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="rgb(59, 130, 246)" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Magnetic Field */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Magnetic Field
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Magnetic Field Around Wire</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    B = μ₀I / (2πr)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where μ₀ = 4π×10⁻⁷ T·m/A, I = current, r = distance
                  </p>
                </div>
              </div>

              {/* Magnetic Field Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="400" height="300" viewBox="0 0 400 300" className="w-full max-w-md">
                  {/* Wire */}
                  <line x1="200" y1="0" x2="200" y2="300" stroke="rgb(34, 197, 94)" strokeWidth="6" />
                  <text x="200" y="150" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                    I
                  </text>

                  {/* Field lines */}
                  {[...Array(4)].map((_, i) => {
                    const radius = 50 + i * 40
                    return (
                      <circle
                        key={i}
                        cx="200"
                        cy="150"
                        r={radius}
                        fill="none"
                        stroke="rgb(236, 72, 153)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )
                  })}

                  {/* Direction indicators */}
                  <circle cx="250" cy="150" r="8" fill="rgb(236, 72, 153)" />
                  <text x="250" y="155" textAnchor="middle" fill="white" fontSize="10">×</text>
                  <circle cx="150" cy="150" r="8" fill="rgb(236, 72, 153)" />
                  <text x="150" y="155" textAnchor="middle" fill="white" fontSize="10">·</text>
                </svg>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Lorentz Force */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Lorentz Force
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Force on Moving Charge</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    F = q(E + v × B)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Combines electric and magnetic forces on a charged particle
                  </p>
                </div>
              </div>

              {/* Force Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="400" height="300" viewBox="0 0 400 300" className="w-full max-w-md">
                  {/* Particle */}
                  <circle cx="200" cy="150" r="15" fill="rgb(59, 130, 246)" />
                  <text x="200" y="157" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                    q
                  </text>

                  {/* Velocity */}
                  <line
                    x1="200"
                    y1="150"
                    x2="250"
                    y2="150"
                    stroke="rgb(34, 197, 94)"
                    strokeWidth="3"
                    markerEnd="url(#arrowV)"
                  />
                  <text x="225" y="140" textAnchor="middle" fill="rgb(34, 197, 94)" fontSize="12">
                    v
                  </text>

                  {/* Magnetic field */}
                  <line
                    x1="200"
                    y1="150"
                    x2="200"
                    y2="100"
                    stroke="rgb(236, 72, 153)"
                    strokeWidth="3"
                    markerEnd="url(#arrowB)"
                  />
                  <text x="210" y="125" textAnchor="middle" fill="rgb(236, 72, 153)" fontSize="12">
                    B
                  </text>

                  {/* Force (perpendicular to v and B) */}
                  <line
                    x1="200"
                    y1="150"
                    x2="200"
                    y2="200"
                    stroke="rgb(239, 68, 68)"
                    strokeWidth="3"
                    markerEnd="url(#arrowF)"
                  />
                  <text x="210" y="175" textAnchor="middle" fill="rgb(239, 68, 68)" fontSize="12">
                    F
                  </text>

                  <defs>
                    <marker id="arrowV" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="rgb(34, 197, 94)" />
                    </marker>
                    <marker id="arrowB" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="rgb(236, 72, 153)" />
                    </marker>
                    <marker id="arrowF" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="rgb(239, 68, 68)" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Field Strength Graph */}
        <section className="mb-16">
          <PhysicsCard>
            <h3 className="text-2xl font-semibold mb-4">Field Strength vs Distance</h3>
            <div className="h-64">
              <Line data={fieldChartData} options={chartOptions} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Electric field decreases as 1/r² (inverse square law), while magnetic field around a wire
              decreases as 1/r.
            </p>
          </PhysicsCard>
        </section>

        {/* Capacitors and Solenoids */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Capacitors and Solenoids
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Capacitor</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-lg font-mono text-center text-primary-600 dark:text-primary-400 mb-2">
                    C = ε₀A/d
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Stores electric energy
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Solenoid</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-lg font-mono text-center text-primary-600 dark:text-primary-400 mb-2">
                    B = μ₀nI
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Creates uniform magnetic field
                  </p>
                </div>
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
                  <li>Electric Field: E = kq/r²</li>
                  <li>Magnetic Field (wire): B = μ₀I/(2πr)</li>
                  <li>Lorentz Force: F = q(E + v × B)</li>
                  <li>Capacitance: C = ε₀A/d</li>
                  <li>Solenoid Field: B = μ₀nI</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Electric fields originate from charges</li>
                  <li>Magnetic fields are created by moving charges</li>
                  <li>Lorentz force combines electric and magnetic effects</li>
                  <li>Field strength decreases with distance</li>
                </ul>
              </div>
            </div>
          </PhysicsCard>
        </section>
      </div>
    </div>
  )
}

