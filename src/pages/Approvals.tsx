import { toast } from "react-toastify";
import {
  useDeleteAgentMutation,
  useDeleteBomMutation,
  useDeleteProductMutation,
  useDeleteStoresMutation,
  useUpdateAgentMutation,
  useUpdateBOMMutation,
  useUpdateProductMutation,
  useUpdateStoreMutation,
} from "../redux/api/api";

import {
  openBomDetailsDrawer,
  closeBomDetailsDrawer
} from "../redux/reducers/drawersSlice";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { 
  Button,
  Tabs,
  TabList,
  Tab, 
  TabPanels, 
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

  
  import {socket} from "../socket";
  
  import BomDetails from "../components/Drawers/BOM/BomDetails";
import { MdOutlineRefresh } from "react-icons/md";
import ProductTable from "../components/Table/ProductTable";
import StoreTable from "../components/Table/StoreTable";
import AgentTable from "../components/Table/AgentTable";
import BOMTable from "../components/Table/BOMTable";
import BOMRawMaterialTable from "../components/Table/BOMRawMaterialTable";
import { useDispatch, useSelector } from "react-redux";
import BomApproval from "../components/Table/BomApproval";
const Approvals: React.FC = () => {
  const [cookies] = useCookies();
  const dispatch = useDispatch();
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("approval");
  //  Products
  const [productSearchKey, setProductSearchKey] = useState<
    string | undefined
  >();
  const [products, setProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  //  Stores
  const [storeSearchKey, setStoreSearchKey] = useState<string | undefined>();
  const [stores, setStores] = useState<any>([]);
  const [filteredStores, setFilteredStores] = useState<any>([]);
  const [isLoadingStores, setIsLoadingStores] = useState<boolean>(false);
  //  Buyer
  const [buyerSearchKey, setBuyerSearchKey] = useState<string | undefined>();
  const [buyers, setBuyers] = useState<any>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<any>([]);
  const [isLoadingBuyers, setIsLoadingBuyers] = useState<boolean>(false);
  //  Supplier
  const [sellerSearchKey, setSellerSearchKey] = useState<string | undefined>();
  const [sellers, setSellers] = useState<any>([]);
  const [filteredSellers, setFilteredSellers] = useState<any>([]);
  const [isLoadingSellers, setIsLoadingSellers] = useState<boolean>(false);
  //  BOM
  const [bomSearchKey, setBomSearchKey] = useState<string | undefined>();
  const [boms, setBoms] = useState<any>([]);
  const [filteredBoms, setFilteredBoms] = useState<any>([]);
  const [isLoadingBoms, setIsLoadingBoms] = useState<boolean>(false);
  //  BOM Raw Materials
  const [bomRMSearchKey, setBomRMSearchKey] = useState<string | undefined>();
  const [bomRMs, setBomRMs] = useState<any>([]);
  const [filteredBomRMs, setFilteredBomRMs] = useState<any>([]);
  const [isLoadingBomRMs, setIsLoadingBomRMs] = useState<boolean>(false);

  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteStore] = useDeleteStoresMutation();
  const [updateStore] = useUpdateStoreMutation();
  const [deleteAgent] = useDeleteAgentMutation();
  const [updateAgent] = useUpdateAgentMutation();
  const [deleteBom] = useDeleteBomMutation();
  const [updateBom] = useUpdateBOMMutation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [PageSize, setPageSize] = useState<number>(10);
  const [bomId, setBomId] = useState<string | undefined>();
  const {
    isOpen: isBomApproveModalOpen,
    onOpen: onBomOpen,
    onClose: onBomClose,
  } = useDisclosure();

  const {
    isBomDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  // For Unapproved Products
  const fetchUnapprovedProductsHandler = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/unapproved",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setProducts(data.unapproved);
      setFilteredProducts(data.unapproved);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const approveProductHandler = async (id: string) => {
    try {
      const response: any = await updateProduct({
        _id: id,
        approved: true,
      }).unwrap();
      toast.success(response.message);
      fetchUnapprovedProductsHandler();
      socket.emit('notificationdatachange', true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const deleteProductHandler = async (id: string) => {
    try {
      const response: any = await deleteProduct({ _id: id }).unwrap();
      toast.success(response.message);
      fetchUnapprovedProductsHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  // For Unapproved Stores
  const fetchUnapprovedStoresHandler = async () => {
    try {
      setIsLoadingStores(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "store/unapproved",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setStores(data.unapproved);
      setFilteredStores(data.unapproved);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoadingStores(false);
    }
  };

  const approveStoreHandler = async (id: string) => {
    try {
      const response = await updateStore({ _id: id, approved: true }).unwrap();
      toast.success(response.message);
      fetchUnapprovedStoresHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const deleteStoreHandler = async (id: string) => {
    try {
      const response: any = await deleteStore(id).unwrap();
      toast.success(response.message);
      fetchUnapprovedStoresHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  // For Unapproved Buyers And Sellers
  const fetchUnapprovedBuyersHandler = async () => {
    try {
      setIsLoadingBuyers(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/unapproved-buyers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setBuyers(data.agents);
      setFilteredBuyers(data.agents);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoadingBuyers(false);
    }
  };

  const fetchUnapprovedSellersHandler = async () => {
    try {
      setIsLoadingBuyers(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/unapproved-suppliers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setSellers(data.agents);
      setFilteredSellers(data.agents);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoadingBuyers(false);
    }
  };

  const approveAgentHandler = async (id: string) => {
    try {
      const response = await updateAgent({ _id: id, approved: true }).unwrap();
      toast.success(response.message);
      fetchUnapprovedBuyersHandler();
      fetchUnapprovedSellersHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const deleteAgentHandler = async (id: string) => {
    try {
      const response: any = await deleteAgent(id).unwrap();
      toast.success(response.message);
      fetchUnapprovedBuyersHandler();
      fetchUnapprovedSellersHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  // For Unapproved BOMs
  const fetchUnapprovedBomsHandler = async () => {
    try {
      setIsLoadingBoms(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "bom/unapproved",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setBoms(data.boms);
      setFilteredBoms(data.boms);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoadingBoms(false);
    }
  };

  const [selectedData, setSelectedData] = useState<any>([]);
  const [adminApprove, setAdminApprove] = useState("");
  const openBomModal = (
    bom: object,
    approve: string
  ) => {
    setSelectedData(bom);
    setAdminApprove(approve);
    onBomOpen();
  };

  const approveBomHandler = async (data: any) => {
    console.log(data)
    const approve = data?.approved;
    openBomModal(data, approve)
  };

  const deleteBomHandler = async (id: string) => {
    try {
      const response: any = await deleteBom(id).unwrap();
      toast.success(response.message);
      fetchUnapprovedBomsHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  // For Unapproved BOM Raw Materials
  const fetchUnapprovedBomRMsHandler = async () => {
    try {
      setIsLoadingBomRMs(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "bom/unapproved/raw-materials",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      
      setBomRMs(data?.unapproved);
      setFilteredBomRMs(data?.unapproved || []);

    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoadingBomRMs(false);
    }
  };

  const approveBomRMHandler = async (id: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "bom/approve/raw-materials",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            _id: id,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      fetchUnapprovedBomRMsHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const openBomDetailsDrawerHandler = (id: string) => {
    setBomId(id);
    dispatch(openBomDetailsDrawer());
  };

  const closeBomDetailsDrawerHandler = () => {
    dispatch(closeBomDetailsDrawer());
  };


  useEffect(() => {
    fetchUnapprovedProductsHandler();
    fetchUnapprovedStoresHandler();
    fetchUnapprovedBuyersHandler();
    fetchUnapprovedSellersHandler();
    fetchUnapprovedBomsHandler();
    fetchUnapprovedBomRMsHandler();
  }, []);
 
  useEffect(() => {
    const handleChangesApply = (data:any) => {
      if (data === true) {
        fetchUnapprovedProductsHandler();
        fetchUnapprovedStoresHandler();
        fetchUnapprovedBuyersHandler();
        fetchUnapprovedSellersHandler();
        fetchUnapprovedBomsHandler();
        fetchUnapprovedBomRMsHandler();
        socket.off('changesapply', handleChangesApply); // Remove listener after first call
      }
    };
    
    socket.on('changesapply', handleChangesApply);

    return () => {
      socket.off('changesapply', handleChangesApply); // Prevent duplication on rerender
    };
  });

  // Product Search
  useEffect(() => {
    const searchTxt = productSearchKey?.toLowerCase();
    const results = products.filter(
      (prod: any) =>
        prod.name?.toLowerCase()?.includes(searchTxt) ||
        prod.product_id?.toLowerCase()?.includes(searchTxt) ||
        prod.category?.toLowerCase()?.includes(searchTxt) ||
        prod.price?.toString()?.toLowerCase()?.toString().includes(searchTxt) ||
        prod.uom?.toLowerCase()?.includes(searchTxt) ||
        prod.current_stock?.toString().toString().includes(searchTxt) ||
        prod?.min_stock?.toString()?.includes(searchTxt) ||
        prod?.max_stock?.toString()?.includes(searchTxt) ||
        prod?.hsn?.includes(searchTxt) ||
        (prod?.createdAt &&
          new Date(prod?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (prod?.updatedAt &&
          new Date(prod?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredStores(results);
  }, [productSearchKey]);

  // Store Search
  useEffect(() => {
    const searchTxt = storeSearchKey?.toLowerCase();
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
  }, [storeSearchKey]);

  // Buyer Search
  useEffect(() => {
    const searchTxt = buyerSearchKey?.toLowerCase();
    const results = buyers.filter(
      (buyer: any) =>
        buyer.name?.toLowerCase()?.includes(searchTxt) ||
        buyer.email?.toLowerCase()?.includes(searchTxt) ||
        buyer.phone?.toLowerCase()?.includes(searchTxt) ||
        buyer?.gst_number?.toLowerCase()?.includes(searchTxt) ||
        buyer?.company_name?.toLowerCase().includes(searchTxt) ||
        buyer?.company_email?.toLowerCase().includes(searchTxt) ||
        buyer?.company_phone?.toLowerCase().includes(searchTxt) ||
        buyer?.address_line1?.toLowerCase().includes(searchTxt) ||
        buyer?.address_line2?.toLowerCase()?.includes(searchTxt) ||
        buyer?.pincode?.toLowerCase()?.includes(searchTxt) ||
        buyer.city?.toLowerCase().includes(searchTxt) ||
        buyer.state?.toLowerCase().includes(searchTxt) ||
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
  }, [buyerSearchKey]);

  // Seller Search
  useEffect(() => {
    const searchTxt = sellerSearchKey?.toLowerCase();
    const results = sellers.filter(
      (seller: any) =>
        seller?.name?.toLowerCase()?.includes(searchTxt) ||
        seller?.email?.toLowerCase()?.includes(searchTxt) ||
        seller?.phone?.toLowerCase()?.includes(searchTxt) ||
        seller?.gst_number?.toLowerCase()?.includes(searchTxt) ||
        seller?.company_name.toLowerCase()?.includes(searchTxt) ||
        seller?.company_email.toLowerCase()?.includes(searchTxt) ||
        seller?.company_phone.toLowerCase()?.includes(searchTxt) ||
        seller?.address_line1.toLowerCase()?.includes(searchTxt) ||
        seller?.address_line2?.toLowerCase()?.includes(searchTxt) ||
        seller?.pincode?.toLowerCase()?.includes(searchTxt) ||
        seller?.city.toLowerCase()?.includes(searchTxt) ||
        seller?.state.toLowerCase()?.includes(searchTxt) ||
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
  }, [sellerSearchKey]);

  // BOM Search
  useEffect(() => {
    const searchTxt = bomSearchKey?.toLowerCase();
    const results = boms.filter(
      (bom: any) =>
        bom?.bom_name?.toLowerCase()?.includes(searchTxt) ||
        bom?.parts_count?.toString()?.toLowerCase()?.includes(searchTxt) ||
        bom?.total_cost?.toString()?.toLowerCase()?.includes(searchTxt) ||
        (bom?.approved_by?.first_name + " " + bom?.approved_by?.last_name)
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchTxt || "") ||
        (bom?.createdAt &&
          new Date(bom?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (bom?.updatedAt &&
          new Date(bom?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredBoms(results);
  }, [bomSearchKey]);

  if(!isAllowed){
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  const tabsData = [
    {
      id: "Products",
      label: "Products",
    },
    {
      id: "Stores",
      label: "Stores",
    },
    {
      id: "Buyers",
      label: "Buyers",
    },
    {
      id: "Suppliers",
      label: "Suppliers",
    },
    {
      id: "BOMs",
      label: "BOMs",
    },
    {
      id: "Inventory",
      label: "Inventory",
    },
  ]

  return (
    <div>
      {isBomDetailsDrawerOpened && (
        <BomDetails
          bomId={bomId}
          closeDrawerHandler={closeBomDetailsDrawerHandler}
        />
      )}

      <Tabs variant="unstyled" isFitted>
        <TabList
          justifyContent="flex-start"   // changed from center to left align for better scroll UX
          borderBottom="2px solid"
          borderColor="gray.200"
          overflowX="auto"             // enable horizontal scrolling
          whiteSpace="nowrap"          // prevent tabs from wrapping to new line
          gap={3}
          px={4}
          py={5}
          // optional: for smooth scrolling on iOS
          sx={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tabsData.map((tab) => (
            <Tab
              key={tab.id}
              fontWeight="semibold"
              fontSize="md"
              px={6}
              py={2}
              bg="gray.100"
              color="gray.600"
              boxShadow="sm"
              transition="all 0.1s ease"
              _selected={{
                bgGradient: "linear(to-r, #14b8a6, #319795)",
                color: "white",
                boxShadow: "lg",
                transform: "scale(1.05)",
              }}
              _hover={{
                bg: "gray.200",
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              display="inline-block" // ensure tabs respect nowrap behavior
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>


        <TabPanels>

        <TabPanel>
          {/* PRODUCTS */}
        
            {/* Products Page */}
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                Products for Approval
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap gap-y-2 gap-x-2 w-full md:w-fit">
                <textarea
                  className="rounded-[5px] w-full md:flex-1 px-2 py-2.5 md:px-3 md:py-2 text-sm focus:outline-[#14b8a6] hover:outline:[#14b8a6] border resize-none border-[#0d9488]"
                  rows={1}
                  //   width="220px"
                  placeholder="Search"
                  value={productSearchKey}
                  onChange={(e) => setProductSearchKey(e.target.value)}
                />
                <Button
                  fontSize={{ base: "14px", md: "14px" }}
                  paddingX={{ base: "10px", md: "12px" }}
                  paddingY={{ base: "0", md: "3px" }}
                  width={{ base: "-webkit-fill-available", md: 100 }}
                  onClick={fetchUnapprovedProductsHandler}
                  leftIcon={<MdOutlineRefresh />}
                  color="#319795"
                  borderColor="#319795"
                  variant="outline"
                >
                  Refresh
                </Button>
                <select
                  className="border w-full border-gray-400 rounded  px-2 py-1.5 md:w-[60px]  "
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="100000">All</option>
                </select>
              </div>
            </div>
            <div>
              <ProductTable
                isLoadingProducts={isLoadingProducts}
                products={filteredProducts}
                pageSize={PageSize}
                setPageSize={setPageSize}
                deleteProductHandler={deleteProductHandler}
                approveProductHandler={approveProductHandler}
              />
            </div>
        </TabPanel>

        <TabPanel>
          {/* STORES */}
            {/* Stores Page */}
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                Stores for Approval
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
                <textarea
                  className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#14b8a6] hover:outline:[#14b8a6] border resize-none border-[#0d9488]"
                  rows={1}
                  //   width="220px"
                  placeholder="Search"
                  value={storeSearchKey}
                  onChange={(e) => setStoreSearchKey(e.target.value)}
                />
                <Button
                  fontSize={{ base: "14px", md: "14px" }}
                  paddingX={{ base: "10px", md: "12px" }}
                  paddingY={{ base: "0", md: "3px" }}
                  width={{ base: "-webkit-fill-available", md: 100 }}
                  onClick={fetchUnapprovedStoresHandler}
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
              <StoreTable
                isLoadingStores={isLoadingStores}
                stores={filteredStores}
                deleteStoreHandler={deleteStoreHandler}
                approveStoreHandler={approveStoreHandler}
              />
            </div>
        </TabPanel>
          
          <TabPanel>
          {/* BUYERS */}
            {/* Buyers Page */}
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                Buyers for Approval
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
                <textarea
                  className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#14b8a6] hover:outline:[#14b8a6] border resize-none border-[#0d9488]"
                  rows={1}
                  //   width="220px"
                  placeholder="Search"
                  value={buyerSearchKey}
                  onChange={(e) => setBuyerSearchKey(e.target.value)}
                />
                <Button
                  fontSize={{ base: "14px", md: "14px" }}
                  paddingX={{ base: "10px", md: "12px" }}
                  paddingY={{ base: "0", md: "3px" }}
                  width={{ base: "-webkit-fill-available", md: 100 }}
                  onClick={fetchUnapprovedBuyersHandler}
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
              <AgentTable
                isLoadingAgents={isLoadingBuyers}
                agents={filteredBuyers}
                deleteAgentHandler={deleteAgentHandler}
                approveAgentHandler={approveAgentHandler}
              />
            </div>
          </TabPanel>

          <TabPanel>
          {/* SELLERS */}
            {/* Buyers Page */}
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                Suppliers for Approval
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
                <textarea
                  className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#14b8a6] hover:outline:[#14b8a6] border resize-none border-[#0d9488]"
                  rows={1}
                  //   width="220px"
                  placeholder="Search"
                  value={sellerSearchKey}
                  onChange={(e) => setSellerSearchKey(e.target.value)}
                />
                <Button
                  fontSize={{ base: "14px", md: "14px" }}
                  paddingX={{ base: "10px", md: "12px" }}
                  paddingY={{ base: "0", md: "3px" }}
                  width={{ base: "-webkit-fill-available", md: 100 }}
                  onClick={fetchUnapprovedSellersHandler}
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
              <AgentTable
                isLoadingAgents={isLoadingSellers}
                agents={filteredSellers}
                deleteAgentHandler={deleteAgentHandler}
                approveAgentHandler={approveAgentHandler}
              />
            </div>
          </TabPanel>

          <TabPanel>
          {/* BOMs */}
            {/* BOM Page */}
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                BOMs for Approval
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
                <textarea
                  className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#14b8a6] hover:outline:[#14b8a6] border resize-none border-[#0d9488]"
                  rows={1}
                  //   width="220px"
                  placeholder="Search"
                  value={bomSearchKey}
                  onChange={(e) => setBomSearchKey(e.target.value)}
                />
                <Button
                  fontSize={{ base: "14px", md: "14px" }}
                  paddingX={{ base: "10px", md: "12px" }}
                  paddingY={{ base: "0", md: "3px" }}
                  width={{ base: "-webkit-fill-available", md: 100 }}
                  onClick={fetchUnapprovedBomsHandler}
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
              <BOMTable
                isLoadingBoms={isLoadingBoms}
                boms={filteredBoms}
                openBomDetailsDrawerHandler={openBomDetailsDrawerHandler}
                deleteBomHandler={deleteBomHandler}
                approveBomHandler={approveBomHandler}
              />
            </div>
          </TabPanel>

          <TabPanel>
          {/* BOM Raw Materials */}
            {/* BOM Raw Material Page */}
            <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
              <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
                Inventory for Approval
              </div>

              <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
                <textarea
                  className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#14b8a6] hover:outline:[#14b8a6] border resize-none border-[#0d9488]"
                  rows={1}
                  //   width="220px"
                  placeholder="Search"
                  value={bomRMSearchKey}
                  onChange={(e) => setBomRMSearchKey(e.target.value)}
                />
                <Button
                  fontSize={{ base: "14px", md: "14px" }}
                  paddingX={{ base: "10px", md: "12px" }}
                  paddingY={{ base: "0", md: "3px" }}
                  width={{ base: "-webkit-fill-available", md: 100 }}
                  onClick={fetchUnapprovedBomRMsHandler}
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
              <BOMRawMaterialTable
                isLoadingProducts={isLoadingBomRMs}
                products={filteredBomRMs}
                approveProductHandler={approveBomRMHandler}
              />
            </div>
          </TabPanel>

        </TabPanels>
      </Tabs>


      {/* Bom Approval */}
      <Modal isOpen={isBomApproveModalOpen} onClose={onBomClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bom Approval</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <BomApproval
                bomData={selectedData}
                approve={adminApprove}
                onClose={onBomClose}
              />
          </ModalBody>
        </ModalContent>
      </Modal>

    </div>

    
  );
};

export default Approvals;
