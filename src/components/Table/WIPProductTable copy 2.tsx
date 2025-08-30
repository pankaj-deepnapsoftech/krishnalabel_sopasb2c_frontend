import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register the necessary AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule, TreeDataModule]);

// Dummy Data
const getData = () => [
  {
    id: 1,
    name: 'Parent 1',
    type: 'Folder',
    size: '100 MB',
    created: '2023-01-01',
    modified: '2023-02-01',
    children: [
      { id: 101, name: 'Child 1', type: 'File', size: '20 MB', created: '2023-01-05', modified: '2023-01-10' },
      { id: 102, name: 'Child 2', type: 'File', size: '30 MB', created: '2023-01-07', modified: '2023-01-12' },
    ],
  },
  {
    id: 2,
    name: 'Parent 2',
    type: 'Folder',
    size: '200 MB',
    created: '2023-02-01',
    modified: '2023-03-01',
    children: [
      { id: 201, name: 'Child A', type: 'File', size: '50 MB', created: '2023-02-05', modified: '2023-02-10' },
      { id: 202, name: 'Child B', type: 'File', size: '70 MB', created: '2023-02-07', modified: '2023-02-12' },
    ],
  },
];

interface FileNode {
  id: number;
  name: string;
  type: string;
  size: string;
  created: string;
  modified: string;
  children?: FileNode[];
}

const WIPProductTable: React.FC = () => {
  const [rowData] = useState<FileNode[]>(getData());

  // Column Definitions for Parent Grid
  const columnDefs = useMemo<ColDef[]>(() => [
    { headerName: 'File Name', field: 'name' },
    { headerName: 'Type', field: 'type' },
    { headerName: 'Size', field: 'size' },
    { headerName: 'Created Date', field: 'created' },
    { headerName: 'Modified Date', field: 'modified' },
  ], []);

  // Default Column Definition for all columns
  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    resizable: true,
  }), []);

  // Auto Group Column Definition for grouping in the Tree
  const autoGroupColumnDef = useMemo<ColDef>(() => ({
    headerName: 'Name',
    field: 'name',
    cellRendererParams: { suppressCount: true },
  }), []);

  // Detail Grid Options for Master/Detail feature
  const detailCellRendererParams = {
    detailGridOptions: {
      columnDefs, // Reuse the column definitions from the parent grid
      defaultColDef,
    },
    getDetailRowData: (params: any) => {
      params.successCallback(params.data.children);
    },
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
      {/* Custom Header outside AG Grid */}
      <AgGridReact<FileNode>
        rowData={rowData}
        columnDefs={columnDefs} // Columns with headers inside the grid
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        treeData={true}
        treeDataChildrenField="children"
        rowHeight={40}
        headerHeight={40} // This controls the height of the header row inside AG Grid
        className="ag-theme-alpine"
        masterDetail={true} // Enable Master/Detail functionality
        detailCellRendererParams={detailCellRendererParams}
        rowNumbers={true}
      />
    </div>
  );
};

export default WIPProductTable;
