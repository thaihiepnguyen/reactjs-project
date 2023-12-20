export interface Row {
  id: number,
  fullname: string
}

export interface ColumnsResponse {
  rows: Row[],
  columns: string[],
  fileName: string
}