import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Simulations } from './pages/Simulations'
import { ExperimentBuilder } from './pages/ExperimentBuilder'
import { Learn } from './pages/Learn'
import { About } from './pages/About'
import ProjectileMotion from './pages/demos/ProjectileMotion'
import Pendulum from './pages/demos/Pendulum'
import Collisions from './pages/demos/Collisions'
import ElectricField from './pages/demos/ElectricField'
import ElectricFieldEnhanced from './pages/demos/ElectricFieldEnhanced'
import MagneticField from './pages/demos/MagneticField'
import WaveInterference from './pages/demos/WaveInterference'
import ReflectionRefraction from './pages/demos/ReflectionRefraction'
import Diffraction from './pages/demos/Diffraction'
import QuantumMechanics from './pages/demos/QuantumMechanics'
import Relativity from './pages/demos/Relativity'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/simulations/projectile-motion" element={<ProjectileMotion />} />
            <Route path="/simulations/pendulum" element={<Pendulum />} />
            <Route path="/simulations/collisions" element={<Collisions />} />
            <Route path="/simulations/electric-field" element={<ElectricFieldEnhanced />} />
            <Route path="/simulations/magnetic-field" element={<MagneticField />} />
            <Route path="/simulations/wave-interference" element={<WaveInterference />} />
            <Route path="/simulations/reflection-refraction" element={<ReflectionRefraction />} />
            <Route path="/simulations/diffraction" element={<Diffraction />} />
            <Route path="/simulations/quantum-mechanics" element={<QuantumMechanics />} />
            <Route path="/simulations/relativity" element={<Relativity />} />
            <Route path="/builder" element={<ExperimentBuilder />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

