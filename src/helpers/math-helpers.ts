import { ReactElement } from 'react'
import stats from 'stats-lite'

import { DataProps } from '../libs/types'

const extractNumber = (obj: ReactElement | undefined) => {
  if (!obj) return obj

  const html = obj.props.dangerouslySetInnerHTML.__html
  if (!html) return obj

  const match = html.match(/-?\d+(\.\d+)?/)
  return match ? parseFloat(match[0]) : obj
}

export const getSum = (col: string, data: DataProps[]): number => {
  const values = data.map((d) => {
    return extractNumber(d[`col${col}`])
  })
  return stats.sum(values)
}

export const getAverage = (col: string, data: DataProps[]): number => {
  const values = data.map((d) => {
    return extractNumber(d[`col${col}`])
  })
  return stats.mean(values)
}

export const getMedian = (col: string, data: DataProps[]): number => {
  const values = data.map((d) => {
    return extractNumber(d[`col${col}`])
  })
  return stats.median(values)
}

export const getMode = (col: string, data: DataProps[]): number => {
  const values = data.map((d) => {
    return extractNumber(d[`col${col}`])
  })
  const mode = stats.mode(values)
  // Return 0 if there is no frequent number
  if (Array.isArray(mode)) return 0
  return stats.mode(values)
}

export const getVariance = (col: string, data: DataProps[]): number => {
  const values = data.map((d) => {
    return extractNumber(d[`col${col}`])
  })
  return stats.variance(values)
}

export const getSD = (col: string, data: DataProps[]): number => {
  const values = data.map((d) => {
    return extractNumber(d[`col${col}`])
  })
  return stats.stdev(values)
}

export const getSampleSD = (col: string, data: DataProps[]): number => {
  const values = data.map((d) => {
    return extractNumber(d[`col${col}`])
  })
  return stats.sampleStdev(values)
}

export const getPercentile = (
  col: string,
  data: DataProps[],
  percentile: number,
): number => {
  const values = data.map((d) => {
    return extractNumber(d[`col${col}`])
  })
  return stats.percentile(values, percentile / 100) // Percentile is in whole numbers
}
