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

export const ClassicalMechanicsLearning = () => {
  const [initialVelocity, setInitialVelocity] = useState(20)
  const [angle, setAngle] = useState(45)
  const [gravity] = useState(9.8)

  // Projectile motion calculations
  const timeOfFlight = (2 * initialVelocity * Math.sin((angle * Math.PI) / 180)) / gravity
  const range = (initialVelocity * initialVelocity * Math.sin((2 * angle * Math.PI) / 180)) / gravity
  const maxHeight = (initialVelocity * initialVelocity * Math.sin((angle * Math.PI) / 180) ** 2) / (2 * gravity)

  const timeData = Array.from({ length: 50 }, (_, i) => (i * timeOfFlight) / 50)
  const heightData = timeData.map(t => {
    const h = initialVelocity * Math.sin((angle * Math.PI) / 180) * t - 0.5 * gravity * t * t
    return Math.max(0, h)
  })
  const velocityData = timeData.map(t => {
    const vx = initialVelocity * Math.cos((angle * Math.PI) / 180)
    const vy = initialVelocity * Math.sin((angle * Math.PI) / 180) - gravity * t
    return Math.sqrt(vx * vx + vy * vy)
  })

  const motionChartData = {
    labels: timeData.map(t => t.toFixed(2)),
    datasets: [
      {
        label: 'Height (m)',
        data: heightData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Velocity (m/s)',
        data: velocityData,
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
      title: { display: true, text: 'Projectile Motion: Height and Velocity vs Time' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="gradient-text">Classical Mechanics</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Motion, forces, energy, and momentum in everyday objects
          </p>
        </motion.div>

        {/* Kinematics */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Kinematics Equations
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Position Equation</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    x = v₀t + ½at²
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where x = position, v₀ = initial velocity, a = acceleration, t = time
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3">Velocity Equation</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    v = v₀ + at
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3">Velocity-Displacement Relation</h3>
                <div className="glass rounded-xl p-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    v² = v₀² + 2ax
                  </p>
                </div>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Energy Conservation */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Energy Conservation
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Kinetic Energy</h3>
                <div className="glass rounded-xl p-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    KE = ½mv²
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Potential Energy</h3>
                <div className="glass rounded-xl p-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    PE = mgh
                  </p>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl p-4 mt-6">
              <p className="text-lg font-semibold mb-2">Conservation of Energy:</p>
              <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                KE₁ + PE₁ = KE₂ + PE₂
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Total energy remains constant in isolated systems
              </p>
            </div>
          </PhysicsCard>
        </section>

        {/* Projectile Motion */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Projectile Motion
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Motion of an object launched into the air, subject only to gravity.
            </p>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Initial Velocity: {initialVelocity} m/s</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={initialVelocity}
                  onChange={(e) => setInitialVelocity(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Launch Angle: {angle}°</label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Formulas */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-4">
                <p className="text-sm font-semibold mb-2">Time of Flight</p>
                <p className="text-xl font-mono text-primary-600 dark:text-primary-400">
                  T = {timeOfFlight.toFixed(2)} s
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  T = 2v₀sin(θ)/g
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-sm font-semibold mb-2">Range</p>
                <p className="text-xl font-mono text-primary-600 dark:text-primary-400">
                  R = {range.toFixed(2)} m
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  R = v₀²sin(2θ)/g
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-sm font-semibold mb-2">Max Height</p>
                <p className="text-xl font-mono text-primary-600 dark:text-primary-400">
                  H = {maxHeight.toFixed(2)} m
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  H = v₀²sin²(θ)/(2g)
                </p>
              </div>
            </div>

            {/* Trajectory Diagram */}
            <div className="flex justify-center items-center py-8 mb-6">
              <svg width="500" height="300" viewBox="0 0 500 300" className="w-full max-w-2xl">
                {/* Ground */}
                <line x1="0" y1="280" x2="500" y2="280" stroke="rgb(34, 197, 94)" strokeWidth="3" />
                <text x="250" y="295" textAnchor="middle" fill="rgb(34, 197, 94)" fontSize="14">Ground</text>

                {/* Trajectory */}
                <path
                  d={`M 50 280 ${timeData.map((t, i) => {
                    const x = 50 + (i * 450) / 50
                    const y = 280 - (heightData[i] * 200) / maxHeight
                    return `L ${x} ${y}`
                  }).join(' ')}`}
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="3"
                  fill="none"
                />

                {/* Projectile */}
                <circle
                  cx={50 + (range * 450) / (range * 1.2)}
                  cy={280 - (maxHeight * 200) / maxHeight}
                  r="8"
                  fill="rgb(236, 72, 153)"
                />

                {/* Velocity vectors */}
                <line
                  x1="50"
                  y1="280"
                  x2={50 + initialVelocity * Math.cos((angle * Math.PI) / 180) * 3}
                  y2={280 - initialVelocity * Math.sin((angle * Math.PI) / 180) * 3}
                  stroke="rgb(239, 68, 68)"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="rgb(239, 68, 68)" />
                  </marker>
                </defs>
                <text x="100" y="250" fill="rgb(239, 68, 68)" fontSize="12">v₀</text>
              </svg>
            </div>

            {/* Graph */}
            <div className="h-64 mb-6">
              <Line data={motionChartData} options={chartOptions} />
            </div>
          </PhysicsCard>
        </section>

        {/* Collisions */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Collisions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Momentum Conservation</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    p = mv
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Total momentum is conserved: p₁ + p₂ = p₁' + p₂'
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Elastic Collision</h3>
                  <div className="glass rounded-xl p-4">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Both momentum and kinetic energy are conserved.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Example: Billiard balls, atoms in gas
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Inelastic Collision</h3>
                  <div className="glass rounded-xl p-4">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Momentum is conserved, but kinetic energy is not.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Example: Car crashes, clay balls sticking together
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Pendulum */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Pendulum Motion
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Period of Simple Pendulum</h3>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    T = 2π√(L/g)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where L = length, g = gravitational acceleration
                  </p>
                </div>
              </div>

              {/* Pendulum Diagram */}
              <div className="flex justify-center items-center py-8">
                <svg width="300" height="400" viewBox="0 0 300 400" className="w-full max-w-sm">
                  {/* Support */}
                  <line x1="150" y1="0" x2="150" y2="50" stroke="rgb(120, 113, 108)" strokeWidth="4" />
                  <rect x="130" y="0" width="40" height="20" fill="rgb(120, 113, 108)" />

                  {/* String */}
                  <line
                    x1="150"
                    y1="50"
                    x2="200"
                    y2="200"
                    stroke="rgb(34, 197, 94)"
                    strokeWidth="3"
                  />

                  {/* Bob */}
                  <circle cx="200" cy="200" r="20" fill="rgb(59, 130, 246)" />
                  <text x="200" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                    m
                  </text>

                  {/* Arc */}
                  <path
                    d="M 150 50 A 150 150 0 0 1 200 200"
                    stroke="rgb(236, 72, 153)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    opacity="0.5"
                  />

                  {/* Labels */}
                  <text x="175" y="125" fill="rgb(34, 197, 94)" fontSize="14" fontWeight="bold">
                    L
                  </text>
                  <text x="220" y="190" fill="rgb(236, 72, 153)" fontSize="12">
                    θ
                  </text>
                </svg>
              </div>

              <div className="glass rounded-xl p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  The period depends only on length and gravity, not on mass or amplitude (for small angles).
                  This makes pendulums useful for timekeeping.
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
                  <li>Position: x = v₀t + ½at²</li>
                  <li>Velocity: v = v₀ + at</li>
                  <li>Kinetic Energy: KE = ½mv²</li>
                  <li>Potential Energy: PE = mgh</li>
                  <li>Momentum: p = mv</li>
                  <li>Pendulum Period: T = 2π√(L/g)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Key Principles:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Conservation of energy in isolated systems</li>
                  <li>Conservation of momentum in collisions</li>
                  <li>Projectile motion combines horizontal and vertical motion</li>
                  <li>Pendulum motion is periodic and independent of mass</li>
                </ul>
              </div>
            </div>
          </PhysicsCard>
        </section>
      </div>
    </div>
  )
}

