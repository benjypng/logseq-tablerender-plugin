import { ParamsProps } from "./types";

export const checkParams = (content: string): ParamsProps => {
  let rxToCheck: { [key: string]: RegExp | string | null } = {
    sumCol: /sum\-(.*?)(\d+)/,
    averageCol: /average\-(.*?)(\d+)/,
    medianCol: /median\-(.*?)(\d+)/,
    modeCol: /mode\-(.*?)(\d+)/,
    varianceCol: /variance\-(.*?)(\d+)/,
    sdCol: /sd\-(.*?)(\d+)/,
    ssdCol: /ssd\-(.*?)(\d+)/,
    percentileCol: /percentile\-(.*?)(\d+)/,
    percentilePercent: /percentile\-(\d+)(.*?)(\d+)/,
  };

  for (const rx of Object.keys(rxToCheck)) {
    const newVal = (rxToCheck[rx] as RegExp).exec(content);
    if (newVal && newVal[2]) {
      if (newVal[3]) {
        rxToCheck[rx] = newVal[3];
      } else {
        rxToCheck[rx] = newVal[2];
      }
    } else {
      delete rxToCheck[rx];
    }
  }

  return rxToCheck;
};
