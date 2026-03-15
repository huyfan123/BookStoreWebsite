import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  pageSize?: number;
}

const DataTable: React.FC<DataTableProps> = ({
  rows,
  columns,
  pageSize = 10,
}) => {
  return (
    <DataGrid rows={rows} columns={columns} pageSize={pageSize} autoHeight />
  );
};

export default DataTable;
