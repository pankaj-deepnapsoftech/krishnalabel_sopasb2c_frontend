import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BiX } from "react-icons/bi";
import { toast } from "react-toastify";
import Loading from "../../../ui/Loading";
import Drawer from "../../../ui/Drawer";

interface EmployeeDetailsProps {
  closeDrawerHandler: () => void;
  employeeId: string | undefined;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  closeDrawerHandler,
  employeeId,
}) => {
  const [cookies] = useCookies();
  const [isLoadingEmployee, setIsLoadingEmployee] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string | undefined>();
  const [lastname, setLastname] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [role, setRole] = useState<any | undefined>();
  const [isSuper, setIsSuper] = useState<boolean | undefined>();
  const [isVerified, setIsVerified] = useState<string | undefined>();

  const fetchUserDetailsHandler = async () => {
    try {
      setIsLoadingEmployee(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `auth/user/${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          }
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
    } finally{
      setIsLoadingEmployee(false);
    }
  };

  useEffect(() => {
    fetchUserDetailsHandler();
  }, []);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[50vw] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Employee
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-bold text-white py-5 text-center mb-6 border-y bg-teal-500">
            Employee Details
          </h2>

          {isLoadingEmployee && <Loading />}
          {!isLoadingEmployee && (
           <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
           <div className="space-y-6">
             <div className="flex justify-between items-center border-b pb-4">
               <p className="font-semibold text-lg text-gray-700">First Name</p>
               <p className="text-gray-600">{firstname}</p>
             </div>
             <div className="flex justify-between items-center border-b pb-4">
               <p className="font-semibold text-lg text-gray-700">Last Name</p>
               <p className="text-gray-600">{lastname}</p>
             </div>
             <div className="flex justify-between items-center border-b pb-4">
               <p className="font-semibold text-lg text-gray-700">Email</p>
               <p className="text-gray-600">{email}</p>
             </div>
             <div className="flex justify-between items-center border-b pb-4">
               <p className="font-semibold text-lg text-gray-700">Phone</p>
               <p className="text-gray-600">{phone}</p>
             </div>
             <div className="flex justify-between items-center border-b pb-4">
               <p className="font-semibold text-lg text-gray-700">Is Verified</p>
               <p className={`text-${isVerified ? 'green' : 'red'}-600`}>
                 {isVerified ? 'Verified' : 'Not Verified'}
               </p>
             </div>
             <div className="flex justify-between items-center border-b pb-4">
               <p className="font-semibold text-lg text-gray-700">Role</p>
               <p className="text-gray-600">{(isSuper && 'Super Admin') || role?.role || 'N/A'}</p>
             </div>
             <div className="flex justify-between items-start border-b pb-4">
               <p className="font-semibold text-lg text-gray-700">Permissions</p>
               <div>
                 {!role?.permissions ? (
                   <p className="text-gray-600">N/A</p>
                 ) : (
                   <ul className="pl-5 text-gray-600">
                     {role.permissions.map((permission: any, index: number) => (
                       <li key={index} className="list-disc">{permission}</li>
                     ))}
                   </ul>
                 )}
               </div>
             </div>
           </div>
         </div>
         
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default EmployeeDetails;