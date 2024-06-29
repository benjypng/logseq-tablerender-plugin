import { ColumnProps, DataProps } from "~/libs/types";

export interface TableProps {
  data: DataProps;
  columns: ColumnProps;
}

export interface result {
  description: string;
  value: number;
}

export interface SummaryProps {
  results: {
    average?: result;
    sum?: result;
    median?: result;
    mode?: result;
    variance?: result;
    sd?: result;
    ssd?: result;
    percentile?: result;
  };
}
