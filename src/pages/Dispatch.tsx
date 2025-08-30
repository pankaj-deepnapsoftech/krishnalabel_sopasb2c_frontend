import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useColorModeValue,
  VStack,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlineRefresh } from "react-icons/md";
import UploadInvoice from "./UploadInvoice";
import PaymentModal from "./PaymentModal";
import { TbTruckDelivery } from "react-icons/tb";
import DispatchData from "./DispatchData";
import { toast } from "react-toastify";
import DeliveryProof from "../components/UserDashboard/DeliveryProof";
import Pagination from "./Pagination";
import { socket } from '../socket';
const Dispatch = () => {
  const [cookies] = useCookies();
  const role = cookies?.role;
  const [data, setData] = useState([]);
  const [saleId, setSaleId] = useState("");
  const [trackId,setTrackId] = useState();
  const [trackLink,setTrackLink] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [purchaseId, setPurchaseId] = useState("");
  const DispatchDisclosure = useDisclosure();
  const [orderFile, setOrderFile] = useState("");
  const [pages, setPages] = useState(1);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(""); 
  const [selectedProductStatus, setSelectedProductStatus] = useState(""); 
  const [deliveryproofuser, setdeliveryproofuser] = useState(""); 
  const [limit, setLimit] = useState(10);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}production-process/accountant-data?page=${pages}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      setData(response.data?.data);    
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pages, limit]);

 
  useEffect(() => {
    const handleChangesApply = (data:any) => {
      if (data === true) {
        fetchData();
        socket.off('changesapply', handleChangesApply); // Remove listener after first call
      }
    };
    
    socket.on('changesapply', handleChangesApply);

    return () => {
      socket.off('changesapply', handleChangesApply); // Prevent duplication on rerender
    };
  });

  const calculateTotal = (price: number, qty: number, gst: number) => {
    const basePrice = price * qty;
    const gstval = (basePrice * gst) / 100;
    const totalPrice = basePrice + gstval;
    return totalPrice;
  };

  const handleDispatch = (id: any , trackId:any, link:any) => {
    setSaleId(id);
    setTrackId(trackId);
    setTrackLink(link);
    DispatchDisclosure.onOpen();
  };

  // Filter data based on selected dropdown values
  const filteredData = data?.filter((acc: any) => {
    const paymentStatus = acc?.bom?.sale_id[0]?.paymet_status || "";
    const productStatus = acc?.bom?.sale_id[0]?.product_status || "";

    return (
      (selectedPaymentStatus === "" ||
        paymentStatus === selectedPaymentStatus) &&
      (selectedProductStatus === "" || productStatus === selectedProductStatus)
    );
  });

  const {
      isOpen: isProofOpen,
      onOpen: onProofOpen,
      onClose: onProofClose,
    } = useDisclosure();

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

  return (
    <div className="overflow-x-hidden">
      <Box>
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
          Completed Products
        </div>
        <div className="flex flex-col md:flex-row  justify-between gap-4 mb-4">
          {/* Payment Status Filter */}
          <FormControl className="w-full md:w-auto">
            <FormLabel fontSize="md">Payment Status</FormLabel>
            <Select
              placeholder="All"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              size="md"
              className="h-10"
            >
              <option value="Pending">Pending</option>
              <option value="Paied">Paid</option>
            </Select>
          </FormControl>

          {/* Product Status Filter */}
          <FormControl className="w-full  md:w-auto">
            <FormLabel fontSize="m">Product Status</FormLabel>
            <Select
              placeholder="All"
              value={selectedProductStatus}
              onChange={(e) => setSelectedProductStatus(e.target.value)}
              size="md"
              className="h-10"
            >
              <option value="Dispatch">Dispatch</option>
              <option value="Delivered">Delivered</option>
            </Select>
          </FormControl>

          {/* Refresh Button and Limit Selector */}
          <div className="flex flex-col sm:flex-row gap-2 w-full items-end md:w-auto ">
            <Button
              fontSize="14px"
              paddingX="12px"
              paddingY="2px"
              height="40px"
              width={{ base: "100%", sm: "auto" }}
              leftIcon={<MdOutlineRefresh />}
              onClick={fetchData}
              color="#319795"
              borderColor="#319795"
              variant="outline"
            >
              Refresh
            </Button>

            <Select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="h-10"
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


      </Box>

      {filteredData?.map((acc: any) => (
        <Box
          key={acc?._id}
          maxW="100%"
          overflowX="auto"
          borderWidth="1px"
          borderRadius="md"
          borderColor="gray.200"
        >
          <Box
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
            p={4}
            w="100%"
            position="relative"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              h="100%"
              w={2}
              bg={
                acc?.bom?.sale_id[0]?.product_status === "Dispatch"
                  ? "orange"
                  : "green"
              }
              borderRadius="md"
            />

            <HStack justify="space-between" mb={3} flexWrap="wrap" gap={4}>
              {/* Left Section */}
              <VStack align="start" w={{ base: "100%", md: "48%" }}>
                <Text fontWeight="bold" fontSize="lg">
                  Sale By:{" "}
                  {acc?.bom?.sale_id[0]?.user_id[0]?.first_name || "N/A"}
                </Text>
                <Text fontWeight="bold" fontSize="sm" className="underline">
                  Date:{" "}
                  {new Date(
                    acc?.bom?.sale_id[0]?.createdAt
                  ).toLocaleDateString()}
                </Text>
              </VStack>

              {/* Right Section */}
              <VStack
                align={{ base: "start", md: "end" }}
                w={{ base: "100%", md: "48%" }}
              >
                {acc?.bom?.sale_id[0]?.paymet_status && (
                  <Badge
                    colorScheme={
                      acc?.bom?.sale_id[0]?.paymet_status === "Pending"
                        ? "orange"
                        : "green"
                    }
                    fontSize="sm"
                  >
                    Payment Status:{" "}
                    {acc?.bom?.sale_id[0]?.paymet_status === "Paied"
                      ? "Paid"
                      : acc?.bom?.sale_id[0]?.paymet_status}
                  </Badge>
                )}

                {acc?.bom?.sale_id[0]?.product_status && (
                  <Badge
                    colorScheme={
                      acc?.bom?.sale_id[0]?.product_status === "Dispatch"
                        ? "orange"
                        : "green"
                    }
                    fontSize="sm"
                  >
                    Product Status: {acc?.bom?.sale_id[0]?.product_status}
                  </Badge>
                )}
              </VStack>
            </HStack>

            <Divider />

            <HStack
              justify="space-between"
              spacing={3}
              mt={3}
              flexWrap="wrap"
              gap={4}
            >
              <VStack align="start" w={{ base: "100%", md: "48%" }}>
                <Text fontSize="sm">
                  <strong>Customer:</strong>{" "}
                  {acc?.bom?.sale_id[0]?.customer_id[0]?.full_name || "N/A"}
                </Text>
                <Text fontSize="sm">
                  <strong>Product Name:</strong>{" "}
                  {acc?.bom?.sale_id[0]?.product_id[0]?.name || "N/A"}
                </Text>
                <Text fontSize="sm">
                  <strong>Quantity:</strong>{" "}
                  {acc?.bom?.sale_id[0]?.product_qty || "N/A"}
                </Text>
              </VStack>

              <VStack
                align={{ base: "start", md: "end" }}
                w={{ base: "100%", md: "48%" }}
              >
                {(role == "Accountant" || role == "Sales" || role == "admin") ? (
                  <Text fontSize="sm">
                    <strong>Price:</strong>{" "}
                    {acc?.bom?.sale_id[0]?.price *
                      acc?.bom?.sale_id[0]?.product_qty || "N/A"}
                  </Text>
                ) : null}
                <Text fontSize="sm">
                  <strong>GST :</strong> {acc?.bom?.sale_id[0]?.GST}%
                </Text>
                {(acc?.bom?.sale_id[0]?.delivery_status_by_customer) ? (
                <Text fontSize="sm">
                  <strong>Delivery Status :</strong> {acc?.bom?.sale_id[0]?.delivery_status_by_customer}
                  <br />
                    {acc?.bom?.sale_id[0]?.delivery_status_comment_by_customer && (
                      <strong>Delivery Feedback :</strong>
                    )}
                    {acc?.bom?.sale_id[0]?.delivery_status_comment_by_customer}
                </Text>
                ) : null}

                {(role == "Accountant" || role == "Sales" || role == "admin") ? (
                  <Text fontSize="sm">
                    <strong>Total Price:</strong>{" "}
                    {calculateTotal(
                      acc?.bom?.sale_id[0]?.price,
                      acc?.bom?.sale_id[0]?.product_qty,
                      acc?.bom?.sale_id[0]?.GST
                    )}
                  </Text>
                ) : null}
              </VStack>
            </HStack>

            {/* Footer */}
            <Divider my={3} />
            <HStack
              justify={{ base: "center", sm: "space-between" }}
              mt={3}
              spacing={{ base: 3, sm: 4 }}
              flexWrap="wrap"
              className="sm:flex-col"
            >
              {acc?.bom?.sale_id[0]?.payment_verify === true && (
                <Button
                  bgColor="white"
                  leftIcon={<TbTruckDelivery />}
                  _hover={{ bgColor: "green.500" }}
                  className="border border-green-500 hover:text-white"
                  onClick={() => handleDispatch(acc?.bom?.sale_id[0]?._id, acc?.bom?.sale_id[0]?.tracking_id, acc?.bom?.sale_id[0]?.tracking_web)}
                  width={{ base: "full", sm: "auto" }}
                >
                  Dispatch
                </Button>
              )}
              {(acc?.bom?.sale_id[0]?.customer_order_ss || acc?.bom?.sale_id[0]?.dispatcher_order_ss) && (
                <Button
                  bgColor="white"
                  leftIcon={<IoEyeSharp />}
                  _hover={{ bgColor: "yellow.500" }}
                  className="border border-yellow-500 hover:text-white"
                  width={{ base: "full", sm: "auto" }}
                >
                  <a
                    href={acc?.bom?.sale_id[0]?.customer_order_ss || acc?.bom?.sale_id[0]?.dispatcher_order_ss}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Delivery Proof
                  </a>
                </Button>
              )}

              {acc?.bom?.sale_id[0]?.tracking_id && acc?.bom?.sale_id[0]?.tracking_web && (
                  <Button
                   
                    leftIcon={<FaCloudUploadAlt />}
                    bgColor="white"
                    _hover={{ bgColor: "blue.500" }}
                    className="border border-blue-500 hover:text-white w-full sm:w-auto"
                    onClick={() =>
                      handleProof(acc?.bom?.sale_id[0]?._id, acc?.bom?.sale_id[0]?.customer_order_ss, acc?.bom?.sale_id[0]?.dispatcher_order_ss)
                    }
                  >
                    Attach Delivery Proof
                  </Button>
                )}
            </HStack>
          </Box>
        </Box>
      ))}

      {/*  dispatch */}

      <Modal
        isOpen={DispatchDisclosure.isOpen}
        onClose={DispatchDisclosure.onClose}
        isCentered
        size={{ base: "xs", md: "md", lg: "lg" }} // Optional: controls modal size per screen
      >
        <ModalOverlay />
        <ModalContent maxW="95vw">
          <ModalHeader>Dispatch</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto" maxH="70vh" px={{ base: 2, md: 4 }}>
            <DispatchData
              sale_id={saleId}
              trackId={trackId}
              trackLink={trackLink}
              onClose={DispatchDisclosure.onClose}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              _hover={{ bgColor: "red.500", color: "white" }}
              className="border border-red-500 w-full md:w-auto"
              mr={3}
              onClick={DispatchDisclosure.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>



      {/* delivery proof modal */}
      <Modal isOpen={isProofOpen} onClose={onProofClose} isCentered size={{ base: "xs", md: "md", lg: "lg" }}>
        <ModalOverlay />
        <ModalContent maxW="95vw">
          <ModalHeader>View Delivery</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto" maxH="70vh" px={{ base: 2, md: 4 }}>
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


      <Pagination page={pages} setPage={setPages} length={data.length} />
    </div>
  );
};

export default Dispatch;
