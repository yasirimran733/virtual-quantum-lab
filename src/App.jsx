import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Simulations } from './pages/Simulations'
import { ExperimentBuilder } from './pages/ExperimentBuilder'
import { Learn } from './pages/Learn'
import { About } from './pages/About'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulations" element={<Simulations />} />
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

