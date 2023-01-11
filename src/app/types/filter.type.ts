export enum FilterType {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR',
  ALL = 'ALL',
}

export interface Filter {
  label: string;
  filter: FilterType;
}
