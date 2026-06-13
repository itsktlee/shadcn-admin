import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

const axisColor = 'var(--muted-foreground)'
const barColor = 'var(--chart-1)'

const data = [
  {
    name: 'Jan',
    total: 1800,
  },
  {
    name: 'Feb',
    total: 2200,
  },
  {
    name: 'Mar',
    total: 3100,
  },
  {
    name: 'Apr',
    total: 2800,
  },
  {
    name: 'May',
    total: 3900,
  },
  {
    name: 'Jun',
    total: 4300,
  },
  {
    name: 'Jul',
    total: 4700,
  },
  {
    name: 'Aug',
    total: 4200,
  },
  {
    name: 'Sep',
    total: 5100,
  },
  {
    name: 'Oct',
    total: 5600,
  },
  {
    name: 'Nov',
    total: 4900,
  },
  {
    name: 'Dec',
    total: 6100,
  },
]

export function Overview() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const measure = () => {
      const element = containerRef.current

      if (!element) {
        return
      }

      const nextWidth = Math.round(element.getBoundingClientRect().width)
      const nextHeight = Math.round(element.getBoundingClientRect().height)

      setDimensions((prev) => {
        if (prev.width === nextWidth && prev.height === nextHeight) {
          return prev
        }

        return {
          width: nextWidth,
          height: nextHeight,
        }
      })
    }

    const frame = window.requestAnimationFrame(measure)
    window.addEventListener('resize', measure)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className='min-w-0 w-full'
      style={{ height: '350px' }}
    >
      {dimensions.width > 0 && dimensions.height > 0 ? (
        <BarChart
          width={dimensions.width}
          height={dimensions.height}
          data={data}
        >
          <XAxis
            dataKey='name'
            stroke={axisColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            direction='ltr'
            stroke={axisColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar dataKey='total' fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : null}
    </div>
  )
}
