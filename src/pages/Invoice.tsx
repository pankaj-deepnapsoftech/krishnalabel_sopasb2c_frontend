import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddInvoiceDrawer,
  closeAddPaymentDrawer,
  closeInvoiceDetailsDrawer,
  closeUpdateInvoiceDrawer,
  openAddInvoiceDrawer,
  openAddPaymentDrawer,
  openInvoiceDetailsDrawer,
  openUpdateInvoiceDrawer,
} from "../redux/reducers/drawersSlice";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { useDeleteInvoiceMutation } from "../redux/api/api";
import InvoiceTable from "../components/Table/InvoiceTable";
import AddInvoice from "../components/Drawers/Invoice/AddInvoice";
import InvoiceDetails from "../components/Drawers/Invoice/InvoiceDetails";
import UpdateInvoice from "../components/Drawers/Invoice/UpdateInvoice";
import AddPayment from "../components/Drawers/Payment/AddPayment";
import { MainColor } from "../constants/constants";

const Invoice: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale & purchase");
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState<boolean>(false);
  const {
    isAddInvoiceDrawerOpened,
    isUpdateInvoiceDrawerOpened,
    isInvoiceDetailsDrawerOpened,
    isAddPaymentDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();
  const [id, setId] = useState<string | undefined>();

  const [deleteInvoice] = useDeleteInvoiceMutation();

  const openAddInvoiceDrawerHandler = () => {
    dispatch(openAddInvoiceDrawer());
  };
  const closeAddInvoiceDrawerHandler = () => {
    dispatch(closeAddInvoiceDrawer());
  };

  const openInvoiceDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openInvoiceDetailsDrawer());
  };
  const closeInvoiceDetailsDrawerHandler = () => {
    dispatch(closeInvoiceDetailsDrawer());
  };

  const openInvoiceUpdateDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openUpdateInvoiceDrawer());
  };
  const closeInvoiceUpdateDrawerHandler = () => {
    dispatch(closeUpdateInvoiceDrawer());
  };

  const openAddPaymentHandler = (id: string) => {
    setId(id);
    dispatch(openAddPaymentDrawer());
  };
  const closePaymentDrawerHandler = () => {
    dispatch(closeAddPaymentDrawer());
  };

  const fetchInvoiceHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "invoice/all",
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

      setData(data.invoices);
      setFilteredData(data.invoices);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const deleteInvoiceHandler = async (id: string) => {
    try {
      const response = await deleteInvoice(id).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      fetchInvoiceHandler();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchInvoiceHandler();
  }, []);

  useEffect(() => {
    const searchText = searchKey?.toLowerCase();
    const results = data.filter(
      (i: any) =>
        i.creator.first_name?.toLowerCase()?.includes(searchText) ||
        i?.creator?.last_name?.toLowerCase()?.includes(searchText) ||
        i?.subtotal?.toString()?.toLowerCase()?.includes(searchText) ||
        i?.total?.toString()?.toLowerCase()?.includes(searchText) ||
        i?.supplier?.name?.toLowerCase()?.includes(searchText) ||
        i?.buyer?.name?.toLowerCase()?.includes(searchText) ||
        (i?.createdAt &&
          new Date(i?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchText?.replaceAll("/", "") || "")) ||
        (i?.updatedAt &&
          new Date(i?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchText?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  if(!isAllowed){
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div>
      {isAddInvoiceDrawerOpened && (
        <AddInvoice
          closeDrawerHandler={closeAddInvoiceDrawerHandler}
          fetchInvoicesHandler={fetchInvoiceHandler}
        />
      )}
      {isInvoiceDetailsDrawerOpened && (
        <InvoiceDetails
          closeDrawerHandler={closeInvoiceDetailsDrawerHandler}
          id={id}
        />
      )}
      {isUpdateInvoiceDrawerOpened && (
        <UpdateInvoice
          closeDrawerHandler={closeInvoiceUpdateDrawerHandler}
          id={id}
          fetchInvoicesHandler={fetchInvoiceHandler}
        />
      )}
      {isAddPaymentDrawerOpened && (
        <AddPayment id={id} closeDrawerHandler={closePaymentDrawerHandler} />
      )}

      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-start mb-2">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Invoices
        </div>

        <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 items-start gap-x-2 w-full md:w-fit">
          <textarea
            className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#14b8a6] hover:outline:[#14b8a6] border resize-none border-[#0d9488]"
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchInvoiceHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#319795"
            borderColor="#319795"
            variant="outline"
          >
            Refresh
          </Button>
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 200 }}
            onClick={openAddInvoiceDrawerHandler}
            color="white"
            backgroundColor={MainColor}
          >
            Add New Invoice
          </Button>
        </div>
      </div>

      <div>
        <InvoiceTable
          isLoadingInvoices={isLoadingInvoices}
          invoices={filteredData}
          deleteInvoiceHandler={deleteInvoiceHandler}
          openInvoiceDetailsHandler={openInvoiceDetailsDrawerHandler}
          openUpdateInvoiceDrawer={openInvoiceUpdateDrawerHandler}
          openPaymentDrawer={openAddPaymentHandler}
        />
      </div>
    </div>
  );
};

export default Invoice;
