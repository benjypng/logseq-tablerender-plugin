import { CalculationTypes, MathTypeProps, ParamsProps } from "./types";

export const checkParams = (content: string): ParamsProps[] => {
  const rxToCheck: { [key in MathTypeProps]: RegExp } = {
    sumCol: /(sum)(-)(\d+)/,
    averageCol: /(average)(-)(\d+)/,
    medianCol: /(median)(-)(\d+)/,
    modeCol: /(mode)(-)(\d+)/,
    varianceCol: /(variance)(-)(\d+)/,
    sdCol: /(sd)(-)(\d+)/,
    ssdCol: /(ssd)(-)(\d+)/,
    percentileCol: /^(percentile)(-)(\d+)(-)(\d+)$/,
  };

  const paramsArr = content.split(" ");
  const results = [];

  for (const param of paramsArr) {
    for (const rx of Object.keys(rxToCheck)) {
      const match = rxToCheck[rx as MathTypeProps].exec(param);
      if (!match) continue;
      const type = match[1] as CalculationTypes;

      if (param.startsWith("percentile") && match[2] && match[4]) {
        results.push({
          type,
          percentileCol: match[3],
          percent: match[5],
        });
      } else {
        if (match[1] && match[3]) {
          results.push({
            type,
            [match[1] + "Col"]: match[3],
          });
        }
      }
    }
  }

  return results;
};
