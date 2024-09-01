import { ColumnDef } from '@tanstack/react-table'

export type DataProps = Record<string, JSX.Element>

export type ColumnProps = ColumnDef<Record<string, JSX.Element>>

export interface MathProps {
  sumCol: string
  data: DataProps
}

export type MathTypeProps =
  | 'sumCol'
  | 'averageCol'
  | 'medianCol'
  | 'modeCol'
  | 'varianceCol'
  | 'sdCol'
  | 'ssdCol'
  | 'percentileCol'

export type CalculationTypes =
  | 'sum'
  | 'average'
  | 'median'
  | 'mode'
  | 'variance'
  | 'sd'
  | 'ssd'
  | 'percentile'

type MathTypeMapping = {
  [key in MathTypeProps]?: string
}

export type ParamsProps = {
  type: CalculationTypes
} & MathTypeMapping

export interface MathResults {
  description: string
  type: CalculationTypes
  value: number
}
