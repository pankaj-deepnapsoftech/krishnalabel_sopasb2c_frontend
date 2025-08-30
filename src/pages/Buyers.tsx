import { Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import AgentTable from "../components/Table/AgentTable";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddBuyerDrawer,
  closeBuyerDetailsDrawer,
  closeUpdateBuyerDrawer,
  openAddBuyerDrawer,
  openBuyerDetailsDrawer,
  openUpdateBuyerDrawer,
} from "../redux/reducers/drawersSlice";
import SampleCSV from "../assets/csv/agent-sample.csv";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AddBuyer from "../components/Drawers/Buyer/AddBuyer";
import UpdateBuyer from "../components/Drawers/Buyer/UpdateBuyer";
import {
  useAgentBulKUploadMutation,
  useDeleteAgentMutation,
} from "../redux/api/api";
import BuyerDetails from "../components/Drawers/Buyer/BuyerDetails";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { MainColor } from "../constants/constants";

const Buyers: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("agent");
  const [cookies] = useCookies();
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [buyerId, setBuyerId] = useState<string | undefined>();
  const [isLoadingBuyers, setIsLoadingBuyers] = useState<boolean>(false);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<any[]>([]);
  const [PageSize, setPageSize] = useState<number>(10);
  const {
    isAddBuyerDrawerOpened,
    isUpdateBuyerDrawerOpened,
    isBuyerDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const [deleteBuyer] = useDeleteAgentMutation();
  const [bulkUpload] = useAgentBulKUploadMutation();

  const openAddBuyerDrawerHandler = () => {
    dispatch(openAddBuyerDrawer());
  };
  const closeAddBuyerDrawerHandler = () => {
    dispatch(closeAddBuyerDrawer());
  };
  const openUpdateBuyerDrawerHandler = (id: string) => {
    setBuyerId(id);
    dispatch(openUpdateBuyerDrawer());
  };
  const closeUpdateBuyerDrawerHandler = () => {
    dispatch(closeUpdateBuyerDrawer());
  };
  const openBuyerDetailsDrawerHandler = (id: string) => {
    setBuyerId(id);
    dispatch(openBuyerDetailsDrawer());
  };
  const closeBuyerDetailsDrawerHandler = () => {
    dispatch(closeBuyerDetailsDrawer());
  };

  const fetchBuyersHandler = async () => {
    try {
      setIsLoadingBuyers(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/buyers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data?.success) {
        throw new Error(data?.message);
      }
      setBuyers(data?.agents);
      setFilteredBuyers(data?.agents);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBuyers(false);
    }
  };

  const deleteBuyerHandler = async (id: string) => {
    try {
      const response = await deleteBuyer(id).unwrap();
      toast.success(response.message);
      fetchBuyersHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingBuyers(false);
    }
  };

  const bulkUploadHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const file = fileRef?.current?.files?.[0];
    if (!file) {
      toast.error("CSV file not selected");
      return;
    }

    try {
      setBulkUploading(true);
      const formData = new FormData();
      formData?.append("excel", file);

      const response = await bulkUpload(formData).unwrap();
      toast.success(response?.message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setBulkUploading(false);
    }
  };

  useEffect(() => {
    fetchBuyersHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = buyers.filter(
      (buyer: any) =>
        buyer?.name?.toLowerCase()?.includes(searchTxt) ||
        buyer?.email?.toLowerCase()?.includes(searchTxt) ||
        buyer?.phone?.toLowerCase()?.includes(searchTxt) ||
        buyer?.gst_number?.toLowerCase()?.includes(searchTxt) ||
        buyer?.company_name?.toLowerCase().includes(searchTxt) ||
        buyer?.company_email?.toLowerCase().includes(searchTxt) ||
        buyer?.company_phone?.toLowerCase().includes(searchTxt) ||
        buyer?.address_line1?.toLowerCase().includes(searchTxt) ||
        buyer?.address_line2?.toLowerCase()?.includes(searchTxt) ||
        buyer?.pincode?.toLowerCase()?.includes(searchTxt) ||
        buyer?.city?.toLowerCase().includes(searchTxt) ||
        buyer?.state?.toLowerCase().includes(searchTxt) ||
        (buyer?.createdAt &&
          new Date(buyer?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (buyer?.updatedAt &&
          new Date(buyer?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredBuyers(results);
  }, [searchKey]);
  
  if(!isAllowed){
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <>
   
      {/* Add Buyer Drawer */}
      {isAddBuyerDrawerOpened && (
        <AddBuyer
          fetchBuyersHandler={fetchBuyersHandler}
          closeDrawerHandler={closeAddBuyerDrawerHandler}
        />
      )}
      {/* Update Buyer Drawer */}
      {isUpdateBuyerDrawerOpened && (
        <UpdateBuyer
          buyerId={buyerId}
          closeDrawerHandler={closeUpdateBuyerDrawerHandler}
          fetchBuyersHandler={fetchBuyersHandler}
        />
      )}
      {/* Buyer Details Drawer */}
      {isBuyerDetailsDrawerOpened && (
        <BuyerDetails
          buyerId={buyerId}
          closeDrawerHandler={closeBuyerDetailsDrawerHandler}
        />
      )}
        
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
        Buyers
      </div>
      {/* Stores Page */}
      <div className="w-full flex flex-col md:flex-row md:items-start gap-4 pb-4">
        {/* Search Box */}
        <div className="w-full">
          <textarea
            className="rounded-[10px] w-full px-3 py-2 text-sm border resize-none border-[#0d9488] focus:outline-[#14b8a6] hover:outline-[#14b8a6] transition"
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>

        {/* Action Buttons and Upload */}
        <div className="w-full md:w-auto flex flex-wrap md:flex-nowrap gap-4">
          {/* Add New Buyer */}
          <Button
            fontSize="14px"
            paddingX="12px"
            paddingY="8px"
           
            width={{ base: "100%", md: "200px" }}
            onClick={openAddBuyerDrawerHandler}
            color="#ffffff"
            backgroundColor={MainColor}
            _hover={{ backgroundColor: "#14b8a6" }}
            className="text-white rounded-lg"
          >
            Add New Buyer
          </Button>

          {/* Bulk Upload */}
          <div className="w-full md:w-[200px] relative">
            <Button
              fontSize="14px"
              paddingX="12px"
              paddingY="8px"
              width="full"
              onClick={() => setShowBulkUploadMenu(true)}
              color="#ffffff"
              backgroundColor={MainColor}
              _hover={{ backgroundColor: "#14b8a6" }}
              className="text-white rounded-lg"
              rightIcon={<AiFillFileExcel size={22} />}
            >
              Bulk Upload
            </Button>

            {showBulkUploadMenu && (
              <div className="mt-2 border border-[#a9a9a9] rounded p-3 bg-white shadow-md z-10">
                <form>
                  <FormControl>
                    <FormLabel fontWeight="bold">Choose File (.csv)</FormLabel>
                    <Input
                      ref={fileRef}
                      type="file"
                      accept=".csv, .xlsx"
                      className="border border-gray-300 py-1"
                    />
                  </FormControl>

                  <div className="flex gap-2 mt-2">
                    <Button
                      type="submit"
                      onClick={bulkUploadHandler}
                      isLoading={bulkUploading}
                      fontSize="14px"
                      className="bg-[#14b8a6] text-white"
                      rightIcon={<AiFillFileExcel size={22} />}
                    >
                      Upload
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowBulkUploadMenu(false)}
                      fontSize="14px"
                      className="bg-red-500 text-white"
                      rightIcon={<RxCross2 size={22} />}
                    >
                      Close
                    </Button>
                  </div>

                  <a href={SampleCSV} className="block mt-2">
                    <Button
                      type="button"
                      fontSize="14px"
                      width="full"
                      className="bg-[#14b8a6] text-white"
                      rightIcon={<AiFillFileExcel size={22} />}
                    >
                      Sample CSV
                    </Button>
                  </a>
                </form>
              </div>
            )}
          </div>

          {/* Refresh */}
          <Button
            fontSize="14px"
            paddingX="12px"
            paddingY="8px"
            width={{ base: "100%", md: "100px" }}
            onClick={fetchBuyersHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#319795"
            borderColor="#319795"
            variant="outline"
          >
            Refresh
          </Button>

          {/* Page Size Select */}
          <Select
            width={{ base: "100%", md: "100px" }}
            onChange={(e) => setPageSize(Number(e.target.value))}
         
            fontSize="14px"
            className="mt-1 md:mt-0"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={100000}>All</option>
          </Select>
        </div>
      </div>

      <div>
        <AgentTable
          pageSize={PageSize}
          setPageSize={setPageSize}
          agents={filteredBuyers}
          openUpdateAgentDrawerHandler={openUpdateBuyerDrawerHandler}
          openAgentDetailsDrawerHandler={openBuyerDetailsDrawerHandler}
          isLoadingAgents={isLoadingBuyers}
          deleteAgentHandler={deleteBuyerHandler}
        />
      </div>
      </>
  );
};

export default Buyers;
