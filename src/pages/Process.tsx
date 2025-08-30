import { Button, Select } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import ProcessTable from "../components/Table/ProcessTable";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddProcessDrawer,
  closeProcessDetailsDrawer,
  closeUpdateProcessDrawer,
  openAddProcessDrawer,
  openProcessDetailsDrawer,
  openUpdateProcessDrawer,
} from "../redux/reducers/drawersSlice";
import AddProcess from "../components/Drawers/Process/AddProcess";
import ProcessDetails from "../components/Drawers/Process/ProcessDetails";
import UpdateProcess from "../components/Drawers/Process/UpdateProcess";
import { useDeleteProcessMutation } from "../redux/api/api";
import { MainColor } from "../constants/constants";
import { socket } from "../socket";
const Process: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("production");
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cookies] = useCookies();
  const [id, setId] = useState<string | undefined>();
  const [PageSize, setPageSize] = useState<number>(10);
  const fetchProcessHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "production-process/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setData(data.production_processes);
      setFilteredData(data.production_processes);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    isAddProcessDrawerOpened,
    isUpdateProcessDrawerOpened,
    isProcessDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const [deleteProcess] = useDeleteProcessMutation();

  const openAddProcessDrawerHandler = () => {
    dispatch(openAddProcessDrawer());
  };
  const closeAddProcessDrawerHandler = () => {
    dispatch(closeAddProcessDrawer());
  };
  const openProcessDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openProcessDetailsDrawer());
  };
  const closeProcessDetailsDrawerHandler = () => {
    dispatch(closeProcessDetailsDrawer());
  };
  const openUpdateProcessDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openUpdateProcessDrawer());
  };
  const closeUpdateProcessDrawerHandler = () => {
    dispatch(closeUpdateProcessDrawer());
  };

  const deleteProcessHandler = async (id: string) => {
    try {
      const response = await deleteProcess(id).unwrap();
      toast.success(response.message);
      fetchProcessHandler();
    } catch (error: any) {
      console.log(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchProcessHandler();
  }, []);
  
  useEffect(() => {
    const handleChangesApply = (data:any) => {
      if (data === true) {
        fetchProcessHandler();
        socket.off('changesapply', handleChangesApply); // Remove listener after first call
      }
    };
    
    socket.on('changesapply', handleChangesApply);

    return () => {
      socket.off('changesapply', handleChangesApply); // Prevent duplication on rerender
    };
  });

  useEffect(() => {
    const searchText = searchKey?.toLowerCase();
    const results = data.filter(
      (p: any) =>
        p.creator?.first_name?.toLowerCase()?.includes(searchText) ||
        p?.creator?.last_name?.toLowerCase()?.includes(searchText) ||
        p?.item?.name?.toLowerCase()?.includes(searchText) ||
        p?.status?.toLowerCase()?.includes(searchText) ||
        p?.em_store?.name?.toLowerCase()?.includes(searchText) ||
        p?.fg_store?.name?.toLowerCase()?.includes(searchText) ||
        p?.scrap_store?.name?.toLowerCase()?.includes(searchText) ||
        (p?.createdAt &&
          new Date(p?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchText?.replaceAll("/", "") || "")) ||
        (p?.updatedAt &&
          new Date(p?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchText?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div>
      {isAddProcessDrawerOpened && (
        <AddProcess
          fetchProcessHandler={fetchProcessHandler}
          closeDrawerHandler={closeAddProcessDrawerHandler}
        />
      )}
      {isProcessDetailsDrawerOpened && (
        <ProcessDetails
          id={id}
          closeDrawerHandler={closeProcessDetailsDrawerHandler}
        />
      )}
      {isUpdateProcessDrawerOpened && (
        <UpdateProcess
          id={id}
          closeDrawerHandler={closeUpdateProcessDrawerHandler}
          fetchProcessHandler={fetchProcessHandler}
        />
      )}

      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
        Production Process
      </div>

      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
        {/* Search Input */}
        <div className="w-full md:max-w-xs">
          <textarea
            className="w-full rounded-[10px] border border-[#0d9488] px-3 py-2 text-sm resize-none focus:outline-[#14b8a6] hover:outline-[#14b8a6]"
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>

        {/* Controls: Add, Refresh, Select */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-3">
          {/* Add Button */}
          <Button
            fontSize="14px"
            px={4}
            py={2.5}
            w="full"
            onClick={openAddProcessDrawerHandler}
            bg={MainColor}
            color="white"
            _hover={{ bg: "#14b8a6" }}
            className="rounded-lg text-sm"
          >
            Add New Production Process
          </Button>

          {/* Refresh Button */}
          <Button
            fontSize="14px"
            px={4}
            py={2.5}
            w="full"
            onClick={fetchProcessHandler}
            leftIcon={<MdOutlineRefresh />}
            borderColor="#319795"
            color="#319795"
            variant="outline"
            className="rounded-lg text-sm"
          >
            Refresh
          </Button>

          {/* Page Size Selector */}
          <Select
            width={{base:"full" , md:"220px"}}
            onChange={(e) => setPageSize(Number(e.target.value))}
            size="md"
            variant="outline"
            className="text-sm"
            defaultValue={10}
            
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={100000}>All</option>
          </Select>
        </div>
      </div>



      <div>
        <ProcessTable
           pageSize={PageSize}
           setPageSize={setPageSize}
          isLoadingProcess={isLoading}
          process={filteredData}
          deleteProcessHandler={deleteProcessHandler}
          openUpdateProcessDrawerHandler={openUpdateProcessDrawerHandler}
        />
      </div>
    </div>
  );
};

export default Process;
