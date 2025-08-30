//@ts-nocheck
import { useEffect, useState } from "react";
import Salestatus from "./Salestatus";
import Sampleimage from "./Sampleimage";
import Orderimage from "./Orderimage";

import {
  Box,
  Spinner,
  Button,
  useDisclosure,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Badge,
  Divider,
  Input,
  Select,
  FormControl,
  FormLabel,
  useColorModeValue,
  Img,
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { FaEdit, FaCloudUploadAlt } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import CreateSale from "./CreateSale";
import UpdateSale from "./UpdateSale";
import { MdOutlineRefresh, MdOutlineTaskAlt } from "react-icons/md";
import Assign from "./Assign";
import Pagination from "./Pagination";
import TokenAmount from "./TokenAmount";
import SampleModal from "./SampleModal";
import UploadInvoice from "./UploadInvoice";
import ProformaInvoice from "./UpdateProformaInvoice";
import ViewDesign from "./ViewDesign";
import PaymentModal from "./PaymentModal";

import TrackProduction from "../components/UserDashboard/TrackProduction";
import { socket } from '../socket';
const Sales = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale");
  const createDisclosure = useDisclosure();
  const updateDisclosure = useDisclosure();
  const assignDisclosure = useDisclosure();
  const remarksDisclosure = useDisclosure();
  const tokenDisclosure = useDisclosure();
  const sampleDisclosure = useDisclosure();
  const [purchases, setPurchases] = useState<[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedSale, setSelectedSale] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["access_token", "role"]);
  const [pages, setPages] = useState(1);
  const [comment, setComment] = useState("");
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);
  const [tokenAmount, setTokenAmount] = useState();
  const [productionStatus, setProductionStatus] = useState("");
  const [approveStatus, setApproveStatus] = useState<boolean>();
  const [file, setFile] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState("");
  const [designProcess, setDesignProcess] = useState<any>([]);
  const [selectedProcess, setSelectedProcess] = useState<any>([]);
  const [halfAmountId, sethalfAmountId] = useState("")
  const [halfAmount, sethalfAmount] = useState(null);
  const [stage, setStage] = useState("");
  const {
    isOpen: isImageModalOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();

  const {
    isOpen: isSampleModalOpen,
    onOpen: onSampleOpen,
    onClose: onSampleClose,
  } = useDisclosure();

  const {
    isOpen: isOrderModalOpen,
    onOpen: onOrderOpen,
    onClose: onOrderClose,
  } = useDisclosure();

  const {
    isOpen: isProductionModalOpen,
    onOpen: onProductionOpen,
    onClose: onProductionClose,
  } = useDisclosure();

  const [saleId, setSaleId] = useState("");
  const invoiceDisclosure = useDisclosure();
  const proformainvoiceDisclosure = useDisclosure();
  const dropZoneBg = useColorModeValue("gray.100", "gray.700");
  const paymentDisclosure = useDisclosure();
  const [paymentfile, setPaymentFile] = useState("");

  const [customerApprove, setCustomerApprove] = useState("");
  const [selectedData, setSelectedData] = useState<any>([]);
  const [verifystatus, setVerifyStatus] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [assignId, setAssignId] = useState();
  const [paymentFor, setPaymentFor] = useState("");
  const [limit, setLimit] = useState(10);
  const half_payment = useDisclosure()
  const openSalestatusModal = (
    designFile: string,
    purchase: object,
    approve: string
  ) => {
    setSelectedDesign(designFile);
    setSelectedData(purchase);
    setCustomerApprove(approve);
    onImageOpen();
  };

  const openSampleImageModal = (
    purchase: object,
  ) => {
    setSelectedData(purchase);
    onSampleOpen();
  };

  const openSampleOrderModal = (
    purchase: object,
  ) => {
    setSelectedData(purchase);
    onOrderOpen();
  };



  const openAccountModal = (
    designFile: string,
    purchase: object,
    approve: string
  ) => {
    setSelectedData(purchase);
    onAccountpreviewOpen();
  };

  const openInvoicepreviewModal = (
    invoiceFile: string,
    purchase: object,
  ) => {
    setSelectedData(purchase);
    onInvoicepreviewOpen();
  };


  const openDesignModal = (
    designFile: string,
    purchase: object,
    approve: string
  ) => {
    setSelectedDesign(designFile);
    setSelectedData(purchase);
    setCustomerApprove(approve);
    onDesignerOpen();
  };

  const {
    isOpen: isAccountpreviewOpen,
    onOpen: onAccountpreviewOpen,
    onClose: onAccountpreviewClose,
  } = useDisclosure();

  const {
    isOpen: isInvoicepreviewOpen,
    onOpen: onInvoicepreviewOpen,
    onClose: onInvoicepreviewClose,
  } = useDisclosure();

  // designer preview
  const {
    isOpen: isDesignModalOpen,
    onOpen: onDesignerOpen,
    onClose: onDesignerClose,
  } = useDisclosure();

  const handleTokenClick = (id: any, amount: number) => {
    setSaleId(id);
    setTokenAmount(amount);
    tokenDisclosure.onOpen();
  };

  const role = cookies?.role;
  const token = cookies.access_token;

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);

      if (!token) {
        throw new Error("Authentication token not found");
      }

      let url = "";
      if (role === "admin") {
        url = `${process.env.REACT_APP_BACKEND_URL}purchase/getAll?page=${pages}&limit=${limit}`;
      } else {
        url = `${process.env.REACT_APP_BACKEND_URL}purchase/getOne?page=${pages}&limit=${limit}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPurchases(response.data.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch purchase data";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleChangesApply = (data) => {
      if (data === true) {
        fetchPurchases();
        fetchEmployees();
        console.log('changes apply data')
        socket.off('changesapply', handleChangesApply); // Remove listener after first call
      }
    };
    socket.on('changesapply', handleChangesApply);
  
    return () => {
      socket.off('changesapply', handleChangesApply); // Prevent duplication on rerender
    };
  });

  

  const fetchEmployees = async () => {
    try {
      const token = cookies.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const userRes = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}auth/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredEmployees = (userRes.data.users || []).filter(
        (user: any) => user.role
      );

      setEmployees(filteredEmployees); // Set the filtered employees
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch employees";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchEmployees();
  }, [pages, limit]);

  useEffect(() => {
    if (!purchases.length) {
      setFilteredPurchases([]);
      return;
    }

    const filteredData = purchases.filter((purchase) => {
      const matchesText =
        !filterText ||
        [
          purchase?.user_id?.[0]?.first_name,
          purchase?.product_id?.[0]?.name,
          purchase?.customer_id[0]?.full_name,
        ]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(filterText.toLowerCase())
          );

      const matchesDate =
        !filterDate ||
        new Date(purchase?.createdAt).toISOString().split("T")[0] ===
        filterDate;

      const matchesStatus =
        !filterStatus ||
        purchase?.Status?.toLowerCase() === filterStatus.toLowerCase();

      return matchesText && matchesDate && matchesStatus;
    });

    setFilteredPurchases(filteredData);
  }, [filterText, filterDate, filterStatus, purchases]);

  const handleEditClick = (sale: any) => {
    setSelectedSale(sale);
    updateDisclosure.onOpen();
  };

  const handleAssignClick = (purchase: any) => {
    assignDisclosure.onOpen();
  };

  const handleRemarksClick = (comment: string) => {
    setComment(comment);
    remarksDisclosure.onOpen();
  };

  const calculateTotalPrice = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstVal = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstVal;
    return totalPrice;
  };

  const handleSample = (id: any, approve: boolean) => {
    setSelectedSale(id);
    setApproveStatus(approve);
    sampleDisclosure.onOpen();
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById("file-input");
    fileInput && fileInput.click();
  };

  const handleInvoiceUpload = (id: any, file: any) => {
    setSaleId(id);
    setInvoiceFile(file);
    invoiceDisclosure.onOpen();
  };

  const handleUpdateForma = (id: any, file: any) => {
    setSaleId(id);
    setInvoiceFile(file);
    proformainvoiceDisclosure.onOpen();
  };

  const handlePayment = (
    id: any,
    payment: string,
    verify: boolean,
    assignId: any,
    payfor: string
  ) => {
    setSaleId(id);
    setPaymentFile(payment);
    setVerifyStatus(verify);
    setAssignId(assignId);
    setPaymentFor(payfor);
    paymentDisclosure.onOpen();
  };

  const handleHalfPayment = async () => {
    const data = {
      half_payment: halfAmount,
      half_payment_status: "pending",
    }
    try {
      half_payment.onClose()
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}purchase/update/${halfAmountId.sale_id}`, data, {
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      })
      toast.success("Half Amount added");
      socket.emit('notificationdatachange', true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="overflow-x-hidden ">
      <Box>
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
          Sales
        </div>

        {/* Sales Page */}
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-2 flex-wrap">
          {/* Search Input */}
          <div className="w-full md:flex-1">
            <Input
              type="text"
              placeholder="Search Sale..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full"
              _focus={{
                borderColor: "#0d9488",
                boxShadow: "0 0 0 1px #14b8a6"
              }}
              transition="all 0.2s"
            />
          </div>

          {/* Filter Controls */}
          <div className="w-full md:w-auto flex flex-wrap gap-4 justify-start md:justify-end">
            {/* Date Filter */}
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              width={{ base: "100%", sm: "140px" }}
            />

            {/* Status Filter */}
            <Select
              placeholder="Sale Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              width={{ base: "100%", sm: "140px" }}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </Select>

            {/* Add New Sale Button */}
            <Button
              onClick={createDisclosure.onOpen}
              color="#ffffff"
              backgroundColor="#0d9488"
              _hover={{ backgroundColor: "#14b8a6" }}
              className="text-white rounded-lg focus:ring-2"
              paddingX={{ base: "12px", md: "16px" }}
              paddingY={{ base: "10px", md: "8px" }}
              width={{ base: "100%", sm: "auto" }}
            >
              Add New Sale
            </Button>

            {/* Refresh Button */}
            <Button
              fontSize="14px"
              paddingX={{ base: "10px", md: "12px" }}
              paddingY={{ base: "10px", md: "8px" }}
              width={{ base: "100%", sm: "auto" }}
              onClick={fetchPurchases}
              leftIcon={<MdOutlineRefresh />}
              color="#319795"
              borderColor="#319795"
              variant="outline"
            >
              Refresh
            </Button>

            {/* Page Size Selector */}
            <Select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              width={{ base: "100%", sm: "80px" }}
            >
              {[10, 20, 50, 100, 100000].map((size) => (
                <option key={size} value={size}>
                  {size === 100000 ? "All" : size}
                </option>
              ))}
            </Select>
          </div>
        </div>


        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <Spinner size="xl" />
          </Box>
        ) : filteredPurchases.length === 0 ? (
          <Text className="text-red-500 text-center">
            No Sale Data to show...
          </Text>
        ) : (
          <Box
            maxW="100%"
            overflowX="auto"
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.200"
            p={4}
          >
            {filteredPurchases?.map((purchase: any) => (
              <Box
                key={purchase?._id}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="lg"
                bg="white"
                p={4}
                w="100%"
                position="relative"
                mb={4}
              >
                {/* Left colored bar */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  h="100%"
                  w={2}
                  bg={purchase?.Status === "Pending" ? "orange" : "green"}
                  borderRadius="md"
                />

                {/* Header */}
                <HStack justify="space-between" mb={3} flexWrap="wrap" gap={3}>
                  <VStack align="start" w={{ base: "100%", md: "auto" }}>
                    <Text fontWeight="bold" fontSize="lg">
                      Created By: {purchase?.user_id[0]?.first_name || "N/A"}
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" className="underline">
                      Date: {new Date(purchase?.createdAt).toLocaleDateString()}
                    </Text>
                  </VStack>

                  <VStack align="start" w={{ base: "100%", md: "auto" }}>
                    <Badge
                      colorScheme={
                        purchase?.Status === "Pending" ? "orange" : "green"
                      }
                      fontSize="sm"
                    >
                      Sale Approval: {purchase?.Status}
                    </Badge>

                    {purchase?.Status === "Approved" &&
                      purchase?.customer_approve &&
                      purchase?.designFile && (
                        <Badge
                          colorScheme={
                            purchase?.customer_approve === "Approved"
                              ? "green"
                              : "red"
                          }
                          fontSize="sm"
                        >
                          Design Approval: {purchase?.customer_approve}
                        </Badge>
                      )}

                    {purchase?.token_amt && purchase?.token_status === false ? (
                      <Badge colorScheme="orange" fontSize="sm">
                        Token Amount : Pending
                      </Badge>
                    ) : null}

                    {purchase?.half_payment_status && (
                      <Badge colorScheme={purchase?.half_payment_status === 'pending' ? "orange" : "green"} fontSize="sm">
                        Half payement : {purchase?.half_payment_status}
                      </Badge>
                    )}

                    {purchase?.salestatus == "Reject" ? (
                      <Badge colorScheme="red" fontSize="sm">
                        Sales Department : Rejected
                        <p>
                          Feedback : {purchase?.salestatus_comment}
                        </p>
                      </Badge>
                    ) : null}

                    {purchase?.salestatus == "Approve" ? (
                      <Badge colorScheme="green" fontSize="sm">
                        Sales Department : Approved
                      </Badge>
                    ) : null}

                    {purchase?.customer_invoice_approve == "Approve" ? (
                      <Badge colorScheme="green" fontSize="sm">
                        Customer Invoice : Approved
                      </Badge>
                    ) : null}

                    {purchase?.customer_invoice_approve == "Reject" ? (
                      <Badge colorScheme="red" fontSize="sm">
                        Customer Invoice : Rejected <br />
                        Customer Invoice Comment: {purchase?.customer_invoice_comment}
                      </Badge>
                    ) : null}

                    {purchase?.token_status ? (
                      <Badge colorScheme="green" fontSize="sm">
                        Token Amount :{" "}
                        {purchase?.token_status ? "Paid" : "Pending"}
                      </Badge>
                    ) : null}

                    {purchase?.isSampleApprove ? (
                      <Badge colorScheme="green" fontSize="sm">
                        Sample Status: Approved
                      </Badge>
                    ) : null}

                    {purchase?.paymet_status && (
                      <Badge
                        colorScheme={
                          purchase?.paymet_status === "Pending"
                            ? "orange"
                            : "green"
                        }
                        fontSize="sm"
                      >
                        Payment:{" "}
                        {purchase?.paymet_status === "Paied"
                          ? "Paid"
                          : purchase?.paymet_status}
                      </Badge>
                    )}

                    {purchase?.product_status && (
                      <Badge
                        colorScheme={
                          purchase?.product_status === "Dispatch"
                            ? "orange"
                            : "green"
                        }
                        fontSize="sm"
                      >
                        Product Status: {purchase?.product_status}
                      </Badge>
                    )}
                  </VStack>
                </HStack>

                {/* Divider */}
                <Divider />

                {/* Task Details */}
                <HStack
                  justify="space-between"
                  spacing={3}
                  mt={3}
                  flexWrap="wrap"
                  gap={3}
                >
                  <VStack align="start" w={{ base: "100%", md: "auto" }}>
                    <Text fontSize="sm">
                      <strong>Customer:</strong>{" "}
                      {purchase?.customer_id[0]?.full_name || "N/A"}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Product Name:</strong>{" "}
                      {purchase?.product_id[0]?.name || "N/A"}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Product Price:</strong>{" "}
                      {purchase?.price || "N/A"}
                    </Text>

                    <Text fontSize="sm">
                      <strong>Quantity:</strong> {purchase?.product_qty}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Price:</strong>{" "}
                      {purchase?.price * purchase?.product_qty}
                    </Text>
                  </VStack>
                  <VStack align="start" w={{ base: "100%", md: "auto" }}>
                    {role === 'Sales' && purchase.Status === "Approved" && (
                      <Button
                        size={{ base: "xs", sm: "sm" }} // Smaller size for mobile
                        bgColor="white"
                        leftIcon={<MdOutlineTaskAlt />}
                        _hover={{ bgColor: "green.500" }}
                        className="border border-green-500 hover:text-white w-full sm:w-auto"
                        onClick={() => {
                          onProductionOpen();
                          setDesignProcess(purchase?.empprocess);
    
                          const selectedBom =
                            purchase?.boms[1] || purchase?.boms[0];
                          const selectedProcess =
                            selectedBom?.production_processes[0]?.processes;
    
                          const bomstage = purchase?.boms[1] ? "real" : "sample";
                          setStage(bomstage);
                          setSelectedProcess(selectedProcess);
                        }}
                      >
                        Track Production
                      </Button>
                    )}

                    <Text fontSize="sm">
                      <strong>GST :</strong> {purchase?.GST}%
                    </Text>
                    <Text fontSize="sm">
                      <strong>Total Price :</strong>{" "}
                      {calculateTotalPrice(
                        purchase?.price,
                        purchase?.product_qty,
                        purchase?.GST
                      ).toFixed(2)}
                    </Text>

                    {(purchase?.delivery_status_by_customer) ? (
                      <Text fontSize="sm">
                        <strong>Delivery Status :</strong> {purchase?.delivery_status_by_customer}
                        <br />
                        {purchase?.delivery_status_comment_by_customer && (
                          <strong>Delivery Feedback :</strong>
                        )}
                        {purchase?.delivery_status_comment_by_customer}
                      </Text>
                    ) : null}

                    {purchase?.comment && (
                      <Text
                        className="text-blue-500 underline cursor-pointer"
                        onClick={() => handleRemarksClick(purchase?.comment)}
                      >
                        Remarks{" "}
                      </Text>
                    )}

                    {purchase?.invoice_image && (
                      <Text
                        className="text-blue-500 underline cursor-pointer"
                        onClick={() =>
                          openInvoicepreviewModal(
                            purchase?.invoice_image,
                            purchase
                          )
                        }
                      >
                        Preview invoice{" "}
                      </Text>
                    )}

                    {purchase?.designFile ? (
                      <a
                        href={purchase?.designFile}
                        target="_blank"
                        className="text-blue-500 underline text-sm"
                      >
                        Uploaded Design File
                      </a>
                    ) : null}

                    {purchase?.token_ss ? (
                      <a
                        href={purchase?.token_ss}
                        target="_blank"
                        className="text-blue-500 underline text-sm"
                      >
                        {" "}
                        View Token Proof{" "}
                      </a>
                    ) : null}


                    {role === 'Sales' && purchase?.performaInvoice ? (
                      <a
                        href={purchase?.performaInvoice}
                        target="_blank"
                        className="text-blue-500 underline text-sm"
                      >
                        {" "}
                        View Pro Forma Invoice{" "}
                      </a>
                    ) : null}
                  </VStack>
                </HStack>

                {/* Footer */}
                <Divider my={3} />
                <HStack justify="space-between" mt={3} flexWrap="wrap" gap={3}>
                  <Button
                    bgColor="white"
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white"
                    w={{ base: "100%", md: "auto" }}
                    onClick={() => handleEditClick(purchase)}
                  >
                    Edit{" "}
                  </Button>

                  {purchase?.token_ss &&
                    purchase?.boms[0]?.production_processes?.every(
                      (processGroup) =>
                        processGroup?.processes?.every(
                          (process) => process?.done === true
                        )
                    ) ? (
                    <Button
                      bgColor="white"
                      _hover={{ bgColor: "red.500" }}
                      className="border border-red-500 hover:text-white"
                      w={{ base: "100%", md: "auto" }}
                      onClick={() =>
                        handleSample(purchase?._id, purchase?.isSampleApprove)
                      }
                    >
                      Approve Sample
                    </Button>
                  ) : null}



                  {purchase?.designFile && (
                    <Button

                      leftIcon={<IoEyeSharp />}
                      bgColor="white"
                      _hover={{ bgColor: "orange.500" }}
                      className="border border-orange-500 hover:text-white w-full sm:w-auto"
                      onClick={() =>
                        openDesignModal(
                          purchase?.designFile,
                          purchase,
                          purchase?.sale_design_approve
                        )
                      }
                    >
                      View Design
                    </Button>
                  )}

                  {role === 'Sales' && purchase?.token_amt && purchase?.token_status ? (
                    <Button
                      bgColor="white"
                      _hover={{ bgColor: "orange.500" }}
                      className="border border-red-500 hover:text-white"
                      w={{ base: "100%", md: "auto" }}
                      onClick={() =>
                        openSampleImageModal(
                          purchase,
                        )
                      }
                    >
                      Sample Image
                    </Button>
                  ) : null}

                  {/* {["sales", "admin"].includes(
                    role.toLowerCase()) && purchase?.allsale?.half_payment_image ? (
                    <Button
                      bgColor="white"
                      _hover={{ bgColor: "orange.500" }}
                      className="border border-red-500 hover:text-white"
                      w={{ base: "100%", md: "auto" }}
                      onClick={() =>
                        openSampleOrderModal(
                          purchase,
                        )
                      }
                    >
                      Order Image
                    </Button>
                  ) : null} */}



                  {role === 'Sales' && (
                    <Button
                      bgColor="white"
                      _hover={{ bgColor: "orange.500" }}
                      className="border border-red-500 hover:text-white"
                      w={{ base: "100%", md: "auto" }}
                      onClick={() =>
                        openSalestatusModal(
                          purchase?.designFile,
                          purchase,
                          purchase?.salestatus
                        )
                      }
                    >
                      Status
                    </Button>
                  )}

                  {(role === 'Sales' || role === 'admin') && (purchase?.customer_order_ss || purchase?.dispatcher_order_ss) && (
                    <Button
                      bgColor="white"
                      leftIcon={<IoEyeSharp />}
                      _hover={{ bgColor: "yellow.500" }}
                      className="border border-yellow-500 hover:text-white"
                      width={{ base: "full", sm: "auto" }}
                    >
                      <a
                        href={purchase?.customer_order_ss || purchase?.dispatcher_order_ss}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Delivery Proof
                      </a>
                    </Button>
                  )}


                  {purchase?.isTokenVerify ? (
                    <Button
                      bgColor="white"
                      leftIcon={<FaCloudUploadAlt />}
                      _hover={{ bgColor: "blue.500" }}
                      className="border border-blue-500 hover:text-white"
                      onClick={() =>
                        handleInvoiceUpload(purchase?.sale_id, purchase?.invoice)
                      }
                      width={{ base: "full", sm: "auto" }}
                    >
                      Upload Invoice
                    </Button>
                  ) : null}

                  {role === 'Sales' && purchase?.performaInvoice ? (
                    <Button
                      bgColor="white"
                      leftIcon={<FaCloudUploadAlt />}
                      _hover={{ bgColor: "blue.500" }}
                      className="border border-blue-500 hover:text-white"
                      onClick={() =>
                        handleUpdateForma(purchase?._id, purchase?.performaInvoice)
                      }
                      width={{ base: "full", sm: "auto" }}
                    >
                      Update Proforma Invoice
                    </Button>
                  ) : null}

                  {/* {["sales", "admin"].includes(
                    role.toLowerCase()
                  ) && purchase?.customer_approve === "Approved" ? (
                    <Button
                      bgColor="white"
                      _hover={{ bgColor: "purple.500" }}
                      className="border border-purple-500 hover:text-white"
                      w={{ base: "100%", md: "auto" }}
                      onClick={() =>
                        handleTokenClick(purchase?._id, purchase?.token_amt)
                      }
                    >
                      Add Token Amount{" "}
                    </Button>
                  ) : null} */}

                  {/* {["sales", "admin"].includes(
                    role.toLowerCase()
                  ) && purchase?.isSampleApprove &&
                    <Button
                      bgColor="white"
                      _hover={{ bgColor: "blue.500" }}
                      className="border border-blue-500 hover:text-white"
                        onClick={() => {
                          half_payment.onOpen();
                          sethalfAmountId(purchase)
                        }
                      }
                      width={{ base: "full", sm: "auto" }}
                    >
                      Add half Payment
                    </Button>
                  } */}

                  {purchase?.customer_pyement_ss ? (
                    <Button
                      bgColor="white"
                      leftIcon={<IoEyeSharp />}
                      _hover={{ bgColor: "orange.500" }}
                      className="border border-orange-500 hover:text-white"
                      onClick={() =>
                        handlePayment(
                          purchase?.sale_id,
                          purchase?.customer_pyement_ss,
                          purchase?.payment_verify,
                          purchase?.id,
                          "payment"
                        )
                      }
                      width={{ base: "full", sm: "auto" }}
                    >
                      View Payment
                    </Button>
                  ) : null}

                  <Button
                    bgColor="white"
                    _hover={{ bgColor: "orange.500" }}
                    className="border border-orange-500 hover:text-white"
                    w={{ base: "100%", md: "auto" }}
                    onClick={() => {
                      handleAssignClick();
                      setSelectedSale(purchase);
                    }}
                  >
                    Assign
                  </Button>
                </HStack>
              </Box>
            ))}
          </Box>
        )}
      </Box>


      {/* half payment modal */}
      <Modal
        isOpen={half_payment.isOpen}
        onClose={half_payment.onClose}
        size={{ base: "md", sm: "sm", md: "md" }} // Responsive modal width
      >
        <ModalOverlay />
        <ModalContent
          className="rounded-lg shadow-md"
          mx={{ base: 4, md: "auto" }} // Margin on mobile to avoid edge clipping
          p={{ base: 2, md: 4 }}
        >
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Enter Half Amount
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl>
              <Input
                type="number"
                id="number-input"
                placeholder="Enter amount"
                value={
                  halfAmountId?.allsale?.half_payment
                    ? halfAmountId?.allsale?.half_payment
                    : halfAmount
                }
                onChange={(e) => sethalfAmount(e.target.value)}
                className="rounded-md"
                _focus={{ borderColor: "#0d9488", boxShadow: "0 0 0 1px #14b8a6" }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter className="flex flex-col md:flex-row gap-2 w-full">
            <Button
              colorScheme="teal"
              onClick={handleHalfPayment}
              isDisabled={!halfAmount}
              className="w-full md:w-auto"
            >
              Submit
            </Button>
            <Button
              variant="outline"
              onClick={half_payment.onClose}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* Create Sale Modal */}
      <Modal isOpen={createDisclosure.isOpen} onClose={createDisclosure.onClose} size={{ base: "md", sm: "md", md: "lg" }}>
        <ModalOverlay />
        <ModalContent
          className="rounded-lg shadow-xl"
          mx={{ base: 4, sm: "auto" }} // Add margin-x on small screens
          p={{ base: 2, md: 4 }}       // Padding inside the modal
        >
          <ModalHeader className="text-lg font-semibold text-gray-700">
            Add A New Sale
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody className="space-y-4">
            <CreateSale
              onClose={createDisclosure.onClose}
              refresh={fetchPurchases}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500", color: "white" }}
              className="border border-red-500 w-full"
              onClick={createDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* Update Sale Modal */}
      <Modal
        isOpen={updateDisclosure.isOpen}
        onClose={updateDisclosure.onClose}
        size={{ base: "md", sm: "sm", md: "md", lg: "lg" }} // Responsive modal size
      >
        <ModalOverlay />
        <ModalContent
          className="rounded-lg shadow-md"
          mx={{ base: 4, md: "auto" }} // Margin for mobile screens
          p={{ base: 2, md: 4 }}
        >
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Edit Sale
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <UpdateSale sale={selectedSale} onClose={updateDisclosure.onClose} />
          </ModalBody>

          <ModalFooter className="flex flex-col md:flex-row gap-2 w-full">
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full md:w-auto"
              onClick={updateDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* Assign Employee Modal */}
      <Modal
        isOpen={assignDisclosure.isOpen}
        onClose={assignDisclosure.onClose}
        size={{ base: "md", sm: "sm", md: "md", lg: "lg" }} // Responsive sizes
      >
        <ModalOverlay />
        <ModalContent
          className="rounded-lg shadow-md"
          mx={{ base: 4, md: "auto" }} // Padding for mobile view
          p={{ base: 2, md: 4 }}
        >
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Assign Employee
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Assign
              empData={employees}
              saleData={selectedSale}
              onClose={assignDisclosure.onClose}
            />
          </ModalBody>

          <ModalFooter className="flex flex-col md:flex-row gap-2 w-full">
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500" }}
              className="border border-red-500 hover:text-white w-full md:w-auto"
              onClick={assignDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* Remarks Modal */}
      <Modal
        isOpen={remarksDisclosure.isOpen}
        onClose={remarksDisclosure.onClose}
        size={{ base: "md", sm: "sm", md: "md", lg: "lg" }} // Responsive sizes
      >
        <ModalOverlay />
        <ModalContent
          className="rounded-lg shadow-md"
          mx={{ base: 4, md: "auto" }}  // Margin for smaller screens
          p={{ base: 2, md: 4 }}
        >
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Remarks
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text
              className="p-3 mb-5 rounded-md"
              bg="orange.100"
              fontSize={{ base: "sm", md: "md" }}
              whiteSpace="pre-wrap" // keeps line breaks and formatting
            >
              {comment || "No remarks provided."}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>


      {/* sample modal */}
      <Modal
        isOpen={sampleDisclosure.isOpen}
        onClose={sampleDisclosure.onClose}
        size={{ base: "md", sm: "sm", md: "md", lg: "lg" }} // Responsive sizing
      >
        <ModalOverlay />
        <ModalContent
          className="rounded-lg shadow-md"
          mx={{ base: 4, md: "auto" }}  // Side margins for mobile
          p={{ base: 2, md: 4 }}
        >
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Approve Sample
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <SampleModal
              sale={selectedSale}
              onClose={sampleDisclosure.onClose}
              refresh={fetchPurchases}
              approveStatus={approveStatus}
            />
          </ModalBody>

          <ModalFooter className="flex justify-end gap-2">
            <Button
              bg="white"
              color="red.500"
              border="1px solid"
              borderColor="red.500"
              _hover={{ bg: "red.500", color: "white" }}
              className="w-full md:w-auto"
              onClick={sampleDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* sales status Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={onImageClose}
        size={{ base: "md", sm: "sm", md: "md", lg: "lg" }} // Responsive modal sizes
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          className="rounded-lg shadow-lg"
          mx={{ base: 4, md: "auto" }} // Margin for mobile padding
          p={{ base: 2, md: 4 }}
        >
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Sales Status
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Salestatus
              designUrl={selectedDesign}
              purchaseData={selectedData}
              approve={customerApprove}
              onClose={onImageClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>



      {/* sample image Modal */}

      <Modal
        isOpen={isSampleModalOpen}
        onClose={onSampleClose}
        size={{ base: "md", sm: "sm", md: "md", lg: "lg" }} // Responsive sizes
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          className="rounded-lg shadow-lg"
          mx={{ base: 4, md: "auto" }} // Padding for mobile
          p={{ base: 2, md: 4 }}
        >
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Sample Image
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Sampleimage purchaseData={selectedData} onClose={onSampleClose} />
          </ModalBody>
        </ModalContent>
      </Modal>


      {/* Order Image Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={onOrderClose}
        size={{ base: "md", sm: "sm", md: "md", lg: "lg" }} // Responsive sizes
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          className="rounded-lg shadow-lg"
          mx={{ base: 4, md: "auto" }}
          p={{ base: 2, md: 4 }}
        >
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Order Image
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Orderimage purchaseData={selectedData} onClose={onOrderClose} />
          </ModalBody>
        </ModalContent>
      </Modal>


      {/* View Design Modal */}
      <Modal
        isOpen={isDesignModalOpen}
        onClose={onDesignerClose}
        size={{ base: "md", sm: "sm", md: "md", lg: "lg" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          className="rounded-lg shadow-lg"
          mx={{ base: 4, md: "auto" }}
          p={{ base: 2, md: 4 }}
        >
          <ModalHeader className="text-lg  font-semibold text-gray-800">
            View Design
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDesign && selectedData && (
              <ViewDesign
                designUrl={selectedDesign}
                purchaseData={selectedData}
                approve={customerApprove}
                onClose={onDesignerClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* account payment preview */}
      <Modal
        isOpen={isAccountpreviewOpen}
        onClose={onAccountpreviewClose}
        size={{ base: "md", sm: "sm", md: "md", lg: "lg" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className="rounded-lg shadow-lg p-4">
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Account Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex justify-center">
            <Img
              src={selectedData?.token_ss}
              alt="Account Screenshot"
              maxH={{ base: "200px", md: "400px" }}
              maxW="100%"
              objectFit="contain"
              className="rounded-md"
            />
          </ModalBody>
        </ModalContent>
      </Modal>


      {/* preview invoice */}
      <Modal
        isOpen={isInvoicepreviewOpen}
        onClose={onInvoicepreviewClose}
        size={{ base: "md", sm: "md", md: "lg", lg: "xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className="rounded-lg shadow-lg p-4">
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Invoice Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col space-y-4">
            <Text className="text-gray-700">{selectedData?.invoice_remark || "No remarks available."}</Text>
            <Img
              src={selectedData?.invoice_image}
              alt="Invoice Image"
              maxH={{ base: "200px", md: "400px" }}
              maxW="100%"
              objectFit="contain"
              className="rounded-md shadow-sm"
            />
          </ModalBody>
        </ModalContent>
      </Modal>



      {/* Modal for invoice upload, payment and dispatch */}
      <Modal
        isOpen={invoiceDisclosure.isOpen}
        onClose={invoiceDisclosure.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          width={{ base: "90%", }}
          px={{ base: 4, sm: 6, md: 8 }}
          py={6}
          borderRadius="lg"
          boxShadow="lg"
        >
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Upload Invoice
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UploadInvoice
              sale_id={saleId}
              invoicefile={invoiceFile}
              onClose={invoiceDisclosure.onClose}
            />
          </ModalBody>
          <ModalFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500", color: "white" }}
              className="border border-red-500 w-full sm:w-auto"
              mr={{ base: 0, sm: 3 }}
              onClick={invoiceDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>



      {/* Modal update proforma invoice */}
      <Modal
        isOpen={proformainvoiceDisclosure.isOpen}
        onClose={proformainvoiceDisclosure.onClose}
        size={{ base: "md", sm: "md", md: "lg", lg: "xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className="rounded-lg shadow-lg p-4">
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Upload Proforma Invoice
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProformaInvoice
              sale_id={saleId}
              invoicefile={invoiceFile}
              onClose={proformainvoiceDisclosure.onClose}
            />
          </ModalBody>
          <ModalFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500", color: "white" }}
              className="border border-red-500 w-full sm:w-auto"
              mr={{ base: 0, sm: 3 }}
              onClick={proformainvoiceDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* Track Production Modal */}
      <Modal
        isOpen={isProductionModalOpen}
        onClose={onProductionClose}
        size={{ base: "md", sm: "md", md: "lg", lg: "xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className="rounded-lg shadow-lg p-4">
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Track Production
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TrackProduction
              designProcess={designProcess}
              productionProcess={selectedProcess}
              stage={stage}
            />
          </ModalBody>
        </ModalContent>
      </Modal>


      {/* token modal */}
      <Modal
        isOpen={tokenDisclosure.isOpen}
        onClose={tokenDisclosure.onClose}
        size={{ base: "md", sm: "md", md: "lg", lg: "xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className="rounded-lg shadow-lg p-4">
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Sample Token Amount
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TokenAmount
              sale={saleId}
              onClose={tokenDisclosure.onClose}
              refresh={fetchPurchases}
              tokenAmount={tokenAmount}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500", color: "white" }}
              className="border border-red-500 hover:text-white w-full ml-2"
              onClick={tokenDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* Modal for  payment */}
      <Modal
        isOpen={paymentDisclosure.isOpen}
        onClose={paymentDisclosure.onClose}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent width={{ base: "90%" }}
          px={{ base: 4, sm: 6, md: 8 }}
          py={6}
          borderRadius="lg"
          boxShadow="lg" >
          <ModalHeader className="text-lg font-semibold text-gray-800">
            Payment
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px={{ base: 4, md: 6 }} py={{ base: 3, md: 5 }}>
            <PaymentModal
              sale_id={saleId}
              payment={paymentfile}
              verify={verifystatus}
              assign={assignId}
              payfor={paymentFor}
              onClose={paymentDisclosure.onClose}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500", color: "white" }}
              className="border border-red-500 hover:text-white w-full ml-0 md:ml-2"
              mr={{ base: 0, md: 3 }}
              onClick={paymentDisclosure.onClose}
              size="md"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Pagination page={pages} setPage={setPages} length={purchases.length} />
    </div>
  );
};

export default Sales;