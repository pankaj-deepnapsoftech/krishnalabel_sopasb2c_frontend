// @ts-nocheck

import {
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
import { FcApproval, FcDatabase } from "react-icons/fc";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import {
  usePagination,
  useSortBy,
  useTable,
  Column,
  TableInstance,
  HeaderGroup,
  Row,
  Cell,
} from "react-table";
import Loading from "../../ui/Loading";
import { MainColor } from "../../constants/constants";
import { useCookies } from "react-cookie";
interface ProductTableProps {
  products: Array<{
    name: string;
    product_id: string;
    uom: string;
    category: string;
    sub_category?: string;
    item_type: string;
    product_or_service: string;
    current_stock: number;
    price: number;
    min_stock?: number;
    max_stock?: number;
    hsn_code?: number;
    inventory_category?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  isLoadingProducts: boolean;
  openUpdateProductDrawerHandler?: (id: string) => void;
  openProductDetailsDrawerHandler?: (id: string) => void;
  deleteProductHandler?: (id: string) => void;
  approveProductHandler?: (id: string) => void;
  deletebulkProductHandler?: (id: any) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  pageSize,
  setPageSize,
  isLoadingProducts,
  openUpdateProductDrawerHandler,
  openProductDetailsDrawerHandler,
  deleteProductHandler,
  approveProductHandler,
  deletebulkProductHandler,
  
}) => {
  console.log("products data = ", products);
  const columns: Column<{
    name: string;
    color:string,
    code: string,
    product_id: string;
    uom: string;
    category: string;
    sub_category?: string;
    item_type: string;
    product_or_service: string;
    current_stock: number;
    price: number;
    min_stock?: number;
    max_stock?: number;
    hsn_code?: number;
    inventory_category?: string;
    createdAt: string;
    updatedAt: string;
  }>[] = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "product_id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Color",
        accessor: "color",
      },
      {
        Header: "Code",
        accessor: "code",
      },
      {
        Header: "Inventory Category",
        accessor: "inventory_category",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Sub Category",
        accessor: "sub_category",
      },
      {
        Header: "Type",
        accessor: "item_type",
      },
      {
        Header: "Product/Service",
        accessor: "product_or_service",
      },
      {
        Header: "UOM",
        accessor: "uom",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Current stock",
        accessor: "current_stock",
      },
      {
        Header: "Last Change",
        accessor: "change",
      },
      {
        Header: "Min stock",
        accessor: "min_stock",
      },
      {
        Header: "Max stock",
        accessor: "max_stock",
      },
      {
        Header: "Created On",
        accessor: "createdAt",
      },
      {
        Header: "Last Updated",
        accessor: "updatedAt",
      },
    ],
    []
  );

  const inventoryCategoryStyles = {
    indirect: {
      bg: "#F03E3E",
      text: "#ffffff",
    },
    direct: {
      bg: "#409503",
      text: "#ffffff",
    },
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
    pageCount,
    setPageSize: setTablePageSize,
  }: TableInstance<{
    name: string;
    color:string,
    code:string,
    product_id: string;
    uom: string;
    category: string;
    sub_category?: string;
    item_type: string;
    product_or_service: string;
    current_stock: number;
    price: number;
    min_stock?: number;
    max_stock?: number;
    hsn_code?: number;
    createdAt: string;
    updatedAt: string;
  }> = useTable(
    {
      columns,
      data: products,
      initialState: { pageIndex: 0, pageSize },
    },
    useSortBy,
    usePagination
  );
  const [cookies] = useCookies();
  const role = cookies?.role;


  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  

  const toggleRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === page.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(page.map(row => row.original._id));
    }
  };

  useEffect(() => {
    setTablePageSize(pageSize);
  }, [pageSize, setTablePageSize]);


  return (
    <div>
      {isLoadingProducts && <Loading />}
      {products.length === 0 && !isLoadingProducts && (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      )}
      {!isLoadingProducts && products.length > 0 && (
        <div>
          <TableContainer maxHeight="600px" overflowY="auto">
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold">
                {headerGroups.map(
                  (
                    hg: HeaderGroup<{
                      name: string;
                      color:string;
                      code:string;
                      product_id: string;
                      uom: string;
                      category: string;
                      current_stock: number;
                      price: number;
                      min_stock?: number;
                      max_stock?: number;
                      hsn_code?: number;
                      createdAt: string;
                      updatedAt: string;
                    }>
                  ) => {
                    return (
                      <Tr {...hg.getHeaderGroupProps()}>
                        <Th
                                className="bg-table-color"
                                color="white"
                                borderLeft="1px solid #d7d7d7"
                                borderRight="1px solid #d7d7d7"
                              >
                                <div className="flex justify-end mb-2">
                                {selectedRows.length > 0 && (
                                    <>
                                      <MdDeleteOutline
                                        size={20}
                                        color="#fff"
                                        className="cursor-pointer hover:scale-10 mr-1"
                                        title={`Delete ${selectedRows.length} selected`}
                                        onClick={() => {
                                          if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected items?`)) {
                                            deletebulkProductHandler(selectedRows);
                                            setSelectedRows([]); // Reset selection
                                          }
                                        }}
                                      />
                                    </>
                                      
                                  )}
                                  
                                  <input
                                    type="checkbox"
                                    checked={selectedRows.length === page.length}
                                    onChange={toggleAllRows}
                                  />

                                 
                                </div>
                                
                              </Th>
                        {hg.headers.map((column: any) => {
                          return (
                            <>
                              
                              <Th
                            
                              className={
                                column.Header === "Name"
                                  ? "sticky top-0 left-[-2px] bg-table-color"
                                  : "bg-table-color"
                              }
                                textTransform="capitalize"
                                fontSize="12px"
                                fontWeight="700"
                                color="white"
                                borderLeft="1px solid #d7d7d7"
                                borderRight="1px solid #d7d7d7"
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                              >
                              
                                <p className="flex">
                                  {
                                    (role === "Accountant" || role === "Sales" || role === "admin")
                                      ? column.render("Header")
                                      : (column.Header !== 'Price')
                                        ? column.render("Header")
                                        : null
                                  }


                                  {column.isSorted && (
                                    <span> 
                                      {column.isSortedDesc ? (
                                        <FaCaretDown />
                                      ) : (
                                        <FaCaretUp />
                                      )}
                                    </span>
                                  )}
                                </p>
                              </Th>
                            </>
                          );
                        })}
                        <Th
                          textTransform="capitalize"
                          fontSize="12px"
                          fontWeight="700"
                          color="white"
                          backgroundColor={MainColor}
                          borderLeft="1px solid #d7d7d7"
                          borderRight="1px solid #d7d7d7"
                        >
                          Actions
                        </Th>
                      </Tr>
                    );
                  }
                )}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {page.map((row: any) => {
                  prepareRow(row);

                  return (
                    <Tr
                    
                      className="relative hover:bg-[#e4e4e4] hover:cursor-pointer text-base lg:text-sm"
                      {...row.getRowProps()}
                    >
                      <Td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.original._id)}
                          onChange={() => toggleRow(row.original._id)}
                        />
                      </Td>
                      {row.cells.map((cell: Cell) => {
                        return (
                          <Td  className={
                            cell.column.Header === "Name"
                              ? "sticky top-0 left-[-2px] bg-[#f9fafc]"
                              : ""
                          } fontWeight="500" {...cell.getCellProps()}>
                            
                            {
                              (role === "Accountant" || role === "Sales" || role === "admin")
                                ? (cell.column.id !== "createdAt" &&
                                  cell.column.id !== "updatedAt" &&
                                  cell.column.id !== "select" &&
                                  cell.column.id !== "inventory_category" &&
                                  cell.column.id !== "change" &&
                                  cell.render("Cell"))
                                : (cell.column.id !== "createdAt" &&
                                  cell.column.id !== "updatedAt" && cell.column.id !== "price" &&
                                  cell.column.id !== "select" &&
                                  cell.column.id !== "inventory_category" &&
                                  cell.column.id !== "change" &&
                                  cell.render("Cell"))
                            }

                            {cell.column.id === "createdAt" &&
                              row.original?.createdAt && (
                                <span>
                                  {moment(row.original?.createdAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                </span>
                              )}
                            {cell.column.id === "updatedAt" &&
                              row.original?.updatedAt && (
                                <span>
                                  {moment(row.original?.updatedAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                </span>
                              )}
                            {cell.column.id === "inventory_category" && row.original.inventory_category && (
                              <span
                                className="px-2 py-1 rounded-md"
                                style={{
                                  backgroundColor: inventoryCategoryStyles[row.original?.inventory_category]?.bg,
                                  color: inventoryCategoryStyles[row.original?.inventory_category]?.text,
                                }}
                              >
                                {row.original?.inventory_category?.substr(0, 1).toUpperCase() + row.original?.inventory_category.substr(1,)}
                              </span>
                            )}
                            {cell.column.id === "change" && row.original?.change_type && (
                              <p className="flex gap-1 items-center">
                                {row.original.change_type === 'increase' ? <FaArrowUpLong color="#0dac51" size={20} /> : <FaArrowDownLong color="#c70505" size={20} />}
                                <span style={{ color: row.original?.change_type === 'increase' ? '#0dac51' : '#c70505' }}>{row.original?.quantity_changed}</span>
                              </p>
                            )}
                          </Td>
                        );
                      })}
                      <Td className="flex gap-x-2" >
                        {openProductDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openProductDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateProductDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateProductDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteProductHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110 cursor-pointer"
                            size={16}
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this product?")) {
                                deleteProductHandler(row.original?._id);
                              }
                            }}
                          />
                        )}
                        {approveProductHandler && (
                          <FcApproval
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              approveProductHandler(row.original?._id)
                            }
                          />
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <div className="w-[max-content] m-auto my-7">
            <button
              className="text-sm mt-2 bg-table-color py-1 px-4 text-white border-[1px] border-table-color rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
              disabled={!canPreviousPage}
              onClick={previousPage}
            >
              Prev
            </button>
            <span className="mx-3 text-sm md:text-lg lg:text-xl xl:text-base">
              {pageIndex + 1} of {pageCount}
            </span>
            <button
              className="text-sm mt-2 bg-table-color py-1 px-4 text-white border-[1px] border-table-color rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
              disabled={!canNextPage}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
