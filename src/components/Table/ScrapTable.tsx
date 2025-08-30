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
import { useMemo } from "react";
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

interface ScrapTableProps {
    scraps: Array<{
        item: string;
        bom: string;
        estimated_quantity: string;
        produced_quantity: string;
        total_part_cost: string;
        createdAt: string;
        updatedAt: string;
    }>;
    isLoadingScraps: boolean;
    openScrapDetailsDrawerHandler?: (id: string) => void;
}

const ScrapTable: React.FC<ScrapTableProps> = ({
    scraps,
    isLoadingScraps,
    openScrapDetailsDrawerHandler,
}) => {
    const columns: Column<{
        item: string;
        bom: string;
        estimated_quantity: string;
        produced_quantity: string;
        total_part_cost: string;
        createdAt: string;
        updatedAt: string;
    }>[] = useMemo(
        () => [
            {
                Header: "Item",
                accessor: "item",
            },
            {
                Header: "BOM",
                accessor: "bom",
            },
            {
                Header: "Finished Good",
                accessor: "finished_good",
            },
            {
                Header: "Estimated Quantity",
                accessor: "estimated_quantity",
            },
            {
                Header: "Produced Quantity",
                accessor: "produced_quantity",
            },
            {
                Header: "Total Part Cost",
                accessor: "total_part_cost",
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
        item: string;
        bom: string;
        estimated_quantity: string;
        produced_quantity: string;
        total_part_cost: string;
        createdAt: string;
        updatedAt: string;
    }> = useTable(
        {
            columns,
            data: scraps,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination
    );

    return (
        <div>
            {isLoadingScraps && <Loading />}
            {scraps.length === 0 && !isLoadingScraps && (
                <div className="mx-auto w-max">
                    <FcDatabase size={100} />
                    <p className="text-lg">No Data Found</p>
                </div>
            )}
            {!isLoadingScraps && scraps.length > 0 && (
                <div>
                   
                    <TableContainer maxHeight="600px" overflowY="auto">
                        <Table variant="simple" {...getTableProps()}>
                            <Thead className="text-sm font-semibold">
                                {headerGroups.map(
                                    (
                                        hg: HeaderGroup<{
                                            item: string;
                                            bom: string;
                                            estimated_quantity: string;
                                            produced_quantity: string;
                                            total_part_cost: string;
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
                                                            column.Header === "BOM"
                                                                    ? "sticky top-0 md:left-[-2px] bg-table-color"
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
                                                        cell.column.Header === "BOM"
                                                          ? "sticky top-0 md:left-[-2px] bg-[#f9fafc]"
                                                          : ""
                                                      } fontWeight="500" {...cell.getCellProps()}>
                                                        {cell.column.id !== "createdAt" &&
                                                            cell.column.id !== "updatedAt" &&
                                                            cell.column.id !== "item" &&
                                                            cell.column.id !== "bom" &&
                                                            cell.column.id !== "finished_good" &&
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
                                                        {cell.column.id === "item" && (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                            >
                                                                {row.original?.item.name}
                                                            </span>
                                                        )}
                                                        {cell.column.id === "bom" && (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                            >
                                                                {row.original?.bom?.bom_name}
                                                            </span>
                                                        )}
                                                        {cell.column.id === "finished_good" && (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                            >
                                                                {row.original?.bom?.finished_good?.item?.name}
                                                            </span>
                                                        )}
                                                    </Td>
                                                );
                                            })}
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>

                    <div className="w-[max-content] m-auto my-7">
                        <button
                            className="text-sm mt-2 bg-table-color py-1 px-4 text-white border-[1px] border-table-colorbg-table-color rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
                            disabled={!canPreviousPage}
                            onClick={previousPage}
                        >
                            Prev
                        </button>
                        <span className="mx-3 text-sm md:text-lg lg:text-xl xl:text-base">
                            {pageIndex + 1} of {pageCount}
                        </span>
                        <button
                            className="text-sm mt-2 bg-table-color py-1 px-4 text-white border-[1px] border-table-colorbg-table-color rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
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

export default ScrapTable;
