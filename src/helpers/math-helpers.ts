import stats from "stats-lite";

import { DataProps } from "~/libs/types";

export const getSum = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.sum(valuesToSum);
};

export const getAverage = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.mean(valuesToSum);
};

export const getMedian = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.median(valuesToSum);
};

export const getMode = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.mode(valuesToSum);
};

export const getVariance = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.variance(valuesToSum);
};

export const getSD = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.stdev(valuesToSum);
};

export const getSampleSD = (col: string, data: DataProps): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.sampleStdev(valuesToSum);
};

export const getPercentile = (
  col: string,
  data: DataProps,
  percentile: number,
): number => {
  const valuesToSum = data.map((d) => parseFloat(d[`col${col}`]!));
  return stats.percentile(valuesToSum, percentile / 100); // Percentile is in whole numbers
};
