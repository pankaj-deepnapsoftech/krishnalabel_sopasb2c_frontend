// @ts-nocheck

import {
 
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useMemo } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
import { FcApproval, FcDatabase } from "react-icons/fc";
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
import { MainColor } from "../../constants/constants";

interface StoreTableProps {
  stores: Array<{
    name: string;
    gst_number: string;
    address_line1: string;
    address_line2?: string;
    pincode?: string;
    city: string;
    state: string;
    createdAt: string;
    updatedAt: string;
  }>;
  isLoadingStores: boolean;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  openUpdateStoreDrawerHandler?: (id: string) => void;
  openStoreDetailsDrawerHandler?: (id: string) => void;
  deleteStoreHandler?: (id: string) => void;
  approveStoreHandler?: (id: string) => void;
}

const StoreTable: React.FC<StoreTableProps> = ({
  stores,
  isLoadingStores,
  openUpdateStoreDrawerHandler,
  openStoreDetailsDrawerHandler,
  deleteStoreHandler,
  approveStoreHandler,
  pageSize,
  setPageSize,
}) => {
  const columns: Column<{
    name: string;
    gst_number: string;
    address_line1: string;
    address_line2?: string;
    pincode?: string;
    city: string;
    state: string;
    createdAt: string;
    updatedAt: string;
  }>[] = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "GST No.",
        accessor: "gst_number",
      },
      {
        Header: "Address Line 1",
        accessor: "address_line1",
      },
      {
        Header: "Address Line 2",
        accessor: "address_line2",
      },
      {
        Header: "Pincode",
        accessor: "pincode",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "State",
        accessor: "state",
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
    gst_number: string;
    address_line1: string;
    address_line2?: string;
    pincode?: string;
    city: string;
    state: string;
    createdAt: string;
    updatedAt: string;
  }> = useTable(
    {
      columns,
      data: stores,
      initialState: { pageIndex: 0, pageSize },
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setTablePageSize(pageSize);
  }, [pageSize, setTablePageSize]);

  return (
    <div>
      {isLoadingStores && <Loading />}
      {stores.length === 0 && !isLoadingStores && (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      )}
      {!isLoadingStores && stores.length > 0 && (
        <div>
          <TableContainer maxHeight="600px" overflowY="auto">
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold">
                {headerGroups.map(
                  (
                    hg: HeaderGroup<{
                      name: string;
                      gst_number: string;
                      address_line1: string;
                      address_line2?: string;
                      pincode?: string;
                      city: string;
                      state: string;
                      createdAt: string;
                      updatedAt: string;
                    }>
                  ) => {
                    return (
                      <Tr {...hg.getHeaderGroupProps()}>
                        {hg.headers.map((column: any) => {
                          return (
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
                      {row.cells.map((cell: Cell) => {
                        return (
                          <Td  className={
                            cell.column.Header === "Name"
                              ? "sticky top-0 left-[-2px] bg-[#f9fafc]"
                              : ""
                          } fontWeight="500" {...cell.getCellProps()}>
                            {cell.column.id !== "createdAt" &&
                              cell.column.id !== "updatedAt" &&
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
                          </Td>
                        );
                      })}
                      <Td className="flex gap-x-2">
                        {openStoreDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openStoreDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateStoreDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateStoreDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteStoreHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              deleteStoreHandler(row.original?._id)
                            }
                          />
                        )}
                        {approveStoreHandler && (
                          <FcApproval
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              approveStoreHandler(row.original?._id)
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
              className="text-sm mt-2 bg-table-color py-1 px-4 text-white border-[1px] border-table-bg-table-color rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
              disabled={!canPreviousPage}
              onClick={previousPage}
            >
              Prev
            </button>
            <span className="mx-3 text-sm md:text-lg lg:text-xl xl:text-base">
              {pageIndex + 1} of {pageCount}
            </span>
            <button
              className="text-sm mt-2 bg-table-color py-1 px-4 text-white border-[1px] border-table-bg-table-color rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
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

export default StoreTable;
