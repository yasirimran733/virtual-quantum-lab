import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Physics Chart Component
 * Simple canvas-based chart for real-time physics data visualization
 * 
 * TODO: Replace with Chart.js for more advanced features
 */
export const PhysicsChart = ({
  data = [],
  label = 'Data',
  color = '#3b82f6',
  xLabel = 'Time (s)',
  yLabel = 'Value',
  width = 400,
  height = 200,
  className = '',
}) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext('2d')
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Find min/max values
    const xValues = data.map((d) => d.x)
    const yValues = data.map((d) => d.y)
    const minX = Math.min(...xValues, 0)
    const maxX = Math.max(...xValues, 1)
    const minY = Math.min(...yValues, 0)
    const maxY = Math.max(...yValues, 1)

    const xScale = chartWidth / (maxX - minX || 1)
    const yScale = chartHeight / (maxY - minY || 1)

    // Draw axes
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw grid
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw data line
    if (data.length > 1) {
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      data.forEach((point, index) => {
        const x = padding + (point.x - minX) * xScale
        const y = height - padding - (point.y - minY) * yScale
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
    }

    // Draw data points
    ctx.fillStyle = color
    data.forEach((point) => {
      const x = padding + (point.x - minX) * xScale
      const y = height - padding - (point.y - minY) * yScale
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = '#64748b'
    ctx.font = '12px Inter'
    ctx.textAlign = 'center'
    ctx.fillText(xLabel, width / 2, height - 10)
    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(yLabel, 0, 0)
    ctx.restore()
  }, [data, width, height, color, xLabel, yLabel])

  return (
    <div className={`glass rounded-xl p-4 ${className}`}>
      <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        {label}
      </h3>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full"
      />
    </div>
  )
}

export default PhysicsChart

