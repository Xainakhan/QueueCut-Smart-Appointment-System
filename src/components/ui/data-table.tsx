import type { ReactNode } from "react";

export type DataTableColumn<T> = { key: string; header: string; cell: (row: T) => ReactNode; mobileLabel?: string };
type DataTableProps<T> = { caption: string; columns: DataTableColumn<T>[]; rows: T[]; getRowKey: (row: T) => string; empty: ReactNode };

export function DataTable<T>({ caption, columns, rows, getRowKey, empty }: DataTableProps<T>) {
  if (!rows.length) return <>{empty}</>;
  return <div className="data-table-wrap" tabIndex={0}>
    <table className="data-table"><caption className="sr-only">{caption}</caption><thead><tr>{columns.map(column => <th key={column.key} scope="col">{column.header}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={getRowKey(row)}>{columns.map(column => <td key={column.key} data-label={column.mobileLabel ?? column.header}>{column.cell(row)}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}
