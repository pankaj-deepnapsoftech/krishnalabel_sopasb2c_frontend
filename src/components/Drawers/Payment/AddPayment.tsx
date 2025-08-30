import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  useCreatePaymentMutation
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { socket } from '../../../socket';
interface AddPayment {
  closeDrawerHandler: () => void;
  id: string | undefined;
}

const AddPayment: React.FC<AddPayment> = ({ closeDrawerHandler, id }) => {
  const [cookies] = useCookies();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [invoice, setInvoice] = useState<string | undefined>();
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

  const [addPayment] = useCreatePaymentMutation();

  const addPaymentHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if((invoiceBalance || 0) < (amount || 0)){
      toast.error('Amount must be less than the balance amount');
      return;
    }

    const data = {
      amount: amount,
      description: description,
      mode: mode?.value,
      invoice: invoice,
    };

    try {
      setIsAdding(true);
      const response = await addPayment(data).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      socket.emit('notificationdatachange', true);
      closeDrawerHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  const fetchInvoiceDetails = async (id: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `invoice/${id}`,
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
      setInvoice(data.invoice._id);
      setInvoiceTotal(data.invoice.total);
      setInvoiceBalance(data.invoice.balance);
    } catch (error: any) {
      toast.error(error.messsage || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchInvoiceDetails(id || "");
  }, [id]);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
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
          <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
            Add New Payment
          </h2>

          <div>
            <h2 className="text-xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
              Invoice Details
            </h2>
            <p className="mt-1"><span className="font-bold">Total</span>: ₹ {invoiceTotal}/-</p>
            <p className="mt-1"><span className="font-bold">Balance</span>: ₹ {invoiceBalance}/-</p>
          </div>

          <form onSubmit={addPaymentHandler}>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Amount</FormLabel>
              <Input
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
                type="number"
                placeholder="Amount"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Description</FormLabel>
              <Input
                value={description}
                className="no-scrollbar"
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Description"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Mode</FormLabel>
              <Select
                options={modeOptions}
                value={mode}
                onChange={(e: any) => setMode(e)}
                required={true}
              />
            </FormControl>
            <Button
              isLoading={isAdding}
              type="submit"
              className="mt-1"
              color="white"
              backgroundColor="#319795"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AddPayment;
