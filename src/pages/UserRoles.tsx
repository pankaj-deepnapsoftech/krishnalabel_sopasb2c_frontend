import { Button, Select } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddRoleDrawer,
  closeRoleDetailsDrawer,
  closeUpdateRoleDrawer,
  openAddRoleDrawer,
  openRoleDetailsDrawer,
  openUpdateRoleDrawer,
} from "../redux/reducers/drawersSlice";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import UserRoleTable from "../components/Table/UserRoleTable";
import AddUserRole from "../components/Drawers/User Role/AddUserRole";
import UserRoleDetails from "../components/Drawers/User Role/UserRoleDetails";
import UpdateUserRole from "../components/Drawers/User Role/UpdateUserRole";
import { MainColor } from "../constants/constants";
import {socket} from "../socket";

const UserRole: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("user role");
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [roles, setRoles] = useState<any[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<string | undefined>();
  const [PageSize, setPageSize] = useState<number>(10);
  
  const {
    isAddRoleDrawerOpened,
    isUpdateRoleDrawerOpened,
    isRoleDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const openAddRoleDrawerHandler = () => {
    dispatch(openAddRoleDrawer());
  };
  const closeAddRoleDrawerHandler = () => {
    dispatch(closeAddRoleDrawer());
  };
  const openUpdateRoleDrawerHandler = (id: string) => {
    setRoleId(id);
    dispatch(openUpdateRoleDrawer());
  };
  const closeUpdateRoleDrawerHandler = () => {
    dispatch(closeUpdateRoleDrawer());
  };
  const openRoleDetailsDrawerHandler = (id: string) => {
    setRoleId(id);
    dispatch(openRoleDetailsDrawer());
  };
  const closeRoleDetailsDrawerHandler = () => {
    dispatch(closeRoleDetailsDrawer());
  };

  const fetchRolesHandler = async () => {
    try {
      setIsLoadingRoles(true);
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "role/");
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setRoles(data.roles);
      setFilteredRoles(data.roles);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    const handleChangesApply = (data:any) => {
      if (data === true) {
        fetchRolesHandler();
        socket.off('changesapply', handleChangesApply); // Remove listener after first call
      }
    };
    
    socket.on('changesapply', handleChangesApply);

    return () => {
      socket.off('changesapply', handleChangesApply); // Prevent duplication on rerender
    };
  });

  const deleteRoleHandler = async (id: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "role/",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: id,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      fetchRolesHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchRolesHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = roles.filter(
      (role: any) =>
        role.role?.toLowerCase()?.includes(searchTxt) ||
        role.description?.toLowerCase()?.includes(searchTxt) ||
        (role?.createdAt &&
          new Date(role?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (role?.updatedAt &&
          new Date(role?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredRoles(results);
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
      {isAddRoleDrawerOpened && (
        <AddUserRole
          fetchUserRolesHandler={fetchRolesHandler}
          closeDrawerHandler={closeAddRoleDrawerHandler}
        />
      )}
      {isRoleDetailsDrawerOpened && (
        <UserRoleDetails
          roleId={roleId}
          closeDrawerHandler={closeRoleDetailsDrawerHandler}
        />
      )}
      {isUpdateRoleDrawerOpened && (
        <UpdateUserRole
          roleId={roleId}
          closeDrawerHandler={closeUpdateRoleDrawerHandler}
          fetchUserRolesHandler={fetchRolesHandler}
        />
      )}

      {/* Header */}
      <div className="text-lg md:text-xl font-semibold pb-4">
        User Roles
      </div>

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {/* Search Bar */}
        <textarea
          className="w-full md:w-1/2 rounded-lg px-3 py-2 text-sm border border-[#0d9488] focus:outline-[#14b8a6] resize-none"
          rows={1}
          placeholder="Search"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />

        {/* Buttons and Select */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 w-full md:w-auto">
          <Button
            fontSize="14px"
            paddingX="12px"
            paddingY="6px"
            onClick={openAddRoleDrawerHandler}
            backgroundColor={MainColor}
            color="#ffffff"
            _hover={{ backgroundColor: "#14b8a6" }}
            className="rounded-lg text-sm"
          >
            Add New Role
          </Button>

          <Button
            fontSize="14px"
            paddingX="12px"
            paddingY="6px"
            onClick={fetchRolesHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#319795"
            borderColor="#319795"
            variant="outline"
            className="text-sm"
          >
            Refresh
          </Button>
          <Select
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="text-sm  focus:outline-none"
            width={{ base: "full", md: "80px" }}
                
          >
            <option   value={10}>10</option>
            <option  value={20}>20</option>
            <option  value={50}>50</option>
            <option  value={100}>100</option>
            <option  value={100000}>All</option>
          </Select>
        </div>
      </div>


      <div className="overflow-x-auto">
        <UserRoleTable
          pageSize={PageSize}
          setPageSize={setPageSize}
          roles={filteredRoles}
          isLoadingRoles={isLoadingRoles}
          deleteRoleHandler={deleteRoleHandler}
          openUpdateRoleDrawerHandler={openUpdateRoleDrawerHandler}
          openRoleDetailsDrawerHandler={openRoleDetailsDrawerHandler}
        />
      </div>
    </div>
  
  );
};

export default UserRole;
