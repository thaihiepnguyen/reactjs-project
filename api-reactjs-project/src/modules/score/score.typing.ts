export interface Row {
  id: number;
  fullname: string;
}

export interface ColumnsResponse {
  rows: Row[];
  columns: string[];
  scales: number[];
  fileName: string;
  grade: any;
  scores: any;
}
