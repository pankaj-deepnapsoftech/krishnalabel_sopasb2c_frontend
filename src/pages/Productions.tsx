//@ts-nocheck
import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import CreateSale from "./CreateSale";
import UpdateSale from "./UpdateSale";
import { MdOutlineRefresh } from "react-icons/md";
import Assign from "./Assign";
import Pagination from "./Pagination";
import Track from "./Track";

const   Productions = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale");
  const trackDisclosure = useDisclosure();
  const [purchases, setPurchases] = useState<[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedSale, setSelectedSale] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["access_token"]);
  const [cookiesuser] = useCookies();
  const role = cookiesuser?.role;
  const [pages, setPages] = useState(1);
  const [comment, setComment] = useState("");
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [filteredPurchases, setFilteredPurchases] = useState<any[]>([]);
  const [selectedBomIndex, setSelectedBomIndex] = useState("");
  const [limit, setLimit] = useState(10);

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const token = cookies.access_token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}purchase/getAll?page=${pages}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const calculateProcessStatus = (processes) => {
    const total = processes.length;
    const completed = processes.filter((process) => process.done).length;

    if (completed === 0 && total === 0) {
      return { status: "Pending", color: "red" };
    } else if (completed === total) {
      return { status: "Completed", color: "green" };
    } else if (completed > 0) {
      return { status: "Under Process", color: "yellow" };
    } else {
      return { status: "Pending", color: "orange" };
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [pages, limit]);

  useEffect(() => {
    let filteredData = purchases.filter((purchase) => {
      const matchesText =
        !filterText ||
        [
          purchase?.user_id?.[0]?.first_name,
          purchase?.product_id?.[0]?.name,
          purchase?.customer_id?.[0]?.full_name,
        ]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(filterText.toLowerCase())
          );

      const matchesDate =
        !filterDate ||
        new Date(purchase?.createdAt).toISOString().split("T")[0] ===
          filterDate;

      const matchesPayment =
        !paymentFilter || purchase?.paymet_status === paymentFilter;

      const matchesProduct =
        !productFilter || purchase?.product_status === productFilter;

      return matchesText && matchesDate && matchesPayment && matchesProduct;
    });
    setFilteredPurchases(filteredData);
  }, [filterText, filterDate, paymentFilter, productFilter, purchases]);

  const handleSampleTrackClick = (sale: string) => {
    setSelectedSale(sale);
    setSelectedBomIndex(0);
    trackDisclosure.onOpen();
  };
  const handleTrackClick = (sale: string) => {
    setSelectedSale(sale);
    setSelectedBomIndex(1);
    trackDisclosure.onOpen();
  };

  return (
    <div className="overflow-x-hidden">
      <Box>
        
      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
      Track Productions</div>

      {/* Employees Page */}
        <div className="w-full flex flex-col md:flex-row gap-4 pb-2">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search production..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            w="full"
            _focus={{
              borderColor: "#0d9488",
              boxShadow: "0 0 0 1px #14b8a6"
            }}
            transition="all 0.2s"
          />

          {/* Filters & Button */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Select
              placeholder="Payment Status"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              w={{ base: "full", md: "170px" }}
            >
              <option value="Pending">Pending</option>
              <option value="Paied">Paid</option>
            </Select>

            <Select
              placeholder="Product Status"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              w={{ base: "full", md: "170px" }}
            >
              <option value="Dispatch">Dispatch</option>
              <option value="Delivered">Delivered</option>
            </Select>

            <Button
              onClick={fetchPurchases}
              leftIcon={<MdOutlineRefresh />}
              fontSize="14px"
              px="12px"
              py="6px"
              w={{ base: "full", md: "auto" }}
              color="#319795"
              borderColor="#319795"
              variant="outline"
            >
              Refresh
            </Button>
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
        ) : (
          <Box
            maxW="100%"
            overflowX="auto"
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.200"
          >
            {filteredPurchases?.map((purchase: any) => {
              // Calculate statuses for all BOMs
              const allBOMStatuses = purchase?.boms?.map((bom: any) => {
                const { status, color } = calculateProcessStatus(
                  bom?.production_processes[0]?.processes || []
                );
                return { status, color };
              });

              // Determine the overall status for the purchase based on the BOM statuses
              const overallStatus = allBOMStatuses.some(
                (bom) => bom.status === "Pending"
              )
                ? "Pending"
                : allBOMStatuses.every((bom) => bom.status === "Completed")
                ? "Completed"
                : "Under Process";

              const overallColor =
                overallStatus === "Completed"
                  ? "green"
                  : overallStatus === "Pending"
                  ? "orange"
                  : "yellow";

              return (
                <Box
                  key={purchase?._id}
                  borderWidth="1px"
                  borderRadius="lg"
                  boxShadow="lg"
                  bg="white"
                  p={4}
                  w="100%"
                  position="relative"
                  className="mb-2"
                >
                  {/* Left colored bar */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    h="100%"
                    w={2}
                    bg={
                      overallColor === "orange"
                        ? "orange"
                        : overallColor === "green"
                        ? "green"
                        : "yellow"
                    }
                    borderRadius="md"
                  />

                  {/* Header */}
                  <HStack justify="space-between" mb={3}>
                    <VStack align="start">
                      <Text fontWeight="bold" fontSize="lg">
                        Product: {purchase?.product_id[0]?.name || "N/A"}
                      </Text>
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        className="underline"
                      >
                        Date:{" "}
                        {new Date(purchase?.createdAt).toLocaleDateString()}
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={1}>
                      <Badge
                        colorScheme={purchase?.Status === "Pending" ? "orange" : "green"}
                        fontSize="sm"
                      >
                        Sale Approval: {purchase?.Status}
                      </Badge>

                      {purchase?.Status === "Approved" && purchase?.customer_approve && (
                        <Badge
                          colorScheme={
                            purchase?.customer_approve === "Approve"
                              ? "green"
                              : purchase?.customer_approve === "Pending"
                                ? "orange"
                                : "red"
                          }
                          fontSize="sm"
                        >
                          Design Approval: {purchase?.customer_approve}
                        </Badge>
                      )}

                      {purchase?.token_status && (
                        <Badge colorScheme="green" fontSize="sm">
                          Token Amount : Paid
                        </Badge>
                      )}

                      {purchase?.paymet_status && (
                        <Badge
                          colorScheme={
                            purchase?.paymet_status === "Pending" ? "orange" : "green"
                          }
                          fontSize="sm"
                        >
                          Payment Status:{" "}
                          {purchase?.paymet_status === "Paid"
                            ? "Paid"
                            : purchase?.paymet_status}
                        </Badge>
                      )}

                      {purchase?.product_status && (
                        <Badge
                          colorScheme={
                            purchase?.product_status === "Dispatch" ? "orange" : "green"
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
                  <HStack justify="space-between" spacing={3} mt={3}>
                    <VStack align="start">
                      
                      {(role == "Accountant" || role == "Sales" || role == "admin") ? (
                        <Text fontSize="sm">
                          <strong>Price:</strong> {purchase?.price}
                        </Text>
                      ) : null}

                      <Text fontSize="sm">
                        <strong>Quantity:</strong> {purchase?.product_qty}
                      </Text>
                    </VStack>
                    <VStack align="end">
                      <Text fontSize="sm">
                        <strong>Customer:</strong>{" "}
                        {purchase?.customer_id[0]?.full_name || "N/A"}
                      </Text>
                      <Text fontSize="sm">
                        <strong>Sale By:</strong>{" "}
                        {purchase?.user_id[0]?.first_name || "N/A"}
                      </Text>
                    </VStack>
                  </HStack>

                  {/* Footer */}
                  <Divider my={3} />
                  <HStack justify="space-between" mt={3}>
                    <Text
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() => handleSampleTrackClick(purchase)}
                    >
                      Sample Track
                    </Text>
                    <Text
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() => handleTrackClick(purchase)}
                    >
                      Production Track
                    </Text>

                    <HStack spacing={2}>
                      {overallStatus === "Completed" && (
                        <HStack spacing={2}>
                          <Box
                            boxSize={3}
                            bg="green.500"
                            borderRadius="full"
                            animation="pulse 1.5s infinite"
                          />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="green.500"
                          >
                            Process {overallStatus}
                          </Text>
                        </HStack>
                      )}
                      {overallStatus === "Under Process" && (
                        <HStack spacing={2}>
                          <Spinner
                            size="sm"
                            color="yellow.500"
                            thickness="2px"
                            speed="0.7s"
                          />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="yellow.500"
                          >
                            Process {overallStatus}
                          </Text>
                        </HStack>
                      )}
                      {overallStatus === "Pending" && (
                        <HStack spacing={2}>
                          <Box
                            boxSize={3}
                            bg="orange.500"
                            borderRadius="full"
                            animation="pulse 1.5s infinite"
                          />
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="orange.500"
                          >
                            Process {overallStatus}
                          </Text>
                        </HStack>
                      )}
                    </HStack>
                  </HStack>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* track Modal */}
      <Modal isOpen={trackDisclosure.isOpen} onClose={trackDisclosure.onClose} size={{ base: "md", md: "lg" }}>
        <ModalOverlay />
        <ModalContent
          mx={{ base: 2, sm: 4 }} // adds horizontal margin on small screens
          borderRadius="md"
        >
          <ModalHeader>Track</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={{ base: 4, md: 6 }} py={4}>
            <Track sale={selectedSale} selectedBomIndex={selectedBomIndex} />
          </ModalBody>
        </ModalContent>
      </Modal>


      <Pagination page={pages} setPage={setPages} length={purchases.length} />
    </div>
  );
};

export default Productions;
