import { ColumnDef } from "@tanstack/react-table";
import { DataProps } from "~/libs/types";

export type TableProps = {
  data: DataProps;
  columns: ColumnDef<{ [key: string]: string | undefined }, any>[];
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
