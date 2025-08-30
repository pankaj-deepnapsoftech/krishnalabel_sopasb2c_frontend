//@ts-nocheck
import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Divider,
  Button,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Image,
  Textarea,
  RadioGroup,
  Radio,
  Img,
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh, MdOutlineTaskAlt } from "react-icons/md";
import TrackProduction from "./TrackProduction";
import Pagination from "../../pages/Pagination";
import { BiHappyHeartEyes, BiSad } from "react-icons/bi";
import ViewDesign from "./ViewDesign";
import Deliverystatus from "./Deliverystatus";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import UploadPayment from "./UploadPayment";
import DeliveryProof from "./DeliveryProof";
import moment from "moment";
import TokenProof from "./TokenProof";
import { socket } from '../../socket';
interface Purchase {
  GST: {
    CGST: number;
    SGST: number;
    IGST: number;
  };
  Status: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  product_name: { name: string; process?: any };
  product_qty: number;
  product_type: string;
  designFile: string;
  _id: string;
}

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["access_token"]);
  const [cookiess] = useCookies();
  const role = cookiess?.role;
  const [selectedProcess, setSelectedProcess] = useState<any>([]);
  const [payment, setPayment] = useState("");
  const [purchaseId, setPurchaseId] = useState("");
  const [selectedData, setSelectedData] = useState<any>([]);
  const [designProcess, setDesignProcess] = useState<any>([]);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);

  const [trackingId, setTrackingId] = useState("");
  const [orderFile, setOrderFile] = useState("");
  const [webLink, setWebLink] = useState("");
  const [pages, setPages] = useState(1);
  const [assignedData, setAssignedData] = useState([]);
  const [customerApprove, setCustomerApprove] = useState("");
  const [tokenFile, setTokenFile] = useState("");
  const [amount, setAmount] = useState();
  const [stage, setStage] = useState("");
  const [deliveryproofuser, setdeliveryproofuser] = useState("");
  const [halfPaymentId, setHalfPaymentId] = useState(null);
  const [halfPaymentProof, setHalfPaymentProof] = useState(null);
  const [productFile, setProductFile] = useState();
  const [proformaFile, setproformaFile] = useState();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    isOpen: isProductionModalOpen,
    onOpen: onProductionOpen,
    onClose: onProductionClose,
  } = useDisclosure();
  const {
    isOpen: isImageModalOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();

  const {
    isOpen: isPaymentOpen,
    onOpen: onPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure();

  const {
    isOpen: isAccountpreviewOpen,
    onOpen: onAccountpreviewOpen,
    onClose: onAccountpreviewClose,
  } = useDisclosure();

  const {
    isOpen: isDeliveryOpen,
    onOpen: onDeliveryOpen,
    onClose: onDeliveryClose,
  } = useDisclosure();

  const {
    isOpen: isProofOpen,
    onOpen: onProofOpen,
    onClose: onProofClose,
  } = useDisclosure();

  const {
    isOpen: isDeliverystatusOpen,
    onOpen: onDeliverystatusOpen,
    onClose: onDeliverystatusClose,
  } = useDisclosure();

  const {
    isOpen: isTokenOpen,
    onOpen: onTokenOpen,
    onClose: onTokenClose,
  } = useDisclosure();

  const {
    isOpen: isProductOpen,
    onOpen: onProductOpen,
    onClose: onProductClose,
  } = useDisclosure();

  const {
    isOpen: isProformaOpen,
    onOpen: onProformaOpen,
    onClose: onProformaClose,
  } = useDisclosure();

  const { isOpen: isHalfPaymentOpen,
    onOpen: onHalfPaymentOpen,
    onClose: isHalfPaymentClose, } = useDisclosure()

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const token = cookies.access_token;
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}purchase/customer-get?page=${pages}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPurchases(response.data?.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch purchase data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleChangesApply = (data) => {
      if (data === true) {
        fetchPurchases();
        socket.off('changesapply', handleChangesApply); // Remove listener after first call
      }
    };
    
    socket.on('changesapply', handleChangesApply);

    return () => {
      socket.off('changesapply', handleChangesApply); // Prevent duplication on rerender
    };
  });
  

  const handleApprove = async (purchaseId: string) => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
      const token = cookies.access_token;
      if (!token) throw new Error("Authentication token not found");

      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/approve-status/${purchaseId}`,
        { Status: "Approved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Purchase approved successfully!");
      socket.emit('notificationdatachange', true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to approve purchase"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDesignModal = (
    designFile: string,
    purchase: object,
    approve: string
  ) => {
    setSelectedDesign(designFile);
    setSelectedData(purchase);
    setCustomerApprove(approve);
    onImageOpen();
  };




  const openAccountModal = (
    designFile: string,
    purchase: object,
    approve: string
  ) => {
    setSelectedData(purchase);
    onAccountpreviewOpen();
  };

  const handlePayment = (id: any, payment_ss: string) => {
    setPurchaseId(id);
    setPayment(payment_ss);
    onPaymentOpen();
  };

  const handleDelivery = (trackingId: string, link: string) => {
    setTrackingId(trackingId);
    setWebLink(link);
    onDeliveryOpen();
  };

  const handleProof = (id: any, customerproof: any, dispatcherproof: any,) => {
    setPurchaseId(id);
    if (customerproof) {
      setOrderFile(customerproof);
      setdeliveryproofuser("Customer");
    }
    if (dispatcherproof) {
      setOrderFile(dispatcherproof);
      setdeliveryproofuser("Dispatcher");
    }
    onProofOpen();
  };

  const handledeliverystatus = (id: any, approve: any) => {
    setPurchaseId(id);
    setCustomerApprove(approve);
    onDeliverystatusOpen()
  }
  
  const calculateTotalPrice = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstVal = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstVal;
    return totalPrice;
  };

  const handleToken = (id: any, amount: number, tokenFile: any) => {
    setPurchaseId(id);
    setTokenFile(tokenFile);
    setAmount(amount);
    onTokenOpen();
  };

  const handleProduct = (file: any) => {
    setProductFile(file);
    onProductOpen();
  };

  const handleHalfPaymentProf = async () => {
    if (!halfPaymentProof) {
      alert("image is required field");
      return;
    };
    const formData = new FormData();
    formData.append("halfPayment", halfPaymentProof);
    formData.append("half_payment_approve", false)
    formData.append("half_payment_status", "Pending Approvel")

    isHalfPaymentClose()
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}purchase/half-payement/${halfPaymentId._id}`, formData, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      toast.success(res.data.message);
      socket.emit('notificationdatachange', true);
      console.log("half payment is payed");
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false);
    }

  };

  const handleviewProform = (file: any) => {
    setproformaFile(file);
    onProformaOpen();
  };



  useEffect(() => {
    fetchPurchases();
  }, [pages]);

  return (
    <div className="md:ml-80 sm:ml-0 overflow-x-hidden">
      <HStack align="center" justify="space-between">
        <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black">
          Purchase History
        </h3>
        <Button
          fontSize="14px"
          paddingX="12px"
          paddingY="3px"
          width="100px"
          onClick={fetchPurchases}
          leftIcon={<MdOutlineRefresh />}
          color="#319795"
            borderColor="#319795"
          variant="outline"
        >
          Refresh
        </Button>
      </HStack>

      <Box p={5}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <Spinner size="xl" />
          </Box>
        ) : (
          purchases.map((purchase) => (
            <Box
              key={purchase?._id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
              bg="white"
              className="relative p-4 mt-3"
              w={{ base: "100%", md: "auto" }} // Full width on smaller screens, auto on medium screens
            >
              <Box
                className={`absolute top-0 left-0 h-full w-2 ${purchase?.Status === "Pending" ? "bg-red-500" : "bg-green-500"
                  }`}
              ></Box>

              <HStack justify="space-between" mb={3} flexWrap="wrap" gap={4}>
                <VStack align="start" w={{ base: "100%", md: "48%" }}>
                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    Date: {new Date(purchase?.createdAt).toLocaleDateString()}
                  </Text>
                  <Text
                    fontSize={{ base: "xs", sm: "sm" }}
                    className="text-gray-500"
                  >
                    Time: {new Date(purchase?.createdAt).toLocaleTimeString()}
                  </Text>
                </VStack>
                <VStack
                  align={{ base: "start", md: "end" }}
                  w={{ base: "100%", md: "48%" }}
                >
                  {purchase?.Status === "Pending" ? (
                    <Button
                      size="sm"
                      bg="orange.400"
                      _hover={{ bg: "orange.500" }}
                      color="white"
                      disabled={isSubmitting}
                      onClick={() => handleApprove(purchase?._id)}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Badge colorScheme="green" fontSize="sm">
                      Sale: {purchase?.Status}
                    </Badge>
                  )}

                  {purchase?.customer_approve === "Reject" ? (
                    <>
                      <Badge colorScheme="red" fontSize="sm">
                        Design: {purchase?.customer_approve}
                      </Badge>

                      <Text className="text-red-500">
                        <strong>Feedback:</strong>{" "}
                        {purchase?.customer_design_comment}
                      </Text>
                    </>
                  ) : purchase?.customer_approve === "Approve" ? (
                    <Badge colorScheme="green" fontSize="sm">
                      Design: {purchase?.customer_approve}
                    </Badge>
                  ) : null}

                  {purchase?.token_status ? (
                    <Badge colorScheme="green" fontSize="sm">
                      Token Amount: Paid
                    </Badge>
                  ) : null}

                  {purchase?.half_payment_status && (
                    <Badge colorScheme={purchase?.half_payment_status === 'pending' ? "orange" : "green"} fontSize="sm">
                      Half payment : {purchase?.half_payment_status}
                    </Badge>
                  )}

                  {purchase?.sale_design_approve == "Approve" ? (
                    <Badge colorScheme="green" fontSize="sm">
                      Sale Design Approval: Approve
                    </Badge>
                  ) : null}

                  {purchase?.sale_design_approve == "Reject" ? (
                    <Badge colorScheme="red" fontSize="sm">
                      Sale Design Approval: Reject
                      <p>Feedback: {purchase?.sale_design_comment}</p>
                    </Badge>
                  ) : null}

                  {purchase?.isSampleApprove ? (
                    <Badge colorScheme="green" fontSize="sm">
                      Sample Product: Approved
                    </Badge>
                  ) : null}

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

                  {purchase && purchase?.paymet_status ? (
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
                  ) : null}

                  {purchase?.product_status ? (
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
                  ) : null}
                </VStack>
              </HStack>

              <Divider my={2} />
              <HStack
                justify="space-between"
                spacing={3}
                mt={3}
                flexWrap="wrap"
                gap={4}
              >
                <VStack align="start" w={{ base: "100%", md: "48%" }}>
                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    Product Name:{" "}
                    <span className="font-normal">
                      {purchase?.product_id?.[0]?.name}
                    </span>
                  </Text>

                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    Quantity:{" "}
                    <span className="font-normal">{purchase?.product_qty}</span>
                  </Text>
                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    Price:{" "}
                    <span className="font-normal">
                      {purchase?.price * purchase?.product_qty}
                    </span>
                  </Text>

                  {purchase?.tracking_id && purchase?.tracking_web ? (
                    <Text
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() =>
                        handleDelivery(
                          purchase?.tracking_id,
                          purchase?.tracking_web
                        )
                      }
                    >
                      Track Delivery
                    </Text>
                  ) : null}
                </VStack>

                <VStack
                  align={{ base: "start", md: "end" }}
                  w={{ base: "100%", md: "48%" }}
                >
                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    GST: <span className="font-normal">{purchase?.GST} %</span>
                  </Text>
                  <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold">
                    Total Price:{" "}
                    <span className="font-normal">
                      {calculateTotalPrice(
                        purchase?.price,
                        purchase?.product_qty,
                        purchase?.GST
                      ).toFixed(2)}
                    </span>
                  </Text>
                  
                  {purchase?.productFile ? (
                    <Text
                      className="text-blue-500 font-semibold underline cursor-pointer"
                      onClick={() => handleProduct(purchase?.productFile)}
                    >
                      Product Image
                    </Text>
                  ) : null}

                  {purchase?.token_amt ? (
                    <Text
                      className="text-blue-500 underline font-semibold cursor-pointer"
                      onClick={() =>
                        handleToken(
                          purchase?._id,
                          purchase?.token_amt,
                          purchase?.token_ss
                        )
                      }
                    >
                      {purchase?.token_status
                        ? "See Token Amount"
                        : "Pay Now For Sample"}
                    </Text>
                  ) : null}
                </VStack>
              </HStack>

              <Divider my={2} />
              <div className="flex flex-wrap gap-3">
                {purchase.Status === "Approved" && (
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

                {purchase?.designFile && (
                  <Button
                    size={{ base: "xs", sm: "sm" }} // Smaller size for mobile
                    leftIcon={<IoEyeSharp />}
                    bgColor="white"
                    _hover={{ bgColor: "orange.500" }}
                    className="border border-orange-500 hover:text-white w-full sm:w-auto"
                    onClick={() =>
                      openDesignModal(
                        purchase?.designFile,
                        purchase,
                        purchase?.customer_approve
                      )
                    }
                  >
                    View Design
                  </Button>
                )}

                {/* {purchase?.token_status && (
                  <Button
                    size={{ base: "xs", sm: "sm" }} // Smaller size for mobile
                    leftIcon={<IoEyeSharp />}
                    bgColor="white"
                    _hover={{ bgColor: "orange.500" }}
                    className="border border-orange-500 hover:text-white w-full sm:w-auto"
                    onClick={() =>
                      openAccountModal(
                        purchase?.designFile,
                        purchase,
                        purchase?.customer_approve
                      )
                    }
                  >
                    Preview
                  </Button>
                )} */}

                {purchase?.invoice_image && (
                  <Button
                    size={{ base: "xs", sm: "sm" }} // Smaller size for mobile
                    leftIcon={<IoEyeSharp />}
                    bgColor="white"
                    _hover={{ bgColor: "orange.500" }}
                    className="border border-orange-500 hover:text-white w-full sm:w-auto"
                    onClick={() =>
                      openInvoiceModal(
                        purchase?.invoice_image,
                        purchase,
                        purchase?.customer_invoice_approve
                      )
                    }
                  >
                    Preview Invoice
                  </Button>
                )}

                {purchase?.half_payment && (
                  <Button
                    size={{ base: "xs", sm: "sm" }} // Smaller size for mobile
                    leftIcon={<IoEyeSharp />}
                    bgColor="white"
                    _hover={{ bgColor: "orange.500" }}
                    className="border border-orange-500 hover:text-white w-full sm:w-auto"
                    onClick={() => {
                      onHalfPaymentOpen();

                      const filterdata = purchases.filter((item) => item._id === purchase?._id)[0];
                      setHalfPaymentId(filterdata);
                    }
                    }
                  >
                    View and Pay
                  </Button>
                )}

                {purchase?.invoice && (
                  <>
                    <Button
                      size={{ base: "xs", sm: "sm" }}
                      leftIcon={<IoEyeSharp />}
                      bgColor="white"
                      _hover={{ bgColor: "blue.500" }}
                      className="border border-blue-500 hover:text-white w-full sm:w-auto"
                    >
                      <a
                        href={purchase?.invoice}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Invoice
                      </a>
                    </Button>

                    <Button
                      size={{ base: "xs", sm: "sm" }}
                      leftIcon={<FaCloudUploadAlt />}
                      bgColor="white"
                      _hover={{ bgColor: "blue.500" }}
                      className="border border-blue-500 hover:text-white w-full sm:w-auto"
                      onClick={() =>
                        handlePayment(
                          purchase?._id,
                          purchase?.customer_pyement_ss
                        )
                      }
                    >
                      Attach Payment
                    </Button>
                  </>
                )}

                {purchase?.tracking_id && purchase?.tracking_web && (
                  <Button
                    size={{ base: "xs", sm: "sm" }}
                    leftIcon={<FaCloudUploadAlt />}
                    bgColor="white"
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white w-full sm:w-auto"
                    onClick={() =>
                      handleProof(purchase?._id, purchase?.customer_order_ss, purchase?.dispatcher_order_ss)
                    }
                  >
                    Attach Delivery Proof
                  </Button>
                )}

                {purchase?.tracking_id && purchase?.tracking_web && (
                  <Button
                    size={{ base: "xs", sm: "sm" }}
                    leftIcon={<FaCloudUploadAlt />}
                    bgColor="white"
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white w-full sm:w-auto"
                    onClick={() =>
                      handledeliverystatus(purchase?._id, purchase?.delivery_status_by_customer)
                    }
                  >
                    Delivery Status
                  </Button>
                )}

                {purchase?.performaInvoice && (
                  <Button
                    size={{ base: "xs", sm: "sm" }}
                    leftIcon={<IoEyeSharp />}
                    bgColor="white"
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white w-full sm:w-auto"
                    onClick={() =>
                      handleviewProform(purchase?.performaInvoice)
                    }
                  >
                    Proforma Invoice
                  </Button>
                )}
              </div>
            </Box>
          ))
        )}
      </Box>

      {/* Track Production Modal */}
      <Modal isOpen={isProductionModalOpen} onClose={onProductionClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Track Production</ModalHeader>
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

      {/* View Design Modal */}
      <Modal isOpen={isImageModalOpen} onClose={onImageClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Design</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDesign && selectedData && (
              <ViewDesign
                designUrl={selectedDesign}
                purchaseData={selectedData}
                approve={customerApprove}
                onClose={onImageClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>


      {/* delivery Status Modal */}
      <Modal isOpen={isDeliverystatusOpen} onClose={onDeliverystatusClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Design</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedData && (
              <Deliverystatus
                purchaseData={purchaseId}
                approve={customerApprove}
                onClose={onDeliverystatusClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* account payment preview */}
      <Modal isOpen={isAccountpreviewOpen} onClose={onAccountpreviewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Img src={selectedData?.token_ss} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* payment modal */}
      <Modal isOpen={isPaymentOpen} onClose={onPaymentClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {purchaseId && (
              <UploadPayment
                id={purchaseId}
                paymentFile={payment}
                onClose={onPaymentClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* delivery modal */}
      <Modal isOpen={isDeliveryOpen} onClose={onDeliveryClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Track Delivery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              align="start"
              spacing={4}
              p={4}
              bg="white"
              rounded="md"
              boxShadow="lg"
              maxWidth="lg"
              w="full"
              className="border border-gray-300"
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="orange.500"
                className="text-center"
              >
                Here is the link and tracking ID of the delivery
              </Text>

              <Text
                color="red.600"
                className=" flex items-start w-full justify-start flex-col"
              >
                <strong className="text-black">Website Link:</strong>
                <a href={webLink} className=" w-full " target="_blank">
                  {webLink}
                </a>
              </Text>

              <Text color="red.600">
                <strong className="text-black">Tracking ID:</strong>{" "}
                {trackingId}
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* delivery proof modal */}
      <Modal isOpen={isProofOpen} onClose={onProofClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Delivery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {purchaseId && (
              <DeliveryProof
                id={purchaseId}
                orderfile={orderFile}
                userRole={role}
                deliveryproofupload={deliveryproofuser}
                onClose={onProofClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* token proof modal */}
      <Modal isOpen={isTokenOpen} onClose={onTokenClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {purchaseId && (
              <TokenProof
                id={purchaseId}
                tokenFile={tokenFile}
                amount={amount}
                onClose={onTokenClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* product proof modal */}
      <Modal isOpen={isProductOpen} onClose={onProductClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Img src={productFile} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isHalfPaymentOpen} onClose={isHalfPaymentClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Half Payment And Pay</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-3">
              <p className="text-gray-600 mb-6 text-center">
                Half Price is: <span className="font-semibold text-black">₹ {halfPaymentId?.half_payment}</span>
              </p>

              {halfPaymentId?.half_payment_image &&
                <div className="py-2 w-full text-center">
                  <a href={halfPaymentId?.half_payment_image} target="_blank">
                    Click to view
                  </a>
                </div>

              }

              {!halfPaymentId?.half_payment_approve && !halfPaymentId?.half_payment_approve && <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-500 mb-2">Upload an Image</p>
                <label className="cursor-pointer">
                  <input type="file" className="hidden" onChange={(e) => setHalfPaymentProof(e.target.files[0])} />
                  <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Choose Image
                  </div>
                </label>
              </div>}
            </div>
            <div className="pt-4 text-white font-medium flex gap-3 " >
              <button className="py-2 px-3 bg-blue-600 rounded-lg" onClick={handleHalfPaymentProf}
                disabled={isSubmitting} >submit</button>
              <button className="py-2 px-3 bg-blue-600 rounded-lg" onClick={isHalfPaymentClose} >Close</button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* proforma invoice modal */}
      <Modal isOpen={isProformaOpen} onClose={onProformaClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Pro Forma Invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Click to view the <a className="text-blue-500 underline" href={proformaFile} target="_blank">Pro Forma Invoice</a>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Pagination page={pages} setPage={setPages} length={purchases.length} />
    </div>
  );
};

export default PurchaseHistory;
