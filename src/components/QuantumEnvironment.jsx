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
    duration: 12 + Math.random() * 8,
    depth: (Math.random() - 0.5) * 120,
  }))

export const QuantumEnvironment = () => {
  const { theme } = useTheme()
  const parallaxRef = useRef(null)
  const pointerTarget = useRef({ x: 0, y: 0 })
  const pointerCurrent = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
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
          value: 140,
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
          value: { min: 0.1, max: 0.35 },
        },
        size: {
          value: { min: 1, max: 3.2 },
        },
        move: {
          enable: true,
          speed: { min: 0.2, max: 0.8 },
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
    const updateParallax = () => {
      pointerCurrent.current.x += (pointerTarget.current.x - pointerCurrent.current.x) * 0.075
      pointerCurrent.current.y += (pointerTarget.current.y - pointerCurrent.current.y) * 0.075

      if (parallaxRef.current) {
        const rotateX = pointerCurrent.current.y * -10
        const rotateY = pointerCurrent.current.x * 10
        const translateX = pointerCurrent.current.x * 24
        const translateY = pointerCurrent.current.y * 24

        parallaxRef.current.style.setProperty('--parallax-rotate-x', `${rotateX}deg`)
        parallaxRef.current.style.setProperty('--parallax-rotate-y', `${rotateY}deg`)
        parallaxRef.current.style.setProperty('--parallax-translate-x', `${translateX}px`)
        parallaxRef.current.style.setProperty('--parallax-translate-y', `${translateY}px`)
      }

      rafRef.current = requestAnimationFrame(updateParallax)
    }

    const handlePointer = (event) => {
      pointerTarget.current = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      }
    }

    window.addEventListener('pointermove', handlePointer)
    rafRef.current = requestAnimationFrame(updateParallax)

    return () => {
      window.removeEventListener('pointermove', handlePointer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="quantum-environment pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div ref={parallaxRef} className="quantum-parallax">
        <div className="quantum-parallax-layer quantum-parallax-layer--gradient" />
        <div className="quantum-parallax-layer quantum-parallax-layer--grid" />
        <div className="quantum-parallax-layer quantum-parallax-layer--glow" />
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
              transform: `translateZ(${atom.depth}px)`,
            }}
          >
            <div className="quantum-atom-core" />
            <div className="quantum-atom-shell" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuantumEnvironment

