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

interface EmployeeTableProps {
  employees: Array<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: any;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    _id?: string;
    isSuper?: boolean;
  }>;
  pageSize: number;
  setPageSize: (size: number) => void;
  isLoadingEmployees: boolean;
  openUpdateEmployeeDrawerHandler?: (id: string) => void;
  openEmployeeDetailsDrawerHandler?: (id: string) => void;
  deleteEmployeeHandler?: (id: string) => void;
  approveEmployeeHandler?: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoadingEmployees,
  openUpdateEmployeeDrawerHandler,
  openEmployeeDetailsDrawerHandler,
  deleteEmployeeHandler,
  approveEmployeeHandler,
  pageSize,
  setPageSize,
}) => {
  const columns = useMemo(
    () => [
      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Role", accessor: "role" },
      { Header: "isVerified", accessor: "isVerified" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
    ],
    []
  );

  const verificationStyles = {
    "not verified": {
      bg: "#F03E3E",
      text: "#ffffff",
    },
    verified: {
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
  }: TableInstance<any> = useTable(
    {
      columns,
      data: employees,
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
      {isLoadingEmployees && <Loading />}
      {employees.length === 0 && !isLoadingEmployees && (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      )}
      {!isLoadingEmployees && employees.length > 0 && (
        <div>
          <TableContainer maxHeight="600px" className="py-1" overflowY="auto">
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold">
                {headerGroups.map((hg: HeaderGroup<any>) => (
                  <Tr {...hg.getHeaderGroupProps()}>
                    {hg.headers.map((column: any) => (
                      <Th
                        className={
                          column.Header === "First Name"
                            ? "sticky top-0 left-[-2px] bg-table-color"
                            : "bg-table-color"
                        }
                        textTransform="capitalize"
                        fontSize="12px"
                        fontWeight="700"
                        color="white"
                        borderLeft="1px solid #d7d7d7"
                        borderRight="1px solid #d7d7d7"
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                      >
                        <p className="flex items-center gap-1">
                          {column.render("Header")}
                          {column.isSorted && (
                            <span>
                              {column.isSortedDesc ? <FaCaretDown /> : <FaCaretUp />}
                            </span>
                          )}
                        </p>
                      </Th>
                    ))}
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
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {page.map((row: any) => {
                  prepareRow(row);
                  return (
                    <Tr
                      className="hover:bg-gray-100 cursor-pointer text-sm"
                      {...row.getRowProps()}
                    >
                      {row.cells.map((cell: Cell) => (
                        <Td
                          className={
                            cell.column.Header === "First Name"
                              ? "sticky top-0 left-[-2px] bg-[#f9fafc]"
                              : ""
                          }
                          fontWeight="500"
                          {...cell.getCellProps()}
                        >
                          {cell.column.id === "createdAt"
                            ? moment(row.original?.createdAt).format("DD/MM/YYYY")
                            : cell.column.id === "updatedAt"
                            ? moment(row.original?.updatedAt).format("DD/MM/YYYY")
                            : cell.column.id === "isVerified"
                            ? (
                                <span
                                  className="px-2 py-1 rounded-md"
                                  style={{
                                    backgroundColor:
                                      verificationStyles[
                                        row.original?.isVerified ? "verified" : "not verified"
                                      ].bg,
                                    color:
                                      verificationStyles[
                                        row.original?.isVerified ? "verified" : "not verified"
                                      ].text,
                                  }}
                                >
                                  {row.original.isVerified ? "Verified" : "Not Verified"}
                                </span>
                              )
                            : cell.column.id === "role"
                            ? row.original?.role?.role ||
                              (row.original?.isSuper ? "Super Admin" : "")
                            : cell.render("Cell")}
                        </Td>
                      ))}
                      <Td className="flex gap-x-2 items-center">
                        {openEmployeeDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110 cursor-pointer"
                            size={16}
                            onClick={() =>
                              openEmployeeDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateEmployeeDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110 cursor-pointer"
                            size={16}
                            onClick={() =>
                              openUpdateEmployeeDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteEmployeeHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110 cursor-pointer"
                            size={16}
                            onClick={() =>
                              deleteEmployeeHandler(row.original?._id)
                            }
                          />
                        )}
                        {approveEmployeeHandler && (
                          <FcApproval
                            className="hover:scale-110 cursor-pointer"
                            size={16}
                            onClick={() =>
                              approveEmployeeHandler(row.original?._id)
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

          {/* Pagination Controls */}
          <div className="w-[max-content] m-auto my-7">
            <button
              className="text-sm bg-table-color py-1 px-4 text-white border rounded-3xl disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!canPreviousPage}
              onClick={previousPage}
            >
              Prev
            </button>
            <span className="mx-3 text-sm">{pageIndex + 1} of {pageCount}</span>
            <button
              className="text-sm bg-table-color py-1 px-4 text-white border rounded-3xl disabled:bg-gray-300 disabled:cursor-not-allowed"
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

export default EmployeeTable;
