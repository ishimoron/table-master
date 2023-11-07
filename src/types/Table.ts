export interface TableColumn {
  id: string;
  ordinalNumber: number;
  title: string;
  type: string;
  width?: number;
}

export interface TableRow {
  id: string;
  [columnId: string]: any;
  isExpanded?: boolean;
}

export interface TableData {
  columns: TableColumn[];
  data: TableRow[];
}

export interface HiddenColumns {
  [columnId: string]: boolean;
}
