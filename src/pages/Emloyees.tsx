import { Button, Select } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddEmployeeDrawer,
  closeEmployeeDetailsDrawer,
  closeUpdateEmployeeDrawer,
  openAddEmployeeDrawer,
  openEmployeeDetailsDrawer,
  openUpdateEmployeeDrawer,
} from "../redux/reducers/drawersSlice";
import EmployeeTable from "../components/Table/EmployeeTable";
import EmployeeDetails from "../components/Drawers/Employee/EmployeeDetails";
import UpdateEmployee from "../components/Drawers/Employee/UpdateEmployee";

const Employees: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("employee");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [employeeId, setEmployeeId] = useState<string | undefined>();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);
  const [PageSize, setPageSize] = useState<number>(10);
  const { isUpdateEmployeeDrawerOpened, isEmployeeDetailsDrawerOpened } =
    useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const openUpdateEmployeeDrawerHandler = (id: string) => {
    setEmployeeId(id);
    dispatch(openUpdateEmployeeDrawer());
  };

  const closeUpdateEmployeeDrawerHandler = () => {
    dispatch(closeUpdateEmployeeDrawer());
  };

  const openEmployeeDetailsDrawerHandler = (id: string) => {
    setEmployeeId(id);
    dispatch(openEmployeeDetailsDrawer());
  };

  const closeEmployeeDetailsDrawerHandler = () => {
    dispatch(closeEmployeeDetailsDrawer());
  };

  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);

  const fetchEmployeesHandler = async () => {
    try {
      setIsLoadingEmployees(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "auth/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const results = await response.json();
      if (!results.success) {
        throw new Error(results?.message);
      }
      setData(results.users);
      setFilteredData(results.users);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployeesHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = data.filter(
      (emp: any) =>
        emp.first_name?.toLowerCase()?.includes(searchTxt) ||
        emp.last_name?.toLowerCase().includes(searchTxt) ||
        emp.email.toLowerCase()?.includes(searchTxt) ||
        emp.phone.toLowerCase().toString().includes(searchTxt) ||
        emp?.role?.role?.toLowerCase()?.includes(searchTxt) ||
        (emp?.createdAt &&
          new Date(emp?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (emp?.updatedAt &&
          new Date(emp?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
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
    <div className="p-4">
      {/* Drawers */}
      {isUpdateEmployeeDrawerOpened && (
        <UpdateEmployee
          closeDrawerHandler={closeUpdateEmployeeDrawerHandler}
          employeeId={employeeId}
          fetchEmployeesHandler={fetchEmployeesHandler}
        />
      )}

      {isEmployeeDetailsDrawerOpened && (
        <EmployeeDetails
          closeDrawerHandler={closeEmployeeDetailsDrawerHandler}
          employeeId={employeeId}
        />
      )}

      {/* Heading */}
      <div className="text-lg md:text-xl font-semibold pb-4">Employees</div>

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {/* Search Box */}
        <textarea
          className="w-full md:w-1/2 rounded-lg px-3 py-2 text-sm border border-[#0d9488] focus:outline-[#14b8a6] resize-none"
          rows={1}
          placeholder="Search"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />

        {/* Buttons & Select */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
          <Button
            fontSize="14px"
            paddingX="12px"
            paddingY="6px"
            onClick={fetchEmployeesHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#319795"
            borderColor="#319795"
            variant="outline"
            className="text-sm"
          >
            Refresh
          </Button>

          <Select
            // onChange={(e) => setPageSize(Number(e.target.value))}
            width={{ base: "full", md: "80px" }}
            className="text-sm  focus:outline-none"
            onChange={(e) => setPageSize(Number(e.target.value))}
          
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={100000}>All</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <EmployeeTable
          employees={filteredData}
          pageSize={PageSize}
  setPageSize={setPageSize}
          openEmployeeDetailsDrawerHandler={openEmployeeDetailsDrawerHandler}
          openUpdateEmployeeDrawerHandler={openUpdateEmployeeDrawerHandler}
          isLoadingEmployees={isLoadingEmployees}
        />
      </div>
    </div>
  
  );
};

export default Employees;
