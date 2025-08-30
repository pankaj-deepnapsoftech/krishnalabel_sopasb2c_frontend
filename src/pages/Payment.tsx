import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PaymentTable from "../components/Table/PaymentTable";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closePaymentDetailsDrawer,
  closeUpdatePaymentDrawer,
  openPaymentDetailsDrawer,
  openUpdatePaymentDrawer,
} from "../redux/reducers/drawersSlice";
import PaymentDetails from "../components/Drawers/Payment/PaymentDetails";
import UpdatePayment from "../components/Drawers/Payment/UpdatePayment";

const Payment: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale & purchase");
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(false);
  const [cookies] = useCookies();
  const dispatch = useDispatch();
  const { isUpdatePaymentDrawerOpened, isPaymentDetailsDrawerOpened } =
    useSelector((state: any) => state.drawers);
  const [id, setId] = useState<string | undefined>();

  const fetchPaymentsHandler = async () => {
    try {
      setIsLoadingPayments(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "payment/all",
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
      setData(data.payments);
      setFilteredData(data.payments);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const openPaymentDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openPaymentDetailsDrawer());
  };
  const closePaymentDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(closePaymentDetailsDrawer());
  };

  const openPaymentUpdateDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openUpdatePaymentDrawer());
  };
  const closePaymentUpdateDrawerHandler = () => {
    setId(id);
    dispatch(closeUpdatePaymentDrawer());
  };

  useEffect(() => {
    fetchPaymentsHandler();
  }, []);

  useEffect(()=>{
    const searchText = searchKey?.toLowerCase();
    const results = data.filter(
      (p: any) =>
        p.creator.first_name?.toLowerCase()?.includes(searchText) ||
        p?.creator?.last_name?.toLowerCase()?.includes(searchText) ||
        p?.amount?.toString()?.toLowerCase()?.includes(searchText) ||
        p?.mode?.toLowerCase()?.includes(searchText) ||
        p?.supplier?.name?.toLowerCase()?.includes(searchText) ||
        p?.buyer?.name?.toLowerCase()?.includes(searchText) ||
        (p?.createdAt &&
          new Date(p?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchText?.replaceAll("/", "") || "")) ||
        (p?.updatedAt &&
          new Date(p?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchText?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey])

  if(!isAllowed){
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div>
      {isPaymentDetailsDrawerOpened && (
        <PaymentDetails
          closeDrawerHandler={closePaymentDetailsDrawerHandler}
          id={id}
        />
      )}
      {isUpdatePaymentDrawerOpened && (
        <UpdatePayment
          closeDrawerHandler={closePaymentUpdateDrawerHandler}
          id={id}
          fetchPaymentsHandler={fetchPaymentsHandler}
        />
      )}

      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-start mb-2">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Payments
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
            onClick={fetchPaymentsHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#319795"
            borderColor="#319795"
            variant="outline"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div>
        <PaymentTable
          isLoadingPayments={isLoadingPayments}
          payments={filteredData}
          payment={filteredData}
          openPaymentDetailsDrawerHandler={openPaymentDetailsDrawerHandler}
          openUpdatePaymentDrawer={openPaymentUpdateDrawerHandler}
        />
      </div>
    </div>
  );
};

export default Payment;
