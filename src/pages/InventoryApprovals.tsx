import { 
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure, } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import BOMRawMaterialTable from "../components/Table/BOMRawMaterialTable";
import {socket} from "../socket";
import InventoryApproval from "../components/Table/InventoryApproval";
const InventoryApprovals: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("inventory");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);

  const [isLoadingInventory, setIsLoadingInventory] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  

  const fetchInventoryHandler = async () => {
    try {
        setIsLoadingInventory(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "bom/unapproved/inventory/raw-materials",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const results = await response.json();
      if (!results.success) {
        throw new Error(results?.message);
      }
      setData(results.unapproved);
      setFilteredData(results.unapproved);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingInventory(false);
    }
  };


  const [selectedData, setSelectedData] = useState<any>([]);
  const [adminApprove, setAdminApprove] = useState("");
  const {
    isOpen: isInventoryApproveModalOpen,
    onOpen: onInventoryOpen,
    onClose: onInventoryClose,
  } = useDisclosure();
  const openInventoryModal = (
    bom: object,
    approve: string
  ) => {
    setSelectedData(bom);
    setAdminApprove(approve);
    onInventoryOpen();
  };

  const approveRmHandler = async (data: any)=>{
    console.log("all data of json =", data)
    const approve = data?.approved;
    console.log("approve =", approve)
    openInventoryModal(data, approve)
  }

  useEffect(() => {
    fetchInventoryHandler();
  }, []);

  useEffect(() => {
    const handleChangesApply = (data:any) => {
      if (data === true) {
        fetchInventoryHandler();
        socket.off('changesapply', handleChangesApply); // Remove listener after first call
      }
    };
    
    socket.on('changesapply', handleChangesApply);
    return () => {
      socket.off('changesapply', handleChangesApply); // Prevent duplication on rerender
    };
  });

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = data.filter(
      (emp: any) =>
        emp.first_name?.toLowerCase()?.includes(searchTxt) ||
        emp.last_name?.toLowerCase().includes(searchTxt) ||
        emp.email.toLowerCase()?.includes(searchTxt) ||
        emp.phone.toLowerCase().toString().includes(searchTxt) ||
        emp?.role?.role?.toLowerCase()?.includes(searchTxt) ||
        (emp?.createdAt &&
          new Date(emp?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (emp?.updatedAt &&
          new Date(emp?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  if(!isAllowed){
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div>
        
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
      Inventory Approvals
      </div>

      {/* Employees Page */}
      <div className="w-full  md:flex justify-between gap-4">
        <div className="w-full">
          <textarea
            className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#14b8a6] hover:outline:[#14b8a6] border resize-none border-[#0d9488]"
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div className="flex  justify-between gap-4">
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchInventoryHandler}
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
        <BOMRawMaterialTable products={filteredData} isLoadingProducts={isLoadingInventory} approveProductHandler={approveRmHandler} />
      </div>


      {/* inventory Approval */}
      <Modal isOpen={isInventoryApproveModalOpen} onClose={onInventoryClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Inventory Approval</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <InventoryApproval
                inventoryData={selectedData}
                approve={adminApprove}
                onClose={onInventoryClose}
              />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default InventoryApprovals;
