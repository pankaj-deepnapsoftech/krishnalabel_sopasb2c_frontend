import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Loading from "../../ui/Loading";
import { FcDatabase } from "react-icons/fc";

// Register AG Grid Modules
ModuleRegistry.registerModules([ClientSideRowModelModule, TreeDataModule]);

interface FileNode {
  bom: any;
  process: any;
  goods: any;
  category: any;
  sub_category: any;
  estimated_quantity: any;
  used_quantity: any;
  uom: any;
  modified: any;
  process_start: any;
  process_done: any;
  created: any;
  children?: FileNode[];
}

interface WIPProductTableProps {
  products: Array<any>;
  isLoadingProducts: boolean;
}

const WIPProductTable: React.FC<WIPProductTableProps> = ({ products, isLoadingProducts }) => {
  // const [rowData] = useState<FileNode[]>(products);
  const rowData = products;
  const columnDefs = useMemo<ColDef[]>(() => [
    { headerName: 'Process', field: 'process'},
    { headerName: 'Material', field: 'goods' },
    { headerName: 'Category', field: 'category' },
    { headerName: 'Sub Category', field: 'sub_category' },
    { headerName: 'Estimated Qty', field: 'estimated_quantity' },
    { headerName: 'Used Qty', field: 'used_quantity' },
    { headerName: 'UOM', field: 'uom' },
    { headerName: 'Process Start', field: 'process_start' },
    { headerName: 'Process Complete', field: 'process_done' },
    { headerName: 'Created Date', field: 'created' },
    { headerName: 'Modified Date', field: 'modified' },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    resizable: true,
    sortable: true,
    minWidth: 140,
  }), []);

  const autoGroupColumnDef = useMemo<ColDef>(() => ({
    headerName: 'BOM',
    field: 'bom',
    width: 250,
    filter: true, 
    floatingFilter: true,
    cellRendererParams: { suppressCount: true },
  }), []);

  // const onGridReady = (params: any) => {
  //   // Timeout to ensure DOM is ready
  //   setTimeout(() => {
  //     const allColumnIds: string[] = [];
  //     // params.columnApi.getAllColumns().forEach((column: any) => {
  //     //   allColumnIds.push(column.getId());
  //     // });
  //     params.columnApi.autoSizeColumns(allColumnIds, false);
  //   }, 100);
  // };

  return (
    <>
        {/* {isLoadingProducts && <Loading />}
        {products.length === 0 && !isLoadingProducts && (
          <div className="mx-auto w-max">
            <FcDatabase size={100} />
            <p className="text-lg">No Data Found</p>
          </div>
        )}
        {!isLoadingProducts && products.length > 0 && ( */}
          {isLoadingProducts ? (
        <Loading />
      ) : products.length === 0 ? (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
          <AgGridReact<FileNode>
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            treeData={true}
            treeDataChildrenField="children"
            autoGroupColumnDef={autoGroupColumnDef}
            rowHeight={40}
            headerHeight={40}
            // onGridReady={onGridReady}
          />
        </div>
      )}
        {/* )} */}
    </>
  );
};

export default WIPProductTable;
