export enum EAPI {
  token = 'token',
}

export interface TableHeaderLabel {
  name: string;
  label: string;
  sortable: boolean;
  align?: 'center'
  | 'inherit'
  | 'justify'
  | 'left'
  | 'right'
}

export interface SortItem {
  sortedField: string;
  isDescending: boolean;
}