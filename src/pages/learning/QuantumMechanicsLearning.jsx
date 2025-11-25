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

export const QuantumMechanicsLearning = () => {
  // Probability distribution for particle in a box (n=1)
  const xData = Array.from({ length: 100 }, (_, i) => (i / 100) * 10)
  const psiData = xData.map(x => Math.sin((Math.PI * x) / 10))
  const probData = psiData.map(psi => psi * psi)

  const probabilityChartData = {
    labels: xData.map(x => x.toFixed(1)),
    datasets: [
      {
        label: 'Wavefunction Ψ',
        data: psiData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Probability |Ψ|²',
        data: probData,
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
      title: { display: true, text: 'Particle in a Box: Wavefunction and Probability' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  // Tunneling probability
  const barrierData = Array.from({ length: 50 }, (_, i) => i * 0.2)
  const tunnelProbData = barrierData.map(x => Math.exp(-x))

  const tunnelingChartData = {
    labels: barrierData.map(x => x.toFixed(1)),
    datasets: [
      {
        label: 'Tunneling Probability',
        data: tunnelProbData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
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
            <span className="gradient-text">Quantum Mechanics</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            The strange world of particles at the smallest scales
          </p>
        </motion.div>

        {/* Wavefunction */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Wavefunction and Probability
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Probability Density</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    P(x) = |Ψ(x)|²
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    The probability of finding a particle at position x is proportional to |Ψ|²
                  </p>
                </div>
              </div>

              {/* Probability Graph */}
              <div className="h-64 mb-6">
                <Line data={probabilityChartData} options={chartOptions} />
              </div>

              <div className="glass rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Key Insight:</strong> The wavefunction Ψ describes the quantum state, but only |Ψ|²
                  (the probability density) has physical meaning. Where |Ψ|² is large, the particle is more
                  likely to be found.
                </p>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Particle in a Box */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Particle in a Box
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Energy Quantization</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    Eₙ = n²h²/(8mL²)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where n = quantum number, h = Planck's constant, m = mass, L = box length
                  </p>
                </div>
              </div>

              {/* Potential Well Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="500" height="300" viewBox="0 0 500 300" className="w-full max-w-2xl">
                  {/* Potential well */}
                  <rect x="100" y="50" width="300" height="200" fill="rgba(59, 130, 246, 0.1)" />
                  <line x1="100" y1="50" x2="100" y2="250" stroke="rgb(59, 130, 246)" strokeWidth="4" />
                  <line x1="400" y1="50" x2="400" y2="250" stroke="rgb(59, 130, 246)" strokeWidth="4" />
                  <line x1="100" y1="50" x2="400" y2="50" stroke="rgb(59, 130, 246)" strokeWidth="4" />

                  {/* Energy levels */}
                  {[1, 2, 3].map((n, i) => {
                    const y = 200 - i * 40
                    return (
                      <g key={n}>
                        <line x1="100" y1={y} x2="400" y2={y} stroke="rgb(236, 72, 153)" strokeWidth="2" strokeDasharray="5,5" />
                        <text x="90" y={y + 5} fill="rgb(236, 72, 153)" fontSize="14">
                          Eₙ={n}
                        </text>
                      </g>
                    )
                  })}

                  {/* Wavefunction (n=1) */}
                  <path
                    d={`M 100 150 ${xData.map((x, i) => {
                      const px = 100 + (x / 10) * 300
                      const py = 150 - psiData[i] * 50
                      return `L ${px} ${py}`
                    }).slice(1).join(' ')}`}
                    stroke="rgb(34, 197, 94)"
                    strokeWidth="3"
                    fill="none"
                  />

                  <text x="250" y="30" textAnchor="middle" fill="rgb(59, 130, 246)" fontSize="16" fontWeight="bold">
                    Infinite Potential Well
                  </text>
                </svg>
              </div>

              <div className="glass rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Example:</strong> A particle confined to a box can only have discrete energy levels
                  (E₁, E₂, E₃, ...). This quantization is a fundamental feature of quantum mechanics.
                </p>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Quantum Tunneling */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Quantum Tunneling
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Tunneling Probability</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Particles can pass through energy barriers even when their energy is less than the barrier
                  height. This is impossible classically but allowed in quantum mechanics.
                </p>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-xl font-mono text-center text-primary-600 dark:text-primary-400">
                    T ≈ e^(-2κa)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where κ = √(2m(V₀-E))/ℏ, a = barrier width
                  </p>
                </div>
              </div>

              {/* Tunneling Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="500" height="300" viewBox="0 0 500 300" className="w-full max-w-2xl">
                  {/* Potential barrier */}
                  <rect x="200" y="100" width="100" height="150" fill="rgba(239, 68, 68, 0.3)" />
                  <line x1="200" y1="100" x2="200" y2="250" stroke="rgb(239, 68, 68)" strokeWidth="4" />
                  <line x1="300" y1="100" x2="300" y2="250" stroke="rgb(239, 68, 68)" strokeWidth="4" />
                  <line x1="200" y1="100" x2="300" y2="100" stroke="rgb(239, 68, 68)" strokeWidth="4" />

                  {/* Particle energy */}
                  <line x1="0" y1="200" x2="500" y2="200" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="50" y="195" fill="rgb(34, 197, 94)" fontSize="14">
                    E
                  </text>

                  {/* Wavefunction */}
                  <path
                    d="M 0 200 Q 100 180 200 200 T 300 200 T 500 200"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.8"
                  />

                  {/* Transmitted wave */}
                  <path
                    d="M 300 200 Q 350 190 400 200"
                    stroke="rgb(236, 72, 153)"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.6"
                  />

                  <text x="250" y="80" textAnchor="middle" fill="rgb(239, 68, 68)" fontSize="16" fontWeight="bold">
                    Potential Barrier
                  </text>
                  <text x="100" y="170" fill="rgb(59, 130, 246)" fontSize="12">
                    Incident
                  </text>
                  <text x="350" y="170" fill="rgb(236, 72, 153)" fontSize="12">
                    Transmitted
                  </text>
                </svg>
              </div>

              {/* Tunneling Graph */}
              <div className="h-64 mb-6">
                <Line
                  data={tunnelingChartData}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { display: true, text: 'Tunneling Probability vs Barrier Width' } },
                  }}
                />
              </div>

              <div className="glass rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Real-World Applications:</strong> Quantum tunneling explains alpha decay in
                  radioactive nuclei, electron tunneling in semiconductors, and scanning tunneling
                  microscopes.
                </p>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Uncertainty Principle */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Heisenberg Uncertainty Principle
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Position-Momentum Uncertainty</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    Δx · Δp ≥ ℏ/2
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where ℏ = h/(2π), the reduced Planck constant
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Key Insight:</strong> The more precisely we know a particle's position, the less
                  precisely we can know its momentum, and vice versa. This is a fundamental limit, not a
                  measurement limitation.
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
                  <li>Probability Density: P(x) = |Ψ(x)|²</li>
                  <li>Energy Quantization: Eₙ = n²h²/(8mL²)</li>
                  <li>Tunneling Probability: T ≈ e^(-2κa)</li>
                  <li>Uncertainty Principle: Δx · Δp ≥ ℏ/2</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Wavefunction describes quantum state</li>
                  <li>Energy is quantized in bound systems</li>
                  <li>Particles can tunnel through barriers</li>
                  <li>Uncertainty is fundamental, not just measurement error</li>
                </ul>
              </div>
            </div>
          </PhysicsCard>
        </section>
      </div>
    </div>
  )
}

