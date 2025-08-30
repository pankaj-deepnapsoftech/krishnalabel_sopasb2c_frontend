import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useUpdateEmployeeMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../../../ui/Loading";

interface UpdateEmployeeProps {
  employeeId: string | undefined;
  fetchEmployeesHandler: () => void;
  closeDrawerHandler: () => void;
}

const UpdateEmployee: React.FC<UpdateEmployeeProps> = ({
  closeDrawerHandler,
  fetchEmployeesHandler,
  employeeId,
}) => {
  const [cookies, setCookie] = useCookies();
  const [isLoadingEmployee, setIsLoadingEmployee] = useState<boolean>(false);
  const [isUpdatingEmployee, setIsUpdatingEmployee] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string | undefined>();
  const [lastname, setLastname] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [role, setRole] = useState<any | undefined>();
  const [isSuper, setIsSuper] = useState<boolean | undefined>();
  const [isVerified, setIsVerified] = useState<string | undefined>();

  const [roleOptions, setRoleOptions] = useState<
    { value: string; label: string }[] | []
  >([]);

  const [updateEmployee] = useUpdateEmployeeMutation();

  const updateEmployeeHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role || !role?.value) {
      toast.error("Please provide all the required fields");
      return;
    }
    try {
      setIsUpdatingEmployee(true);
      const response = await updateEmployee({
        _id: employeeId,
        role: role.value,
      }).unwrap();
      toast.success(response.message);
      fetchEmployeesHandler();
      closeDrawerHandler();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setIsUpdatingEmployee(false);
    }
  };

  const fetchUserDetailsHandler = async () => {
    try {
      setIsLoadingEmployee(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `auth/user/${employeeId}`,
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
      setFirstname(data.user.first_name);
      setLastname(data.user?.last_name);
      setEmail(data.user.email);
      setPhone(data.user.phone);
      setRole(data.user?.role);
      setIsVerified(data.user.isVerified);
      setIsSuper(data.user.isSuper);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingEmployee(false);
    }
  };

  const fetchRolesHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `role/`,
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
        const roles = data.roles;
        const modifiedRoles = roles.map((role: any) => ({
            value: role._id,
            label: role.role,
        }));
      setRoleOptions(modifiedRoles);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingEmployee(false);
    }
  };

  useEffect(() => {
    fetchUserDetailsHandler();
    fetchRolesHandler();
  }, []);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[60vw] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center cursor-pointer text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Employee
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-bold text-white py-5 text-center mb-6 border-y bg-teal-500">
            Update Employee
          </h2>

          {isLoadingEmployee && <Loading />}
          {!isLoadingEmployee && (
            <form onSubmit={updateEmployeeHandler}
            className="max-w-4xl mx-auto p-8 bg-white space-y-5">
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">First Name</FormLabel>
                <p>{firstname}</p>
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">Last Name</FormLabel>
                <p>{lastname}</p>
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">Email</FormLabel>
                <p>{email}</p>
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">Phone</FormLabel>
                <p>{phone}</p>
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">Is Verified</FormLabel>
                <p className={isVerified ? 'text-green-600' : 'text-red-500'}>{isVerified ? 'Verified' : 'Not Verified'}</p>
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Role</FormLabel>
                <Select
                  required
                  value={role}
                  options={roleOptions}
                  onChange={(e: any) => setRole(e)}
                />
              </FormControl>
              <Button
                isLoading={isUpdatingEmployee}
                backgroundColor="#0d9488"
                color="#ffffff"
                type="submit"
                _hover={{backgroundColor:"#14b8a6"}}
                className="mt-5 w-full py-3  text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
              >
                Submit
              </Button>
            </form>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default UpdateEmployee;