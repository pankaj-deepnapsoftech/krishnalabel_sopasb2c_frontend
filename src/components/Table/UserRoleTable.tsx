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

interface UserRoleTableProps {
  roles: Array<{
    role: string,
    description: string,
    createdAt: string,
    updatedAt: string
  }>;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  isLoadingRoles: boolean;
  openUpdateRoleDrawerHandler?: (id: string) => void;
  openRoleDetailsDrawerHandler?: (id: string) => void;
  deleteRoleHandler?: (id: string) => void;
}

const roleColors: { [key: string]: string } = {
  Sales: "#1E90FF",      // Dodger Blue
  Dispatcher: "#32CD32",       // Lime Green
  Production: "#FF8C00",    // Dark Orange
  Designer: "#A9A9A9",      // Dark Gray
  Accountant: "#A9c9A9",
  default: "#6B7280",    // Tailwind's gray-600
};

const UserRoleTable: React.FC<UserRoleTableProps> = ({
  roles,
  isLoadingRoles,
  openUpdateRoleDrawerHandler,
  openRoleDetailsDrawerHandler,
  deleteRoleHandler,
  approveRoleHandler,
  pageSize,
  setPageSize,
}) => {
  const columns: Column<{
    role: string,
    description: string,
    createdAt: string,
    updatedAt: string
  }>[] = useMemo(
    () => [
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Description",
        accessor: "description",
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
    role: string,
    description: string,
    createdAt: string,
    updatedAt: string
  }> = useTable(
    {
      columns,
      data: roles,
      initialState: { pageIndex: 0, pageSize },
      manualPagination: false,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setTablePageSize(pageSize);
  }, [pageSize, setTablePageSize]);

  return (
    <div>
      {isLoadingRoles && <Loading />}
      {roles.length === 0 && !isLoadingRoles && (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      )}
      {!isLoadingRoles && roles.length > 0 && (
        <div>
         
          <TableContainer maxHeight="600px" overflowY="auto">
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold">
                {headerGroups.map(
                  (
                    hg: HeaderGroup<{
                      role: string,
                      description: string,
                      createdAt: string,
                      updatedAt: string
                    }>
                  ) => {
                    return (
                      <Tr {...hg.getHeaderGroupProps()}>
                        {hg.headers.map((column: any,index:number) => {
                          return (
                            <Th
                            key={index}
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
                {page.map((row: any,index:number) => {
                  prepareRow(row);

                  return (
                    <Tr
                    key={index}
                      className="relative hover:bg-[#e4e4e4] hover:cursor-pointer text-base lg:text-sm"
                      {...row.getRowProps()}
                    >
                      {row.cells.map((cell: Cell) => {
                        return (
                          <Td fontWeight="500" {...cell.getCellProps()}>
                            {cell.column.id !== "createdAt" &&
                              cell.column.id !== "updatedAt" &&
                              cell.column.id !== "role" &&
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
                            {cell.column.id === "role" && <span className="px-2 py-1 rounded-md bg-[#918d8d] text-white"
                              style={{
                                backgroundColor:
                                  roleColors[row.original?.role] || roleColors.default,
                              }}
                            >
                              {row.original?.role}
                            </span>}
                          </Td>
                        );
                      })}
                      <Td className="flex gap-x-2">
                        {openRoleDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openRoleDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateRoleDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateRoleDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteRoleHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this role?")) {
                                deleteRoleHandler(row.original?._id);
                              }
                            }}
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
              className="text-sm mt-2 bg-table-color py-1 px-4 text-white border-[1px] border-table-cbg-table-color rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] d isabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
              disabled={!canPreviousPage}
              onClick={previousPage}
            >
              Prev 
            </button>   
            <span className="mx-3 text-sm md:text-lg lg:text-xl xl:text-base">
              {pageIndex + 1} of {pageCount}
            </span>
            <button
              className="text-sm mt-2 bg-table-color py-1 px-4 text-white border-[1px] border-table-cbg-table-color rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
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

export default UserRoleTable;
