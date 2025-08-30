import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useUpdatePaymentMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

interface UpdatePayment {
  closeDrawerHandler: () => void;
  fetchPaymentsHandler: () => void;
  id: string | undefined;
}

const UpdatePayment: React.FC<UpdatePayment> = ({
  closeDrawerHandler,
  fetchPaymentsHandler,
  id,
}) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [paymentId, setPaymentId] = useState<string | undefined>();
  const [mode, setMode] = useState<
    { value: string; label: string } | undefined
  >();
  const [invoiceTotal, setInvoiceTotal] = useState<number | undefined>();
  const [invoiceBalance, setInvoiceBalance] = useState<number | undefined>();

  const modeOptions = [
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "NEFT", label: "NEFT" },
    { value: "RTGS", label: "RTGS" },
    { value: "Cheque", label: "Cheque" },
  ];

  const [updatePayment] = useUpdatePaymentMutation();

  const updatePaymentHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((invoiceBalance || 0) < (amount || 0)) {
      toast.error("Amount must be less than the balance amount");
      return;
    }

    const data = {
      _id: paymentId,
      amount: amount,
      description: description,
      mode: mode?.value,
    };

    try {
      setIsUpdating(true);
      const response = await updatePayment(data).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      closeDrawerHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchPaymentDetails = async (id: string) => {
    try {
      setIsLoading(true);
      // @ts-ignore
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `payment/${id}`,
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
      setInvoiceBalance(data.payment.invoice.balance);
      setInvoiceTotal(data.payment.invoice.total);
      setPaymentId(data.payment._id);
      setMode({ value: data.payment.mode, label: data.payment.mode });
      setDescription(data.payment?.description);
      setAmount(data.payment.amount);
    } catch (error: any) {
      toast.error(error.messsage || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails(id || "");
  }, [id]);

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
          Payment
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-bold text-white py-5 text-center mb-6 border-y bg-teal-500">
            Edit Payment
          </h2>

          <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-2xl  font-semibold text-center text-gray-700">
                Invoice Details
              </h2>
              <p className="mt-4 text-lg text-green-800">
                <span className="font-bold text-gray-900">Total</span>: ₹{" "}
                {invoiceTotal}/-
              </p>
              <p className="mt-2 text-lg text-red-500">
                <span className="font-bold text-gray-900">Balance</span>: ₹{" "}
                {invoiceBalance}/-
              </p>
            </div>

            <form onSubmit={updatePaymentHandler}>
              <div className="space-y-5">
                <FormControl className="mb-5" isRequired>
                  <FormLabel
                    fontWeight="bold"
                    className="text-lg text-gray-700"
                  >
                    Amount
                  </FormLabel>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(+e.target.value)}
                    type="number"
                    placeholder="Enter amount"
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>

                <FormControl className="mb-5">
                  <FormLabel
                    fontWeight="bold"
                    className="text-lg text-gray-700"
                  >
                    Description
                  </FormLabel>
                  <Input
                    value={description}
                    className="no-scrollbar p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    placeholder="Enter description"
                  />
                </FormControl>

                <FormControl className="mb-5" isRequired>
                  <FormLabel
                    fontWeight="bold"
                    className="text-lg text-gray-700"
                  >
                    Mode
                  </FormLabel>
                  <Select
                    options={modeOptions}
                    value={mode}
                    onChange={(e: any) => setMode(e)}
                    required={true}
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>

                <Button
                  isLoading={isUpdating}
                  backgroundColor="#14b8a6"
                color="#ffffff"
                type="submit"
                _hover={{backgroundColor:"#0d9488"}}
                className="mt-5 w-full py-3 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default UpdatePayment;