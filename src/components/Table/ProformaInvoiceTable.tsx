// @ts-nocheck

import { useMemo } from "react";
import {
  Cell,
  Column,
  HeaderGroup,
  TableInstance,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Loading from "../../ui/Loading";
import { FcApproval, FcDatabase } from "react-icons/fc";
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
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import moment from "moment";
import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
import { log } from "console";
import { MainColor } from "../../constants/constants";

interface ProformaInvoiceTableProps {
  proformaInvoices: Array<{
    creator: string;
    created_on: string;
    customer?: string;
    startdate: string;
    subtotal: string;
    total: string;
    status: string;
  }>;
  isLoadingProformaInvoices: boolean,
  openProformaInvoiceDetailsHandler?: (id: string) => void,
  deleteProformaInvoiceHandler?: (id: string) => void,
  openUpdateProformaInvoiceDrawer?: (id: string) => void
}

const ProformaInvoiceTable: React.FC<AgentTableProps> = ({
  proformaInvoices,
  isLoadingProformaInvoices,
  openProformaInvoiceDetailsHandler,
  deleteProformaInvoiceHandler,
  openUpdateProformaInvoiceDrawer
}) => {
  const columns = useMemo(
    () => [
      { Header: "Created By", accessor: "creator" },
      { Header: "Created At", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
      { Header: "Customer", accessor: "customer" },
      { Header: "Sub Total", accessor: "subtotal" },
      { Header: "Total", accessor: "total" },
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
    state: { pageIndex, pageSize },
    pageCount,
    setPageSize,
  }: TableInstance<{
    createdBy: string;
    createdOn: string;
    customer?: string;
    startdate: string;
    subtotal: string;
    total: string;
    status: string;
  }> = useTable(
    {
      columns,
      data: proformaInvoices,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div>
      {isLoadingProformaInvoices && <Loading />}
      {proformaInvoices.length === 0 && !isLoadingProformaInvoices && (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      )}
      {!isLoadingProformaInvoices && proformaInvoices.length > 0 && (
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
                      createdBy: string;
                      createdOn: string;
                      customer?: string;
                      startdate: string;
                      subtotal: string;
                      total: string;
                      status: string;
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
                              color="white"
                              backgroundColor={MainColor}
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
                          <Td fontWeight="500" {...cell.getCellProps()}>
                            {cell.column.id !== "createdAt" &&
                              cell.column.id !== "updatedAt" &&
                              cell.column.id !== "customer" &&
                              cell.column.id !== "creator" &&
                              cell.column.id !== "creator" &&
                              cell.render("Cell")}

                            {cell.column.id === "creator" &&
                              row.original?.creator && (
                                <span>
                                  {row.original?.creator?.first_name + ' ' + row.original?.creator?.last_name}
                                </span>
                              )}
                            {cell.column.id === "createdAt" &&
                              row.original?.createdAt && (
                                <span>
                                  {moment(row.original?.createdAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                </span>
                              )}
                            {cell.column.id === "updatedAt" &&
                              row.original?.createdAt && (
                                <span>
                                  {moment(row.original?.updatedAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                </span>
                              )}
                            {cell.column.id === "customer" &&
                              (row.original?.buyer || row.original?.supplier) && (
                                <span>
                                  {row.original?.buyer ? row.original?.buyer.name : row.original?.supplier.name}
                                </span>
                              )}
                            {cell.column.id === "creator" &&
                              row.original?.buyer && (
                                <span>
                                  PENDING
                                </span>
                              )}
                          </Td>
                        );
                      })}
                      <Td className="flex gap-x-2">
                        {openProformaInvoiceDetailsHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openProformaInvoiceDetailsHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateProformaInvoiceDrawer && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateProformaInvoiceDrawer(row.original?._id)
                            }
                          />
                        )}
                        {deleteProformaInvoiceHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              deleteProformaInvoiceHandler(row.original?._id)
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
              className="text-sm mt-2 bg-table-color py-1 px-4 text-white border-[1px] border-table-colobg-table-color rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
              disabled={!canPreviousPage}
              onClick={previousPage}
            >
              Prev
            </button>
            <span className="mx-3 text-sm md:text-lg lg:text-xl xl:text-base">
              {pageIndex + 1} of {pageCount}
            </span>
            <button
              className="text-sm mt-2 bg-table-color py-1 px-4 text-white border-[1px] border-table-colobg-table-color rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
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

export default ProformaInvoiceTable;
