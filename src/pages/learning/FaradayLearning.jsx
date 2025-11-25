import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
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

export const FaradayLearning = () => {
  const [generatorSpeed, setGeneratorSpeed] = useState(10)
  const [turns, setTurns] = useState(100)
  const [fieldStrength, setFieldStrength] = useState(0.5)
  const [frequency, setFrequency] = useState(60)

  // Flux vs Time Graph Data
  const timeData = Array.from({ length: 100 }, (_, i) => i * 0.1)
  const fluxData = timeData.map(t => Math.cos(2 * Math.PI * 0.5 * t))
  const emfData = timeData.map(t => -2 * Math.PI * 0.5 * Math.sin(2 * Math.PI * 0.5 * t))

  const fluxChartData = {
    labels: timeData.map(t => t.toFixed(1)),
    datasets: [
      {
        label: 'Magnetic Flux (φ)',
        data: fluxData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Induced EMF (ε)',
        data: emfData,
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const fluxChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Flux and EMF vs Time' },
    },
    scales: {
      y: { beginAtZero: false },
    },
  }

  // Generator EMF calculation
  const generatorEMF = (t) => {
    const omega = (generatorSpeed * 2 * Math.PI) / 60
    return turns * 0.1 * fieldStrength * omega * Math.sin(omega * t)
  }

  const generatorTimeData = Array.from({ length: 50 }, (_, i) => i * 0.1)
  const generatorEMFData = generatorTimeData.map(t => generatorEMF(t))

  const generatorChartData = {
    labels: generatorTimeData.map(t => t.toFixed(1)),
    datasets: [
      {
        label: 'Induced Voltage (V)',
        data: generatorEMFData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Transformer voltage ratio
  const primaryTurns = 100
  const secondaryTurns = 200
  const inputVoltage = 120
  const outputVoltage = (inputVoltage * secondaryTurns) / primaryTurns

  // Heat power vs frequency
  const freqData = [20, 40, 60, 80, 100, 120]
  const powerData = freqData.map(f => f * f * 0.1)

  const heatingChartData = {
    labels: freqData.map(f => `${f} Hz`),
    datasets: [
      {
        label: 'Heating Power (W)',
        data: powerData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
      },
    ],
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
            <span className="gradient-text">Faraday's Law & Applications</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Electromagnetic induction, generators, transformers, and induction heating
          </p>
        </motion.div>

        {/* Core Concepts */}
        <section className="mb-16">
          <PhysicsCard className="mb-8">
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Core Concepts
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">1. Magnetic Flux</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Magnetic flux (φ) measures the total magnetic field passing through a surface area.
                </p>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    φ = B · A · cos(θ)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Where B = magnetic field strength, A = area, θ = angle between field and normal
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3">2. Faraday's Law</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The induced electromotive force (EMF) in any closed circuit equals the negative rate of change
                  of the magnetic flux through the circuit.
                </p>
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400">
                    ε = -dφ/dt
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    The negative sign indicates the direction of induced current (Lenz's Law)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3">3. Lenz's Law</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The direction of induced current always opposes the change in magnetic flux that produced it.
                  This ensures conservation of energy.
                </p>
                <div className="glass rounded-xl p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Example:</strong> When a magnet approaches a coil, the induced current creates a
                    magnetic field that repels the magnet, requiring work to move it closer.
                  </p>
                </div>
              </div>
            </div>
          </PhysicsCard>

          {/* Flux vs Time Graph */}
          <PhysicsCard>
            <h3 className="text-2xl font-semibold mb-4">Flux and EMF Relationship</h3>
            <div className="h-64">
              <Line data={fluxChartData} options={fluxChartOptions} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Notice how EMF is maximum when flux change is maximum (steepest slope), and EMF is zero when
              flux is at its peak or trough.
            </p>
          </PhysicsCard>
        </section>

        {/* Coil + Magnet Diagram */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Visual Diagram: Coil and Magnet
            </h2>
            <div className="flex justify-center items-center py-8">
              <svg width="400" height="300" viewBox="0 0 400 300" className="w-full max-w-md">
                {/* Magnetic field lines */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="rgb(59, 130, 246)" />
                  </marker>
                </defs>
                {[...Array(8)].map((_, i) => {
                  const y = 50 + i * 25
                  return (
                    <path
                      key={i}
                      d={`M 50 ${y} Q 200 ${y - 20} 350 ${y}`}
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                      opacity="0.6"
                    />
                  )
                })}
                {/* Magnet */}
                <rect x="30" y="100" width="40" height="100" fill="rgb(239, 68, 68)" rx="5" />
                <text x="50" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  N
                </text>
                <text x="50" y="185" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  S
                </text>
                {/* Coil */}
                <ellipse cx="200" cy="150" rx="60" ry="80" fill="none" stroke="rgb(34, 197, 94)" strokeWidth="4" />
                {[...Array(5)].map((_, i) => (
                  <line
                    key={i}
                    x1={140 + i * 15}
                    y1="70"
                    x2={140 + i * 15}
                    y2="230"
                    stroke="rgb(34, 197, 94)"
                    strokeWidth="2"
                  />
                ))}
                <text x="200" y="250" textAnchor="middle" fill="rgb(34, 197, 94)" fontSize="16" fontWeight="bold">
                  Coil
                </text>
                {/* Induced current arrow */}
                <path
                  d="M 260 150 L 300 150"
                  stroke="rgb(236, 72, 153)"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
                <text x="280" y="140" textAnchor="middle" fill="rgb(236, 72, 153)" fontSize="12">
                  I
                </text>
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              As the magnet moves toward the coil, the changing magnetic flux induces a current that creates
              a magnetic field opposing the magnet's motion (Lenz's Law).
            </p>
          </PhysicsCard>
        </section>

        {/* Application 1: Electric Generator */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Application 1: Electric Generator
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Rotating a coil in a magnetic field induces EMF and current. The faster the rotation, the
              greater the induced voltage.
            </p>

            <div className="glass rounded-xl p-4 mb-6">
              <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400 mb-2">
                ε = NABω sin(ωt)
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                N = number of turns, A = area, B = magnetic field, ω = angular velocity
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Speed (RPM)</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={generatorSpeed}
                  onChange={(e) => setGeneratorSpeed(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">{generatorSpeed} RPM</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Turns</label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={turns}
                  onChange={(e) => setTurns(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">{turns} turns</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Field (T)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={fieldStrength}
                  onChange={(e) => setFieldStrength(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">{fieldStrength} T</p>
              </div>
            </div>

            {/* Generator Diagram */}
            <div className="flex justify-center items-center py-8 mb-6">
              <svg width="350" height="350" viewBox="0 0 350 350" className="w-full max-w-sm">
                {/* Magnetic field */}
                <rect x="50" y="50" width="250" height="250" fill="rgba(59, 130, 246, 0.1)" />
                {[...Array(6)].map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1={75 + i * 40}
                    x2="300"
                    y2={75 + i * 40}
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                ))}
                {/* Rotating coil */}
                <g transform={`rotate(${generatorSpeed * 6} 175 175)`}>
                  <rect x="150" y="100" width="50" height="150" fill="none" stroke="rgb(34, 197, 94)" strokeWidth="3" />
                  {[...Array(3)].map((_, i) => (
                    <line
                      key={i}
                      x1="150"
                      y1={120 + i * 30}
                      x2="200"
                      y2={120 + i * 30}
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="2"
                    />
                  ))}
                </g>
                <circle cx="175" cy="175" r="5" fill="rgb(34, 197, 94)" />
              </svg>
            </div>

            {/* Graph */}
            <div className="h-64">
              <Line data={generatorChartData} options={fluxChartOptions} />
            </div>

            {/* Example Problem */}
            <div className="glass rounded-xl p-4 mt-6">
              <h4 className="font-semibold mb-2">Example Problem:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                Calculate the peak EMF for a generator with {turns} turns, area 0.1 m², field{' '}
                {fieldStrength} T, rotating at {generatorSpeed} RPM.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Solution:</strong> ω = {((generatorSpeed * 2 * Math.PI) / 60).toFixed(2)} rad/s
                <br />
                ε<sub>peak</sub> = NABω = {turns} × 0.1 × {fieldStrength} ×{' '}
                {((generatorSpeed * 2 * Math.PI) / 60).toFixed(2)} ={' '}
                {(turns * 0.1 * fieldStrength * ((generatorSpeed * 2 * Math.PI) / 60)).toFixed(2)} V
              </p>
            </div>
          </PhysicsCard>
        </section>

        {/* Application 2: Transformer */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Application 2: Transformer
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Changing current in the primary coil induces voltage in the secondary coil. The voltage ratio
              equals the turns ratio.
            </p>

            <div className="glass rounded-xl p-4 mb-6">
              <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400 mb-2">
                V₁/V₂ = N₁/N₂
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Voltage ratio equals turns ratio (for ideal transformer)
              </p>
            </div>

            {/* Transformer Diagram */}
            <div className="flex justify-center items-center py-8 mb-6">
              <svg width="400" height="300" viewBox="0 0 400 300" className="w-full max-w-md">
                {/* Primary coil */}
                <rect x="50" y="50" width="30" height="200" fill="none" stroke="rgb(59, 130, 246)" strokeWidth="4" />
                {[...Array(8)].map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1={70 + i * 25}
                    x2="80"
                    y2={70 + i * 25}
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />
                ))}
                <text x="65" y="30" textAnchor="middle" fill="rgb(59, 130, 246)" fontSize="14" fontWeight="bold">
                  Primary (N₁ = {primaryTurns})
                </text>
                <text x="65" y="270" textAnchor="middle" fill="rgb(59, 130, 246)" fontSize="12">
                  {inputVoltage}V AC
                </text>

                {/* Core */}
                <rect x="80" y="100" width="240" height="100" fill="rgb(120, 113, 108)" opacity="0.3" />
                <rect x="80" y="100" width="240" height="100" fill="none" stroke="rgb(120, 113, 108)" strokeWidth="2" />

                {/* Secondary coil */}
                <rect x="320" y="50" width="30" height="200" fill="none" stroke="rgb(236, 72, 153)" strokeWidth="4" />
                {[...Array(16)].map((_, i) => (
                  <line
                    key={i}
                    x1="320"
                    y1={60 + i * 12.5}
                    x2="350"
                    y2={60 + i * 12.5}
                    stroke="rgb(236, 72, 153)"
                    strokeWidth="2"
                  />
                ))}
                <text x="335" y="30" textAnchor="middle" fill="rgb(236, 72, 153)" fontSize="14" fontWeight="bold">
                  Secondary (N₂ = {secondaryTurns})
                </text>
                <text x="335" y="270" textAnchor="middle" fill="rgb(236, 72, 153)" fontSize="12">
                  {outputVoltage.toFixed(0)}V AC
                </text>

                {/* Flux lines */}
                {[...Array(5)].map((_, i) => {
                  const y = 110 + i * 20
                  return (
                    <path
                      key={i}
                      d={`M 80 ${y} Q 200 ${y - 10} 320 ${y}`}
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.5"
                      strokeDasharray="5,5"
                    />
                  )
                })}
              </svg>
            </div>

            {/* Example Problem */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-semibold mb-2">Example Problem:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                A transformer has {primaryTurns} turns in the primary and {secondaryTurns} turns in the
                secondary. If the input voltage is {inputVoltage}V, what is the output voltage?
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Solution:</strong> V₂ = V₁ × (N₂/N₁) = {inputVoltage} × ({secondaryTurns}/{primaryTurns}) ={' '}
                {outputVoltage.toFixed(0)}V
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>Note:</strong> AC frequency and phase are preserved. The transformer only changes
                voltage amplitude, not frequency.
              </p>
            </div>
          </PhysicsCard>
        </section>

        {/* Application 3: Induction Heating */}
        <section className="mb-16">
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Application 3: Induction Cooktop / Induction Heating
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Alternating magnetic field induces eddy currents in the pan, which dissipate power as heat
              (P ∝ I²R). Higher frequency increases heating efficiency.
            </p>

            <div className="glass rounded-xl p-4 mb-6">
              <p className="text-2xl font-mono text-center text-primary-600 dark:text-primary-400 mb-2">
                P ∝ I²R ∝ f²
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Power dissipation increases with frequency squared
              </p>
            </div>

            {/* Diagram */}
            <div className="flex justify-center items-center py-8 mb-6">
              <svg width="400" height="250" viewBox="0 0 400 250" className="w-full max-w-md">
                {/* Coil */}
                <ellipse cx="200" cy="100" rx="120" ry="40" fill="none" stroke="rgb(59, 130, 246)" strokeWidth="4" />
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 2 * Math.PI) / 12
                  const x1 = 200 + 120 * Math.cos(angle)
                  const y1 = 100 + 40 * Math.sin(angle)
                  const x2 = 200 + 100 * Math.cos(angle)
                  const y2 = 100 + 30 * Math.sin(angle)
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                    />
                  )
                })}
                <text x="200" y="60" textAnchor="middle" fill="rgb(59, 130, 246)" fontSize="14" fontWeight="bold">
                  AC Coil
                </text>

                {/* Pan */}
                <rect x="100" y="150" width="200" height="20" fill="rgb(120, 113, 108)" rx="5" />
                <text x="200" y="195" textAnchor="middle" fill="rgb(120, 113, 108)" fontSize="14" fontWeight="bold">
                  Metal Pan
                </text>

                {/* Eddy currents */}
                {[...Array(4)].map((_, i) => {
                  const cx = 120 + i * 50
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy="160"
                      r="15"
                      fill="none"
                      stroke="rgb(239, 68, 68)"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                    />
                  )
                })}
                <text x="200" y="145" textAnchor="middle" fill="rgb(239, 68, 68)" fontSize="12">
                  Eddy Currents
                </text>

                {/* Heat waves */}
                {[...Array(3)].map((_, i) => (
                  <path
                    key={i}
                    d={`M ${150 + i * 50} 170 Q ${150 + i * 50} ${160 - i * 5} ${150 + i * 50} 150`}
                    stroke="rgb(239, 68, 68)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.6"
                  />
                ))}
              </svg>
            </div>

            {/* Graph */}
            <div className="h-64 mb-6">
              <Line
                data={heatingChartData}
                options={{
                  ...fluxChartOptions,
                  plugins: { ...fluxChartOptions.plugins, title: { display: true, text: 'Heating Power vs Frequency' } },
                }}
              />
            </div>

            {/* Example */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-semibold mb-2">Example:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Doubling the frequency from 60 Hz to 120 Hz increases heating power by a factor of 4 (since
                P ∝ f²). This is why induction cooktops use high-frequency AC (typically 20-50 kHz) for
                efficient heating.
              </p>
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
                  <li>Magnetic Flux: φ = B · A · cos(θ)</li>
                  <li>Faraday's Law: ε = -dφ/dt</li>
                  <li>Generator EMF: ε = NABω sin(ωt)</li>
                  <li>Transformer Ratio: V₁/V₂ = N₁/N₂</li>
                  <li>Induction Heating: P ∝ I²R ∝ f²</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Changing magnetic flux induces EMF in conductors</li>
                  <li>Lenz's Law ensures energy conservation</li>
                  <li>Generators convert mechanical energy to electrical energy</li>
                  <li>Transformers change voltage while preserving frequency</li>
                  <li>Induction heating uses eddy currents for efficient cooking</li>
                </ul>
              </div>
            </div>
          </PhysicsCard>
        </section>

        {/* Exam Questions */}
        <section>
          <PhysicsCard>
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-600 dark:text-primary-400">
              Practice Questions
            </h2>
            <div className="space-y-6">
              <div className="glass rounded-xl p-4">
                <h4 className="font-semibold mb-2">Q1: A coil of 200 turns has an area of 0.05 m². If the magnetic field changes from 0.5 T to 0 T in 0.1 s, what is the induced EMF?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Hint: Use ε = -N(dφ/dt)</p>
              </div>
              <div className="glass rounded-xl p-4">
                <h4 className="font-semibold mb-2">Q2: Explain why a transformer cannot work with DC current.</h4>
              </div>
              <div className="glass rounded-xl p-4">
                <h4 className="font-semibold mb-2">Q3: Why do induction cooktops require ferromagnetic cookware?</h4>
              </div>
            </div>
          </PhysicsCard>
        </section>
      </div>
    </div>
  )
}

