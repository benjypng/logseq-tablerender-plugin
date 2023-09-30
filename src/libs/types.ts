export type DataProps = { [key: string]: string | undefined }[];

export type ColumnProps = {
  header?: string;
  accessorKey?: string;
  cell?: Function;
}[];

export type MathProps = {
  sumCol: string;
  data: DataProps;
};

export type ParamsProps = {
  sumCol?: string | number;
  averageCol?: string | number;
  medianCol?: string | number;
  modeCol?: string | number;
};
