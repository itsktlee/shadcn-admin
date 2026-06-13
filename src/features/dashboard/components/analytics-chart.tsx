import { useEffect, useRef, useState } from 'react'
import { Area, AreaChart, XAxis, YAxis } from 'recharts'

const axisColor = 'var(--muted-foreground)'
const primarySeriesColor = 'var(--chart-1)'
const secondarySeriesColor = 'var(--chart-2)'

const data = [
  {
    name: 'Mon',
    clicks: 420,
    uniques: 310,
  },
  {
    name: 'Tue',
    clicks: 560,
    uniques: 360,
  },
  {
    name: 'Wed',
    clicks: 610,
    uniques: 410,
  },
  {
    name: 'Thu',
    clicks: 530,
    uniques: 390,
  },
  {
    name: 'Fri',
    clicks: 690,
    uniques: 470,
  },
  {
    name: 'Sat',
    clicks: 720,
    uniques: 520,
  },
  {
    name: 'Sun',
    clicks: 640,
    uniques: 450,
  },
]

export function AnalyticsChart() {
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
      style={{ height: '300px' }}
    >
      {dimensions.width > 0 && dimensions.height > 0 ? (
        <AreaChart
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
            stroke={axisColor}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Area
            type='monotone'
            dataKey='clicks'
            stroke={primarySeriesColor}
            fill={primarySeriesColor}
            fillOpacity={0.15}
          />
          <Area
            type='monotone'
            dataKey='uniques'
            stroke={secondarySeriesColor}
            fill={secondarySeriesColor}
            fillOpacity={0.1}
          />
        </AreaChart>
      ) : null}
    </div>
  )
}
