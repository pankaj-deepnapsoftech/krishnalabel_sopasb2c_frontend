// @ts-nocheck

import { useEffect, useMemo } from "react";
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
import { MainColor } from "../../constants/constants";

interface AgentTableProps {
  agents: Array<{
    name: string;
    email: string;
    phone: string;
    gst_number?: string;
    company_name: string;
    company_email: string;
    company_phone: string;
    address_line1: string;
    address_line2?: string;
    pincode?: string;
    city: string;
    state?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  isLoadingAgents: boolean;
  openUpdateAgentDrawerHandler?: (id: string) => void;
  openAgentDetailsDrawerHandler?: (id: string) => void;
  deleteAgentHandler?: (id: string) => void;
  approveAgentHandler?: (id: string) => void;
}

const AgentTable: React.FC<AgentTableProps> = ({
  agents,
  isLoadingAgents,
  openUpdateAgentDrawerHandler,
  openAgentDetailsDrawerHandler,
  deleteAgentHandler,
  approveAgentHandler,
  pageSize,
  setPageSize,
}) => {
  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone" },
      { Header: "GST Number", accessor: "gst_number" },
      { Header: "Company Name", accessor: "company_name" },
      { Header: "Company Email", accessor: "company_email" },
      { Header: "Company Phone", accessor: "company_phone" },
      { Header: "Address Line 1", accessor: "address_line1" },
      { Header: "Address Line 2", accessor: "address_line2" },
      { Header: "Pincode", accessor: "pincode" },
      { Header: "City", accessor: "city" },
      { Header: "State", accessor: "state" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
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
    email: string;
    phone: string;
    gst_number?: string;
    company_name: string;
    company_email: string;
    company_phone: string;
    address_line1: string;
    address_line2?: string;
    pincode?: string;
    city: string;
    state?: string;
    createdAt: string;
    updatedAt: string;
  }> = useTable(
    {
      columns,
      data: agents,
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
      {isLoadingAgents && <Loading />}
      {agents.length === 0 && !isLoadingAgents && (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      )}
      {!isLoadingAgents && agents.length > 0 && (
        <div>

          <TableContainer maxHeight="600px" overflowY="auto">
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold">
                {headerGroups.map(
                  (
                    hg: HeaderGroup<{
                      name: string;
                      email: string;
                      phone: string;
                      gst_number?: string;
                      company_name: string;
                      company_email: string;
                      company_phone: string;
                      address_line1: string;
                      address_line2?: string;
                      pincode?: string;
                      city: string;
                      state?: string;
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
                        {openAgentDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openAgentDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateAgentDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateAgentDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteAgentHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this buyer?")) {
                                deleteAgentHandler(row.original?._id);
                              }
                            }}

                          />
                        )}
                        {approveAgentHandler && (
                          <FcApproval
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              approveAgentHandler(row.original?._id)
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

export default AgentTable;
