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
  import { useMemo } from "react";
  import { FaCaretDown, FaCaretUp } from "react-icons/fa";
  import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
  import { FcApproval, FcDatabase } from "react-icons/fc";
  import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
  import {
    usePagination,
    useSortBy,
    useTable,
    Column,
    TableState,
    TableInstance,
    HeaderGroup,
    Row,
    Cell,
  } from "react-table";
  import Loading from "../../ui/Loading";
  
  interface BOMRawMaterialTableProps {
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
      quantity: number;
    }>;
    isLoadingProducts: boolean;
    openUpdateProductDrawerHandler?: (id: string) => void;
    openProductDetailsDrawerHandler?: (id: string) => void;
    deleteProductHandler?: (id: string) => void;
    approveProductHandler?: (id: string) => void;
  }
  
  const BOMRawMaterialTable: React.FC<BOMRawMaterialTableProps> = ({
    products,
    isLoadingProducts,
    openUpdateProductDrawerHandler,
    openProductDetailsDrawerHandler,
    deleteProductHandler,
    approveProductHandler,
  }) => {
    const columns: Column<{
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
    }>[] = useMemo(
      () => [
        {
          Header: "BOM",
          accessor: "bom_name",
        },
        {
          Header: "ID",
          accessor: "product_id",
        },
        {
          Header: "Name",
          accessor: "name",
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
          Header: "Quantity",
          accessor: "quantity",
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
      state: { pageIndex, pageSize },
      pageCount,
      setPageSize,
    }: TableInstance<{
      name: string;
      product_id: string;
      uom: string;
      category: string;
      sub_category?: string;
      item_type: string;
      product_or_service: string;
      current_stock: number;
      price: number;
      quantity: number;
      min_stock?: number;
      max_stock?: number;
      hsn_code?: number;
      createdAt: string;
      updatedAt: string;
    }> = useTable(
      {
        columns,
        data: products,
        initialState: { pageIndex: 0 },
      },
      useSortBy,
      usePagination
    );
  
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
            <div className="flex justify-end mb-2">
              <Select
                onChange={(e) => setPageSize(e.target.value)}
                width="80px"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={100000}>All</option>
              </Select>
            </div>
            <TableContainer maxHeight="600px" overflowY="auto">
              <Table variant="simple" {...getTableProps()}>
                <Thead className="text-sm font-semibold">
                  {headerGroups.map(
                    (
                      hg: HeaderGroup<{
                        name: string;
                        product_id: string;
                        uom: string;
                        category: string;
                        current_stock: number;
                        price: number;
                        quantity: number;
                        min_stock?: number;
                        max_stock?: number;
                        hsn_code?: number;
                        createdAt: string;
                        updatedAt: string;
                      }>
                    ) => {
                      return (
                        <Tr {...hg.getHeaderGroupProps()}>
                          {hg.headers.map((column: any) => {
                            return (
                              <Th
                                textTransform="capitalize"
                                fontSize="12px"
                                fontWeight="700"
                                color="black"
                                backgroundColor="#fafafa"
                                borderLeft="1px solid #d7d7d7"
                                borderRight="1px solid #d7d7d7"
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                              >
                                <p className="flex">
                                  {column.render("Header")}
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
                            );
                          })}
                          <Th
                            textTransform="capitalize"
                            fontSize="12px"
                            fontWeight="700"
                            color="black"
                            backgroundColor="#fafafa"
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
                        {row.cells.map((cell: Cell) => {
                          return (
                            <Td fontWeight="500" {...cell.getCellProps()}>
                              {cell.column.id !== "createdAt" &&
                                cell.column.id !== "updatedAt" &&
                                cell.column.id !== "select" &&
                                cell.column.id !== "inventory_category" &&
                                cell.column.id !== "change" &&
                                cell.render("Cell")}
  
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
                                  {row.original?.change_type === 'increase' ? <FaArrowUpLong color="#0dac51" size={20} /> : <FaArrowDownLong color="#c70505" size={20} />}
                                  <span style={{ color: row.original?.change_type === 'increase' ? '#0dac51' : '#c70505' }}>{row.original?.quantity_changed}</span>
                                </p>
                              )}
                            </Td>
                          );
                        })}
                        <Td className="flex gap-x-2">
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
                              className="hover:scale-110"
                              size={16}
                              onClick={() =>
                                deleteProductHandler(row.original?._id)
                              }
                            />
                          )}
                          {approveProductHandler && (
                            <FcApproval
                              className="hover:scale-110"
                              size={16}
                              onClick={() =>
                                approveProductHandler(row?.original)
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
  
  export default BOMRawMaterialTable;
  