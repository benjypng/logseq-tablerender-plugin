import { ColumnProps, DataProps } from "~/libs/types";

export type TableProps = {
  data: DataProps;
  columns: ColumnProps;
};

export type result = {
  description: string;
  value: number;
};
export type SummaryProps = {
  results: {
    average?: result;
    sum?: result;
    median?: result;
    mode?: result;
  };
};
