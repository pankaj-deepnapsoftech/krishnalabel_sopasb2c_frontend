import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import Loading from "../../../ui/Loading";

interface SellerDetailsProps{
    sellerId: string | undefined,
    closeDrawerHandler: ()=>void
}

const SellerDetails: React.FC<SellerDetailsProps> = ({sellerId, closeDrawerHandler})=>{
    const [cookies] = useCookies();
    const [isLoadingSeller, setIsLoadingSeller] = useState<boolean>(false);
    const [name, setName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [phone, setPhone] = useState<string | undefined>();
    const [gst, setGst] = useState<string | undefined>();
    const [companyName, setCompanyName] = useState<string | undefined>();
    const [companyEmail, setCompanyEmail] = useState<string | undefined>();
    const [companyPhone, setCompanyPhone] = useState<string | undefined>();
    const [addressLine1, setAddressLine1] = useState<string | undefined>();
    const [addressLine2, setAddressLine2] = useState<string | undefined>();
    const [pincode, setPincode] = useState<string | undefined>();
    const [city, setCity] = useState<string | undefined>();
    const [state, setState] = useState<string | undefined>();
    
  const fetchSellerDetails = async () => {
    try {
      setIsLoadingSeller(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `agent/${sellerId}`,
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
      setName(data.agent.name);
      setEmail(data.agent.email);
      setPhone(data.agent.phone);
      setGst(data.agent?.gst_number || 'N/A');
      setCompanyName(data.agent.company_name);
      setCompanyEmail(data.agent.company_email);
      setCompanyPhone(data.agent.company_phone);
      setAddressLine1(data.agent.address_line1);
      setAddressLine2(data.agent?.address_line2 || 'N/A');
      setPincode(data.agent?.pincode || 'N/A');
      setCity(data.agent.city);
      setState(data.agent.state);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingSeller(false);
    }
  };

  useEffect(() => {
    fetchSellerDetails();
  }, []);
    return <Drawer closeDrawerHandler={closeDrawerHandler}>
    <div
      className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[50vw] bg-white right-0 top-0 z-10 py-3"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
      }}
    >
      <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
        <BiX onClick={closeDrawerHandler} size="26px" />
        Supplier
      </h1>

      <div className="mt-8 px-5">
        <h2 className="text-2xl font-bold text-white py-5 text-center mb-6 border-y bg-teal-500">
          Supplier Details
        </h2>

        {isLoadingSeller && <Loading />}
        {!isLoadingSeller && (
         <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <p className="text-lg font-semibold text-gray-700">Name</p>
             <p className="text-gray-500">{name}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">Email</p>
             <p className="text-gray-500">{email}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">Phone</p>
             <p className="text-gray-500">{phone}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">GST Number</p>
             <p className="text-gray-500">{gst}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">Company Name</p>
             <p className="text-gray-500">{companyName}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">Company Email</p>
             <p className="text-gray-500">{companyEmail}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">Company Phone</p>
             <p className="text-gray-500">{companyPhone}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">Address Line 1</p>
             <p className="text-gray-500">{addressLine1}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">Address Line 2</p>
             <p className="text-gray-500">{addressLine2}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">Pincode</p>
             <p className="text-gray-500">{pincode}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">City</p>
             <p className="text-gray-500">{city}</p>
           </div>
           <div>
             <p className="text-lg font-semibold text-gray-700">State</p>
             <p className="text-gray-500">{state}</p>
           </div>
         </div>
       </div>
       
        )}
      </div>
    </div>
  </Drawer>
}

export default SellerDetails;