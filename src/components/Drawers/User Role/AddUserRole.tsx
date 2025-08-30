import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useState } from "react";
import Select from "react-select";
import {
  useAddRoleMutation
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { socket } from '../../../socket';
interface AddUserRoleProps {
  fetchUserRolesHandler: () => void;
  closeDrawerHandler: () => void;
}

const AddUserRole: React.FC<AddUserRoleProps> = ({
  closeDrawerHandler,
  fetchUserRolesHandler,
}) => {
  const [cookies, setCookie] = useCookies();
  const [isAddingRole, setIsAddingRole] = useState<boolean>(false);
  const [role, setRole] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [permissions, setPermissions] = useState<{value: string, label: string}[]>([]);

  const permissionOptions = [
    {value: "inventory", label: "inventory"},
    {value: "store", label: "store"},
    {value: "approval", label: "approval"},
    {value: "agent", label: "agent"},
    {value: "production", label: "production"},
    {value: "sale & purchase", label: "sale & purchase"},
    {value: "customer", label: "Customer"},
    {value: "sales", label: "sales"},
    {value: "task", label: "task"},
    {value: "dispatch", label: "dispatch"},
    {value: "bom", label: "bom"},
  ];

  const [addRole] = useAddRoleMutation();

  const addRoleHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !role ||
      role.trim().length === 0
    ) {
      toast.error("Please provide all the required fields");
      return;
    }
    if (permissions.length === 0) {
      toast.error("Select atleast 1 permission");
      return;
    }
    const modifiedPermissions = permissions.map((permission: any) => permission.value);

    try {
      setIsAddingRole(true);
      const response = await addRole({
        role,
        description,
        permissions: modifiedPermissions
      }).unwrap();
      
      toast.success(response.message);
      socket.emit('notificationdatachange', true);
      fetchUserRolesHandler();
      closeDrawerHandler();
    } catch (error: any) {
      console.log(error);
      
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setIsAddingRole(false);
    }
  };




  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[60vw] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} className="cursor-pointer" size="26px" />
          User Role
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-bold text-white py-5 text-center mb-6 border-y bg-teal-500">
            Add New Role
          </h2>

          <form onSubmit={addRoleHandler}
          className="max-w-4xl mx-auto p-8 bg-white space-y-5">
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Role</FormLabel>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                type="text"
                placeholder="Role"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Description"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Permissions</FormLabel>
              <Select
                required
                className="rounded mt-2 border border-[#a9a9a9]"
                options={permissionOptions}
                placeholder="Select"
                value={permissions}
                name="item_name"
                onChange={(d: any) => {
                  setPermissions(d);
                }}
                isMulti
              />
            </FormControl>
            <Button
              isLoading={isAddingRole}
              backgroundColor="#0d9488"
              color="#ffffff"
              type="submit"
              _hover={{backgroundColor:"#14b8a6"}}
              className="mt-5 w-full py-3  text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AddUserRole;