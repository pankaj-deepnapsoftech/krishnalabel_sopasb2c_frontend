import { Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AgentTable from "../components/Table/AgentTable";
import {
  closeAddSellerDrawer,
  closeSellerDetailsDrawer,
  closeUpdateSellerDrawer,
  openAddSellerDrawer,
  openSellerDetailsDrawer,
  openUpdateSellerDrawer,
} from "../redux/reducers/drawersSlice";
import SampleCSV from "../assets/csv/agent-sample.csv";
import AddSeller from "../components/Drawers/Seller/AddSeller";
import UpdateSeller from "../components/Drawers/Seller/UpdateSeller";
import {
  useAgentBulKUploadMutation,
  useDeleteAgentMutation,
} from "../redux/api/api";
import SellerDetails from "../components/Drawers/Seller/SellerDetails";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { MainColor } from "../constants/constants";

const Sellers: React.FC = () => {
  const [sellerId, setSellerId] = useState<string | undefined>();
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isSellersLoading, setIsSellersLoading] = useState<boolean>(false);
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [sellers, setSellers] = useState<any[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<any[]>([]);
  const [PageSize, setPageSize] = useState<number>(10);
  const dispatch = useDispatch();
  const {
    isAddSellerDrawerOpened,
    isUpdateSellerDrawerOpened,
    isSellerDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);

  const [deleteSeller] = useDeleteAgentMutation();
  const [bulkUpload] = useAgentBulKUploadMutation();

  const openAddSellerDrawerHandler = () => {
    dispatch(openAddSellerDrawer());
  };
  const closeAddSellerDrawerHandler = () => {
    dispatch(closeAddSellerDrawer());
  };
  const openUpdateSellerDrawerHandler = (id: string) => {
    setSellerId(id);
    dispatch(openUpdateSellerDrawer());
  };
  const closeUpdateSellerDrawerHandler = () => {
    dispatch(closeUpdateSellerDrawer());
  };
  const openSellerDetailsDrawerHandler = (id: string) => {
    setSellerId(id);
    dispatch(openSellerDetailsDrawer());
  };
  const closeSellerDetailsDrawerHandler = () => {
    dispatch(closeSellerDetailsDrawer());
  };

  const deleteSellerHandler = async (id: string) => {
    try {
      const response = await deleteSeller(id).unwrap();
      toast.success(response.message);
      fetchSellersHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchSellersHandler = async () => {
    try {
      setIsSellersLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/suppliers",
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
      setSellers(data.agents);
      setFilteredSellers(data.agents);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsSellersLoading(false);
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
      formData.append("excel", file);

      const response = await bulkUpload(formData).unwrap();
      toast.success(response.message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setBulkUploading(false);
    }
  };

  useEffect(() => {
    fetchSellersHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = sellers.filter(
      (seller: any) =>
        seller.name?.toLowerCase()?.includes(searchTxt) ||
        seller.email?.toLowerCase()?.includes(searchTxt) ||
        seller.phone?.toLowerCase()?.includes(searchTxt) ||
        seller?.gst_number?.toLowerCase()?.includes(searchTxt) ||
        seller.company_name.toLowerCase().includes(searchTxt) ||
        seller.company_email.toLowerCase().includes(searchTxt) ||
        seller.company_phone.toLowerCase().includes(searchTxt) ||
        seller.address_line1.toLowerCase().includes(searchTxt) ||
        seller?.address_line2?.toLowerCase()?.includes(searchTxt) ||
        seller?.pincode?.toLowerCase()?.includes(searchTxt) ||
        seller.city.toLowerCase().includes(searchTxt) ||
        seller.state.toLowerCase().includes(searchTxt) ||
        (seller?.createdAt &&
          new Date(seller?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (seller?.updatedAt &&
          new Date(seller?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredSellers(results);
  }, [searchKey]);

  return (
    <div>
      {/* Add Seller */}
      {isAddSellerDrawerOpened && (
        <AddSeller
          closeDrawerHandler={closeAddSellerDrawerHandler}
          fetchSellersHandler={fetchSellersHandler}
        />
      )}
      {/* Update Seller */}
      {isUpdateSellerDrawerOpened && (
        <UpdateSeller
          closeDrawerHandler={closeUpdateSellerDrawerHandler}
          sellerId={sellerId}
          fetchSellersHandler={fetchSellersHandler}
        />
      )}
      {/* Seller Details */}
      {isSellerDetailsDrawerOpened && (
        <SellerDetails
          sellerId={sellerId}
          closeDrawerHandler={closeSellerDetailsDrawerHandler}
        />
      )}

      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
        Suppliers
      </div>

      {/* Employees Page */}
      <div className="w-full flex flex-col gap-4 pb-2 md:grid md:grid-cols-5 md:gap-x-4">

        {/* Search Input */}
        <div className="col-span-2">
          <textarea
            className="rounded-[10px] w-full px-3 py-2 text-sm h-10 border resize-none border-[#0d9488] focus:outline-[#14b8a6] hover:outline-[#14b8a6]"
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>

        {/* Add Buyer Button */}
        <div className="col-span-1">
          <Button
            w="full"
            h="40px"
            fontSize="14px"
            onClick={openAddSellerDrawerHandler}
            backgroundColor={MainColor}
            color="white"
            _hover={{ backgroundColor: "#14b8a6" }}
            className="rounded-lg text-sm"
          >
            Add New Supplier
          </Button>
        </div>

        {/* Bulk Upload Section */}
        <div className="col-span-1 relative">
          <Button
            w="full"
            h="40px"
            fontSize="14px"
            onClick={() => setShowBulkUploadMenu(true)}
            backgroundColor={MainColor}
            color="white"
            rightIcon={<AiFillFileExcel size={22} />}
            _hover={{ backgroundColor: "#14b8a6" }}
            className="rounded-lg text-sm"
          >
            Bulk Upload
          </Button>

          {showBulkUploadMenu && (
            <div className="absolute mt-2 w-full border border-[#a9a9a9] rounded p-4 bg-white shadow-md z-10">
              <form>
                <FormControl>
                  <FormLabel fontWeight="bold">Choose File (.csv / .xlsx)</FormLabel>
                  <Input
                    ref={fileRef}
                    type="file"
                    accept=".csv, .xlsx"
                    borderWidth={1}
                    borderColor="#a9a9a9"
                    pt={1}
                  />
                </FormControl>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    type="submit"
                    isLoading={bulkUploading}
                    backgroundColor={MainColor}
                    color="white"
                    rightIcon={<AiFillFileExcel size={22} />}
                  >
                    Upload
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setShowBulkUploadMenu(false)}
                    backgroundColor={MainColor}
                    color="white"
                    rightIcon={<RxCross2 size={22} />}
                  >
                    Close
                  </Button>
                </div>

                <a href={SampleCSV} className="block mt-2">
                  <Button
                    w="full"
                    backgroundColor={MainColor}
                    color="white"
                    rightIcon={<AiFillFileExcel size={22} />}
                  >
                    Sample CSV
                  </Button>
                </a>
              </form>
            </div>
          )}
        </div>

        {/* Refresh and Page Size */}
        <div className="col-span-1 flex flex-col md:flex-row gap-2 w-full">
          <Button
            w="full"
            h="40px"
            fontSize="14px"
            onClick={fetchSellersHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#319795"
            borderColor="#319795"
            variant="outline"
            className="text-sm"
          >
            Refresh
          </Button>

          <Select
            fontSize="14px"
            className="h-10 text-sm"
            width="full"
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50, 100, 100000].map((size) => (
              <option key={size} value={size}>
                {size === 100000 ? "All" : size}
              </option>
            ))}
          </Select>
        </div>
      </div>


      <div>
        <AgentTable
          pageSize={PageSize}
          setPageSize={setPageSize}
          agents={filteredSellers}
          openUpdateAgentDrawerHandler={openUpdateSellerDrawerHandler}
          openAgentDetailsDrawerHandler={openSellerDetailsDrawerHandler}
          isLoadingAgents={isSellersLoading}
          deleteAgentHandler={deleteSellerHandler}
        />
      </div>
    </div>
  );
};

export default Sellers;
