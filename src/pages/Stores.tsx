import { Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import SampleCSV from "../assets/csv/store-sample.csv";
import {
  closeAddStoreDrawer,
  closeStoreDetailsDrawer,
  closeUpdateStoreDrawer,
  openAddStoreDrawer,
  openStoreDetailsDrawer,
  openUpdateStoreDrawer,
} from "../redux/reducers/drawersSlice";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import StoreTable from "../components/Table/StoreTable";
import AddStore from "../components/Drawers/Store/AddStore";
import StoreDetails from "../components/Drawers/Store/StoreDetails";
import UpdateStore from "../components/Drawers/Store/UpdateStore";
import {
  useDeleteStoresMutation,
  useStoreBulKUploadMutation,
} from "../redux/api/api";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { MainColor } from "../constants/constants";

const Stores: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("store");
  const [isLoadingStores, setIsLoadingStores] = useState<boolean>(false);
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [storeId, setStoreId] = useState<string | undefined>(); // Store Id to be updated or deleted
  const [stores, setStores] = useState<any>([]);
  const [filteredStores, setFilteredStores] = useState<any>([]);
  const [PageSize, setPageSize] = useState<number>(10);
  const {
    isAddStoreDrawerOpened,
    isUpdateStoreDrawerOpened,
    isStoreDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();
  const [cookies] = useCookies();

  const [deleteStore] = useDeleteStoresMutation();
  const [bulkUpload] = useStoreBulKUploadMutation();

  const openAddStoreDrawerHandler = () => {
    dispatch(openAddStoreDrawer());
  };

  const closeAddStoreDrawerHandler = () => {
    dispatch(closeAddStoreDrawer());
  };

  const openUpdateStoreDrawerHandler = (id: string) => {
    setStoreId(id);
    dispatch(openUpdateStoreDrawer());
  };

  const closeUpdateStoreDrawerHandler = () => {
    dispatch(closeUpdateStoreDrawer());
  };

  const openStoreDetailsDrawerHandler = (id: string) => {
    setStoreId(id);
    dispatch(openStoreDetailsDrawer());
  };

  const closeStoreDetailsDrawerHandler = () => {
    dispatch(closeStoreDetailsDrawer());
  };

  const fetchStoresHandler = async () => {
    try {
      setIsLoadingStores(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "store/all",
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
      setStores(data.stores);
      setFilteredStores(data.stores);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsLoadingStores(false);
    }
  };

  const deleteStoreHandler = async (id: string) => {
    try {
      const response = await deleteStore(id).unwrap();
      toast.success(response.message);
      fetchStoresHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
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
    fetchStoresHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = stores.filter(
      (st: any) =>
        st.name?.toLowerCase()?.includes(searchTxt) ||
        st.gst_number?.toLowerCase()?.includes(searchTxt) ||
        st.address_line1
          ?.toString()
          ?.toLowerCase()
          ?.toString()
          .includes(searchTxt) ||
        st.address_line2?.toLowerCase()?.includes(searchTxt) ||
        st.pincode?.toString().toString().includes(searchTxt) ||
        st?.city?.toString()?.includes(searchTxt) ||
        st?.state?.toString()?.includes(searchTxt) ||
        (st?.createdAt &&
          new Date(st?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (st?.updatedAt &&
          new Date(st?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredStores(results);
  }, [searchKey]);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div>
        {/* Add Store Drawer */}
        {isAddStoreDrawerOpened && (
          <AddStore
            fetchStoresHandler={fetchStoresHandler}
            closeDrawerHandler={closeAddStoreDrawerHandler}
          />
        )}
        {/* Update Store Drawer */}
        {isUpdateStoreDrawerOpened && (
          <UpdateStore
            storeId={storeId}
            fetchStoresHandler={fetchStoresHandler}
            closeDrawerHandler={closeUpdateStoreDrawerHandler}
          />
        )}
        {/* Store Details Drawer */}
        {isStoreDetailsDrawerOpened && (
          <StoreDetails
            storeId={storeId}
            closeDrawerHandler={closeStoreDetailsDrawerHandler}
          />
        )}
      {/* Stores Page */}
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
        Stores
      </div>
      {/* Stores Page */}
   <div className="w-full flex flex-col md:flex-row md:items-center gap-4 md:gap-6 pb-2">
  {/* Search textarea: full width always, flex-grow on desktop */}
  <div className="w-full">
    <textarea
      rows={1}
      placeholder="Search"
      value={searchKey}
      onChange={(e) => setSearchKey(e.target.value)}
      className="rounded-[10px] w-full  px-2 py-2 md:px-3 md:py-2 text-sm resize-none border border-[#0d9488] focus:outline-[#14b8a6] hover:outline-[#14b8a6] transition max-h-12"
    />
  </div>

  {/* Buttons + select container */}
  <div className="flex flex-wrap gap-4 md:flex-nowrap md:items-center md:justify-end w-full ">
    <Button
      onClick={openAddStoreDrawerHandler}
      color="#ffffff"
      backgroundColor={MainColor}
      _hover={{ backgroundColor: "#14b8a6" }}
      className="py-3 rounded-lg text-white w-full  whitespace-nowrap"
      fontSize={{ base: "14px", md: "14px" }}
      paddingX={{ base: "10px", md: "12px" }}
      paddingY={{ base: "0", md: "3px" }}
    >
      Add New Store
    </Button>

    <div className="w-full md:w-[200px] relative">
      <Button
        onClick={() => setShowBulkUploadMenu(true)}
        color="#ffffff"
        backgroundColor={MainColor}
        _hover={{ backgroundColor: "#14b8a6" }}
        className="py-3 rounded-lg text-white w-full whitespace-nowrap"
        fontSize={{ base: "14px", md: "14px" }}
        paddingX={{ base: "10px", md: "12px" }}
        paddingY={{ base: "0", md: "3px" }}
        rightIcon={<AiFillFileExcel size={22} />}
      >
        Bulk Upload
      </Button>

      {showBulkUploadMenu && (
        <div className="absolute z-10 mt-1 w-full border border-[#a9a9a9] rounded p-1 bg-white shadow-lg">
          <form>
            <FormControl>
              <FormLabel fontWeight="bold" htmlFor="bulk-file">
                Choose File (.csv)
              </FormLabel>
              <Input
                id="bulk-file"
                ref={fileRef}
                type="file"
                accept=".csv, .xlsx"
                borderWidth={1}
                borderColor={"#a9a9a9"}
                paddingTop={1}
              />
            </FormControl>

            <div className="flex gap-2 mt-3 flex-wrap">
              <Button
                type="submit"
                onClick={bulkUploadHandler}
                color="white"
                backgroundColor={MainColor}
                rightIcon={<AiFillFileExcel size={22} />}
                isLoading={bulkUploading}
                fontSize="sm"
              >
                Upload
              </Button>

              <Button
                type="button"
                onClick={() => setShowBulkUploadMenu(false)}
                color="white"
                backgroundColor={MainColor}
                rightIcon={<RxCross2 size={22} />}
                fontSize="sm"
              >
                Close
              </Button>
            </div>

            <a href={SampleCSV} className="block mt-3">
              <Button
                type="button"
                color="white"
                backgroundColor={MainColor}
                rightIcon={<AiFillFileExcel size={22} />}
                fontSize="sm"
                w="full"
              >
                Sample CSV
              </Button>
            </a>
          </form>
        </div>
      )}
    </div>

    <Button
      onClick={fetchStoresHandler}
      leftIcon={<MdOutlineRefresh />}
      variant="outline"
      color="#319795"
      borderColor="#319795"
      className="py-3 rounded-lg w-full whitespace-nowrap"
      fontSize={{ base: "14px", md: "14px" }}
      paddingX={{ base: "10px", md: "12px" }}
      paddingY={{ base: "0", md: "3px" }}
    >
      Refresh
    </Button>

    <Select
      onChange={(e) => setPageSize(Number(e.target.value))}
      className=""
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
          <StoreTable
            stores={filteredStores}
            pageSize={PageSize}
        setPageSize={setPageSize}
            isLoadingStores={isLoadingStores}
            deleteStoreHandler={deleteStoreHandler}
            openStoreDetailsDrawerHandler={openStoreDetailsDrawerHandler}
            openUpdateStoreDrawerHandler={openUpdateStoreDrawerHandler}
          />
        </div>
      </div>
  );
};

export default Stores;
