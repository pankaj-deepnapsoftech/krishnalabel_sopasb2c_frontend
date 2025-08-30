import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';

interface DetailGridProps {
  data: any[];
}

const DetailGrid: React.FC<DetailGridProps> = ({ data }) => {
  const columnDefs = useMemo<ColDef[]>(() => [
    { headerName: 'File Name', field: 'name' },
    { headerName: 'Type', field: 'type' },
    { headerName: 'Size', field: 'size' },
    { headerName: 'Created Date', field: 'created' },
    { headerName: 'Modified Date', field: 'modified' },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    resizable: true,
  }), []);

  return (
    <div style={{ height: '100%', width: '100%' }} className="ag-theme-alpine">
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default DetailGrid;
