import { toast } from "react-toastify";
import Drawer from "../../../ui/Drawer";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import Loading from "../../../ui/Loading";
import { BiX } from "react-icons/bi";

interface PaymentDetailsProps {
  closeDrawerHandler: (id: string) => void;
  id: string | undefined;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  closeDrawerHandler,
  id,
}) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invoiceNo, setInvoiceNo] = useState<string | undefined>();
  const [mode, setMode] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();

  const fetchPaymentDetails = async (id: string) => {
    try {
      setIsLoading(true);
      // @ts-ignore
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + `payment/${id}`,
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
      setInvoiceNo(data.payment.invoice.invoice_no);
      setMode(data.payment.mode);
      setDescription(data.payment?.description);
      setAmount(data.payment.amount);
    } catch (error: any) {
      toast.error(error.messsage || "Something went wrong");
    } finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails(id || "");
  }, [id]);

  return (
    // @ts-ignore
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[50vw] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          { /* @ts-ignore */ }
          <BiX onClick={closeDrawerHandler} size="26px" />
          Payment
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-bold text-white py-5 text-center mb-6 border-y bg-teal-500">
            Payment Details
          </h2>

          {isLoading && <Loading />}
          {!isLoading && (
           <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
           <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <p className="text-lg font-semibold text-gray-700">Invoice No.</p>
                 <p className="text-gray-500">{invoiceNo}</p>
               </div>
               <div>
                 <p className="text-lg font-semibold text-gray-700">Amount</p>
                 <p className="text-gray-500">₹ {amount}/-</p>
               </div>
             </div>
         
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <p className="text-lg font-semibold text-gray-700">Mode</p>
                 <p className="text-gray-500">{mode}</p>
               </div>
               <div>
                 <p className="text-lg font-semibold text-gray-700">Description</p>
                 <p className="text-gray-500">{description || 'N/A'}</p>
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

export default PaymentDetails;