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

export const WavesOpticsLearning = () => {
  // Intensity vs angle for double slit
  const angleData = Array.from({ length: 100 }, (_, i) => (i - 50) * 0.1)
  const intensityData = angleData.map(θ => Math.cos(θ * 5) ** 2)

  const interferenceChartData = {
    labels: angleData.map(a => a.toFixed(1)),
    datasets: [
      {
        label: 'Intensity',
        data: intensityData,
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
      title: { display: true, text: 'Interference Pattern: Intensity vs Angle' },
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
            <span className="gradient-text">Waves & Optics</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Light, sound, and wave phenomena in nature
          </p>
        </motion.div>

        {/* Wave Equation */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Wave Equation
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Fundamental Relationship</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    v = fλ
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where v = velocity, f = frequency, λ = wavelength
                  </p>
                </div>
              </div>

              {/* Wave Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="500" height="200" viewBox="0 0 500 200" className="w-full max-w-2xl">
                  {/* Wave */}
                  <path
                    d="M 0 100 Q 62.5 50 125 100 T 250 100 T 375 100 T 500 100"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M 0 100 Q 62.5 150 125 100 T 250 100 T 375 100 T 500 100"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="3"
                    fill="none"
                  />

                  {/* Wavelength */}
                  <line x1="0" y1="50" x2="250" y2="50" stroke="rgb(236, 72, 153)" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="125" y="45" textAnchor="middle" fill="rgb(236, 72, 153)" fontSize="14" fontWeight="bold">
                    λ (wavelength)
                  </text>

                  {/* Amplitude */}
                  <line x1="62.5" y1="100" x2="62.5" y2="50" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="75" y="75" fill="rgb(34, 197, 94)" fontSize="14" fontWeight="bold">
                    A
                  </text>
                </svg>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Young's Double Slit */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Young's Double Slit Interference
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Fringe Spacing</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    β = λD/d
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where β = fringe spacing, D = screen distance, d = slit separation
                  </p>
                </div>
              </div>

              {/* Double Slit Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="500" height="300" viewBox="0 0 500 300" className="w-full max-w-2xl">
                  {/* Source */}
                  <circle cx="50" cy="150" r="10" fill="rgb(59, 130, 246)" />
                  <text x="50" y="140" textAnchor="middle" fill="rgb(59, 130, 246)" fontSize="12">
                    Source
                  </text>

                  {/* Slits */}
                  <rect x="200" y="120" width="5" height="20" fill="rgb(34, 197, 94)" />
                  <rect x="200" y="160" width="5" height="20" fill="rgb(34, 197, 94)" />
                  <text x="202" y="110" textAnchor="middle" fill="rgb(34, 197, 94)" fontSize="12">
                    d
                  </text>

                  {/* Paths */}
                  <line x1="50" y1="150" x2="202" y2="130" stroke="rgb(236, 72, 153)" strokeWidth="2" opacity="0.6" />
                  <line x1="50" y1="150" x2="202" y2="170" stroke="rgb(236, 72, 153)" strokeWidth="2" opacity="0.6" />
                  <line x1="202" y1="130" x2="450" y2="100" stroke="rgb(236, 72, 153)" strokeWidth="2" opacity="0.6" />
                  <line x1="202" y1="170" x2="450" y2="100" stroke="rgb(236, 72, 153)" strokeWidth="2" opacity="0.6" />

                  {/* Screen */}
                  <line x1="450" y1="50" x2="450" y2="250" stroke="rgb(120, 113, 108)" strokeWidth="4" />
                  <text x="460" y="150" fill="rgb(120, 113, 108)" fontSize="14" fontWeight="bold">
                    Screen
                  </text>

                  {/* Fringes */}
                  {[...Array(5)].map((_, i) => {
                    const y = 80 + i * 30
                    return (
                      <line
                        key={i}
                        x1="440"
                        y1={y}
                        x2="460"
                        y2={y}
                        stroke="rgb(239, 68, 68)"
                        strokeWidth="3"
                      />
                    )
                  })}
                </svg>
              </div>

              {/* Intensity Graph */}
              <div className="h-64">
                <Line data={interferenceChartData} options={chartOptions} />
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Reflection & Refraction */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Reflection & Refraction
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Snell's Law</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    n₁ sin(θ₁) = n₂ sin(θ₂)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where n = refractive index, θ = angle
                  </p>
                </div>
              </div>

              {/* Refraction Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="400" height="300" viewBox="0 0 400 300" className="w-full max-w-md">
                  {/* Interface */}
                  <line x1="0" y1="150" x2="400" y2="150" stroke="rgb(120, 113, 108)" strokeWidth="3" />
                  <text x="200" y="145" textAnchor="middle" fill="rgb(120, 113, 108)" fontSize="14">
                    Interface
                  </text>

                  {/* Incident ray */}
                  <line x1="100" y1="50" x2="200" y2="150" stroke="rgb(59, 130, 246)" strokeWidth="3" />
                  <text x="120" y="80" fill="rgb(59, 130, 246)" fontSize="12">
                    θ₁
                  </text>

                  {/* Refracted ray */}
                  <line x1="200" y1="150" x2="300" y2="220" stroke="rgb(236, 72, 153)" strokeWidth="3" />
                  <text x="280" y="200" fill="rgb(236, 72, 153)" fontSize="12">
                    θ₂
                  </text>

                  {/* Normal */}
                  <line x1="200" y1="0" x2="200" y2="300" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="210" y="20" fill="rgb(34, 197, 94)" fontSize="12">
                    Normal
                  </text>
                </svg>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Diffraction */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Diffraction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Waves bend around obstacles and spread out after passing through narrow openings. This creates
              characteristic diffraction patterns.
            </p>
            <div className="glass rounded-xl p-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Key Principle:</strong> When a wave encounters an obstacle or opening comparable in
                size to its wavelength, it diffracts, spreading out and creating interference patterns.
              </p>
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
                <h3 className="text-xl font-semibold mb-2">Fiber Optics</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Uses total internal reflection (Snell's Law) to guide light through optical fibers for
                  high-speed data transmission.
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <h3 className="text-xl font-semibold mb-2">Diffraction Gratings</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Used in spectrometers to separate light into its component wavelengths, enabling chemical
                  analysis.
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
                  <li>Wave Equation: v = fλ</li>
                  <li>Double Slit Fringe Spacing: β = λD/d</li>
                  <li>Snell's Law: n₁ sin(θ₁) = n₂ sin(θ₂)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Interference creates bright and dark fringes</li>
                  <li>Refraction bends light at interfaces</li>
                  <li>Diffraction spreads waves around obstacles</li>
                  <li>Wave properties explain optical phenomena</li>
                </ul>
              </div>
            </div>
          </PhysicsCard>
        </section>
      </div>
    </div>
  )
}

