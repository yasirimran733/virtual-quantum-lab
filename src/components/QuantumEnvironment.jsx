import { useCallback, useEffect, useMemo, useRef } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { useTheme } from '../context/ThemeContext'

const ATOM_COUNT = 6

const generateAtoms = () =>
  Array.from({ length: ATOM_COUNT }).map((_, index) => ({
    id: `atom-${index}`,
    size: 120 + Math.random() * 80,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 10 + Math.random() * 8,
  }))

export const QuantumEnvironment = () => {
  const { theme } = useTheme()
  const parallaxRef = useRef(null)
  const atoms = useMemo(() => generateAtoms(), [])
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  const particleOptions = useMemo(
    () => ({
      fpsLimit: 60,
      detectRetina: true,
      fullScreen: false,
      background: {
        color: { value: 'transparent' },
      },
      particles: {
        number: {
          value: 120,
          limit: 150,
          density: {
            enable: true,
            area: 900,
          },
        },
        color: {
          value: theme === 'dark' ? '#A5B4FC' : '#312E81',
        },
        opacity: {
          value: { min: 0.15, max: 0.45 },
        },
        size: {
          value: { min: 1, max: 3.5 },
        },
        move: {
          enable: true,
          speed: { min: 0.3, max: 1 },
          direction: 'none',
          straight: false,
          outModes: {
            default: 'out',
          },
        },
        links: {
          enable: true,
          distance: 110,
          color: theme === 'dark' ? '#C084FC' : '#4C1D95',
          opacity: 0.15,
          width: 1,
        },
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          resize: true,
        },
      },
    }),
    [theme]
  )

  useEffect(() => {
    const handlePointer = (event) => {
      if (!parallaxRef.current) return
      const { innerWidth, innerHeight } = window
      const rotateX = ((event.clientY / innerHeight) - 0.5) * -6
      const rotateY = ((event.clientX / innerWidth) - 0.5) * 6
      parallaxRef.current.style.setProperty('--parallax-rotate-x', `${rotateX}deg`)
      parallaxRef.current.style.setProperty('--parallax-rotate-y', `${rotateY}deg`)
    }

    window.addEventListener('pointermove', handlePointer)
    return () => window.removeEventListener('pointermove', handlePointer)
  }, [])

  return (
    <div className="quantum-environment pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div ref={parallaxRef} className="quantum-parallax-layer">
        <div className="quantum-gradient-layer quantum-gradient-layer--primary" />
        <div className="quantum-gradient-layer quantum-gradient-layer--secondary" />
      </div>

      <Particles
        id="quantum-particles"
        init={particlesInit}
        options={particleOptions}
        className="quantum-particles"
      />

      <div className="quantum-atoms">
        {atoms.map((atom) => (
          <div
            key={atom.id}
            className="quantum-atom"
            style={{
              width: atom.size,
              height: atom.size,
              left: `${atom.x}%`,
              top: `${atom.y}%`,
              animationDelay: `${atom.delay}s`,
              animationDuration: `${atom.duration}s`,
            }}
          >
            <div className="quantum-atom-core" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuantumEnvironment

