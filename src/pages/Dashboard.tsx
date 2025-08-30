//@ts-nocheck
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Card from "../components/Dashboard/Card";
import Loading from "../ui/Loading";
import { IoIosDocument, IoMdCart } from "react-icons/io";
import { FaRupeeSign, FaStoreAlt, FaUser } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

import {
  IoPeople,
  IoPeopleCircle,
  IoPersonCircleOutline,
} from "react-icons/io5";
import {
  Box,
  Button,
  CardBody,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Tag,
  Text,
  useDisclosure,
  VStack,
  Tooltip,
  Divider,
  Stack,
} from "@chakra-ui/react";
import Card2 from "../components/Dashboard/Card2";
import SalesGraph from "../components/graphs/SalesGraph";
import { NavLink, useNavigate } from "react-router-dom";
import { MdWavingHand } from "react-icons/md";
import axios from "axios";
import DispatchOverview from "../components/Dashboard/DispatchOverview";
import TaskOverview from "../components/Dashboard/TaskOverview";

const Dashboard: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [cookies] = useCookies();
  const { firstname } = useSelector((state: any) => state.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [approvalsPending, setApprovalsPending] = useState<
    | {
        unapproved_product_count: number;
        unapproved_store_count: number;
        unapproved_merchant_count: number;
        unapproved_bom_count: number;
      }
    | undefined
  >();
  const [scrap, setScrap] = useState<
    | {
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [inventory, setInventory] = useState<
    | {
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [directInventory, setDirectInventory] = useState<
    | {
        total_low_stock: number;
        total_excess_stock: number;
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [indirectInventory, setIndirectInventory] = useState<
    | {
        total_low_stock: number;
        total_excess_stock: number;
        total_product_count: number;
        total_stock_price: number;
      }
    | undefined
  >();
  const [stores, setStores] = useState<
    | {
        total_store_count: number;
      }
    | undefined
  >();
  const [boms, setBoms] = useState<
    | {
        total_bom_count: number;
      }
    | undefined
  >();
  const [merchants, setMerchants] = useState<
    | {
        total_supplier_count: number;
        total_buyer_count: number;
      }
    | undefined
  >();
  const [employees, setEmployees] = useState<
    | {
        _id: string;
        total_employee_count: number;
      }[]
    | undefined
  >();
  const [processes, setProcesses] = useState<
    | {
        ["raw material approval pending"]?: number;
        ["raw materials approved"]?: number;
        completed?: number;
        "work in progress"?: number;
      }
    | undefined
  >();
  const [totalProformaInvoices, setTotalProformaInvoices] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);
  const role = cookies?.role;
  const navigate = useNavigate();

  const fetchSummaryHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify({
            from,
            to,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setDirectInventory(
        data.products?.[0]?._id === "direct"
          ? data.products?.[0]
          : data.products?.[1]
      );
      setIndirectInventory(
        data.products?.[0]?._id === "indirect"
          ? data.products?.[0]
          : data.products?.[1]
      );
      setScrap(data.scrap[0]);
      setInventory(data.wip_inventory[0]);
      setStores(data.stores);
      setMerchants(data.merchants);
      setBoms(data.boms);
      setApprovalsPending(data.approvals_pending);
      setEmployees(data.employees);
      setProcesses(data.processes);
      setTotalProformaInvoices(data.proforma_invoices);
      setTotalInvoices(data.invoices);
      setTotalPayments(data.payments);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilterHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (from && to) {
      fetchSummaryHandler();
    }
  };

  const resetFilterHandler = (e: React.FormEvent) => {
    e.preventDefault();

    setFrom("");
    setTo("");

    fetchSummaryHandler();
  };

  const fetchCustomers = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}customer/all`,
      {
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      }
    );

    setTotalCustomers(response.data.total);
  };

  const fetchSales = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}purchase/all`,
      {
        headers: {
          Authorization: `Bearer ${cookies?.access_token}`,
        },
      }
    );

    setTotalSales(response.data.total);
  };

  useEffect(() => {
    if (firstname) {
      fetchSummaryHandler();
      fetchCustomers();
      fetchSales();
    }
  }, [firstname, role]);

  const totalEmployees = employees?.reduce(
    (total, item) => total + item.total_employee_count,
    0
  );

  /*
  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
      You are not allowed to access this route.
      </div>
    );
 }
    */

  if (!role) {
    navigate("/login");
  }

  /*
  const allowedRoles = ["product", "production", "design", "designer"];

  const shouldRenderTaskOverview = allowedRoles.some(
    (userRole) => role.toLowerCase() === userRole
  );

  */
  if (role === "emp") {
    navigate("/access");
  }

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap">
        <div className="text-3xl font-bold text-[#22075e] flex items-center justify-center gap-2">
          <MdWavingHand className="text-orange-500 waving-hand" />
          <i>Hi {firstname || ""},</i>
        </div>
        <div className="mt-6">
          {/* {role && role === "admin" ? ( */}
          <form
            onSubmit={applyFilterHandler}
            className="flex items-end justify-between gap-2 flex-wrap lg:flex-nowrap"
          >
            <FormControl>
              <FormLabel>From</FormLabel>
              <Input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                backgroundColor="white"
                type="date"
              />
            </FormControl>
            <FormControl>
              <FormLabel>To</FormLabel>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                backgroundColor="white"
                type="date"
              />
            </FormControl>
            <Button
              type="submit"
              fontSize={{ base: "14px", md: "14px" }}
              paddingX={{ base: "10px", md: "12px" }}
              paddingY={{ base: "0", md: "3px" }}
              width={{ base: "-webkit-fill-available", md: 150 }}
              color="white"
              backgroundColor="#e67e22"
              _hover={{ backgroundColor: "#e67e22" }}
            >
              Apply
            </Button>
            <Button
              type="submit"
              fontSize={{ base: "14px", md: "14px" }}
              paddingX={{ base: "10px", md: "12px" }}
              paddingY={{ base: "0", md: "3px" }}
              width={{ base: "-webkit-fill-available", md: 150 }}
              onClick={resetFilterHandler}
              color="white"
              backgroundColor="#319795"
            >
              Reset
            </Button>
          </form>
          {/* ) : null} */}
        </div>
      </div>

      {isLoading && <Loading />}
      {!isLoading && (
        <div className="mt-6">
          <Grid
            templateColumns={{ base: "1fr", md: "3fr 1fr" }}
            gap={6}
            className="w-full"
          >
            <GridItem>
              <Grid
                templateColumns={{
                  base: "1fr", // 1 item per row on small screens
                  sm: "1fr", // 1 item per row on small screens
                  md: "repeat(3, 1fr)", // 3 items per row on medium and larger screens
                }}
                gap={2}
                className="w-full"
              >
                {/* Card 1: Total Employees */}
                <GridItem>
                  <NavLink to="/employee">
                    <Box
                      p={4}
                      borderRadius="md"
                      boxShadow="md"
                      className="bg-white flex items-center justify-between gap-4 cursor-pointer hover:scale-105 transition-all ease-in"
                    >
                      <div className="text-start md:text-left">
                        <Text fontSize="lg">Employee</Text>
                        <Text fontWeight="bold" fontSize="lg">
                          {role && role === "admin" ? totalEmployees : 0}
                        </Text>
                      </div>
                      <img
                        src="/images/graph.svg"
                        alt="Total Employees"
                        className="w-16 h-16 md:w-20 md:h-20"
                      />
                    </Box>
                  </NavLink>
                </GridItem>

                {/* Card 2: Total Customers */}
                <GridItem>
                  <NavLink to="/customer">
                    <Box
                      p={4}
                      borderRadius="md"
                      boxShadow="md"
                      className="bg-white flex items-center justify-between gap-4 cursor-pointer hover:scale-105 transition-all ease-in"
                    >
                      <div className="text-start md:text-left">
                        <Text fontSize="lg">Customer</Text>
                        <Text fontWeight="bold" fontSize="lg">
                          {role &&
                          ["admin", "sale", "sales_manager"].includes(
                            role.toLowerCase()
                          )
                            ? totalCustomers
                            : 0}
                        </Text>
                      </div>
                      <img
                        src="/images/graph2.svg"
                        alt="Total Customers"
                        className="w-16 h-16 md:w-20 md:h-20"
                      />
                    </Box>
                  </NavLink>
                </GridItem>

                {/* Card 3: Total Sales */}
                <GridItem>
                  <NavLink to="sales">
                    <Box
                      p={4}
                      borderRadius="md"
                      boxShadow="md"
                      className="bg-white flex items-center justify-between gap-4 cursor-pointer hover:scale-105 transition-all ease-in"
                    >
                      <div className="text-start md:text-left">
                        <Text fontSize="lg">Sales</Text>
                        <Text fontWeight="bold" fontSize="lg">
                          {role &&
                          ["admin", "sale", "account"].includes(
                            role.toLowerCase()
                          )
                            ? totalSales
                            : 0}
                        </Text>
                      </div>
                      <img
                        src="/images/graph.svg"
                        alt="Total Sales"
                        className="w-16 h-16 md:w-20 md:h-20"
                      />
                    </Box>
                  </NavLink>
                </GridItem>
              </Grid>

              <NavLink to="/sales" className="mt-5">
                {role && ["admin", "account"].includes(role.toLowerCase()) ? (
                  <SalesGraph />
                ) : null}
              </NavLink>

              <div className="mt-5 p-3 bg-white shadow-md">
                <HStack className="flex items-center justify-between mb-2 w-full">
                  <Text className="text-lg font-bold">Production Insights</Text>
                </HStack>
                <Divider />
                <NavLink to="/production/production-track">
                  <DispatchOverview />
                </NavLink>
              </div>

              {role != "admin" ? (
                <div className="mt-5 p-3 bg-white shadow-md">
                  <HStack className="flex items-center justify-between mb-2 w-full">
                    <Text className="text-lg font-bold">Task Insights</Text>
                  </HStack>
                  <Divider />
                  <NavLink to="/task">
                    <TaskOverview />
                  </NavLink>
                </div>
              ) : null}

              <div className="mt-5 p-3 bg-white shadow-md">
                {boms && (
                  <Card
                    primaryColor="#37A775"
                    secondaryColor="#21A86C"
                    textColor="white"
                    title="BOMs"
                    content={
                      role &&
                      (role === "admin" ||
                        role.toLowerCase()?.includes("product"))
                        ? boms?.total_bom_count
                        : 0
                    }
                    link="/production/bom"
                    icon={<IoIosDocument color="#ffffff" size={28} />}
                  />
                )}
                <Card
                  primaryColor="#F03E3E"
                  secondaryColor="#E56F27"
                  textColor="white"
                  title="Inventory Approval Pending"
                  content={
                    role &&
                    (role === "admin" ||
                      role === "Inventory " ||
                      role.toLowerCase()?.includes("product"))
                      ? processes?.["raw material approval pending"] || 0
                      : 0
                  }
                  link="/inventory/approval"
                  icon={<FaStoreAlt color="#ffffff" size={28} />}
                />
                <Card
                  primaryColor="#3392F8"
                  secondaryColor="#E56F27"
                  textColor="white"
                  title="Inventory Approved"
                  content={
                    role &&
                    (role === "admin" ||
                      role === "Inventory " ||
                      role.toLowerCase()?.includes("product"))
                      ? processes?.["raw materials approved"] || 0
                      : 0
                  }
                  link="/inventory/approval"
                  icon={<FaStoreAlt color="#ffffff" size={28} />}
                />
                <Card
                  primaryColor="#E48C27"
                  secondaryColor="#E56F27"
                  textColor="white"
                  title="Work In Progress"
                  content={
                    role &&
                    (role === "admin" ||
                      role.toLowerCase()?.includes("product"))
                      ? processes?.["work in progress"] || 0
                      : 0
                  }
                  link="/inventory/wip"
                  icon={<FaStoreAlt color="#ffffff" size={28} />}
                />
                <Card
                  primaryColor="#409503"
                  secondaryColor="#E56F27"
                  textColor="white"
                  title="Completed"
                  content={
                    role &&
                    (role === "admin" ||
                      role.toLowerCase()?.includes("product"))
                      ? processes?.completed || 0
                      : 0
                  }
                  link="production/production-process"
                  icon={<FaStoreAlt color="#ffffff" size={28} />}
                />
              </div>
            </GridItem>

            <GridItem>
              {role && role === "admin" ? (
                <Box
                  p={4}
                  borderRadius="md"
                  boxShadow="md"
                  className=" shadow-md flex items-center justify-center"
                >
                  <Button onClick={onOpen}>View Pending Approvals</Button>
                </Box>
              ) : null}

              <div className="mt-5 p-3 bg-white shadow-md">
                <Text className="text-lg mb-3 font-bold">
                  Inventory Insights
                </Text>
                <Divider />
                {directInventory && (
                  <div className="">
                    <Card
                      primaryColor="#16a085"
                      secondaryColor="#32A1E7"
                      textColor="white"
                      title="Direct Inventory"
                      content={
                        role &&
                        (role === "admin" ||
                          role === "Inventory " ||
                          role.toLowerCase()?.includes("product"))
                          ? directInventory?.total_product_count
                          : 0
                      }
                      link="inventory/direct"
                      icon={<IoMdCart color="#ffffff" size={28} />}
                    />
                    <Card
                      primaryColor="#e67e22"
                      secondaryColor="#32A1E7"
                      textColor="white"
                      title="Stock Value"
                      content={
                        role &&
                        (role === "admin" ||
                          role === "Inventory " ||
                          role.toLowerCase()?.includes("product"))
                          ? `₹ ${directInventory?.total_stock_price}/-`
                          : 0
                      }
                      icon={<FaRupeeSign color="#ffffff" size={24} />}
                    />
                    <Card
                      primaryColor="#2980b9"
                      secondaryColor="#32A1E7"
                      textColor="white"
                      title="Excess Stock"
                      content={
                        role &&
                        (role === "admin" ||
                          role === "Inventory " ||
                          role.toLowerCase()?.includes("product"))
                          ? directInventory?.total_excess_stock
                          : 0
                      }
                      icon={<AiFillProduct color="#ffffff" size={28} />}
                    />
                    <Card
                      primaryColor="#9b59b6"
                      secondaryColor="#32A1E7"
                      textColor="white"
                      title="Low Stock"
                      content={
                        role &&
                        (role === "admin" ||
                          role === "Inventory " ||
                          role.toLowerCase()?.includes("product"))
                          ? directInventory?.total_low_stock
                          : 0
                      }
                      icon={<AiFillProduct color="#ffffff" size={28} />}
                    />
                  </div>
                )}
                {indirectInventory && (
                  <div className="border-b">
                    <Card
                      primaryColor="#e67e22"
                      secondaryColor="#32A1E7"
                      textColor="white"
                      title="Indirect Inventory"
                      content={
                        role &&
                        (role === "admin" ||
                          role === "Inventory " ||
                          role.toLowerCase()?.includes("product"))
                          ? indirectInventory?.total_product_count
                          : 0
                      }
                      link="/inventory/indirect"
                      icon={<IoMdCart color="#ffffff" size={28} />}
                    />
                    <Card
                      primaryColor="#9b59b6"
                      secondaryColor="#32A1E7"
                      textColor="white"
                      title="Stock Value"
                      content={
                        role &&
                        (role === "admin" ||
                          role === "Inventory " ||
                          role.toLowerCase()?.includes("product"))
                          ? `₹ {indirectInventory?.total_stock_price}/-`
                          : 0
                      }
                      icon={<FaRupeeSign color="#ffffff" size={24} />}
                    />
                    <Card
                      primaryColor="#16a085"
                      secondaryColor="#32A1E7"
                      textColor="white"
                      title="Excess Stock"
                      content={
                        role &&
                        (role === "admin" ||
                          role === "Inventory " ||
                          role.toLowerCase()?.includes("product"))
                          ? indirectInventory?.total_excess_stock
                          : 0
                      }
                      icon={<AiFillProduct color="#ffffff" size={28} />}
                    />
                    <Card
                      primaryColor="#2980b9"
                      secondaryColor="#32A1E7"
                      textColor="white"
                      title="Low Stock"
                      content={
                        role &&
                        (role === "admin" ||
                          role === "Inventory " ||
                          role.toLowerCase()?.includes("product"))
                          ? indirectInventory?.total_low_stock
                          : 0
                      }
                      icon={<AiFillProduct color="#ffffff" size={28} />}
                    />
                  </div>
                )}
                <div className="border-b">
                  <Card
                    primaryColor="#9b59b6"
                    secondaryColor="#32A1E7"
                    textColor="white"
                    title="Scrap Materials"
                    content={
                      role &&
                      (role === "admin" ||
                        role === "Inventory " ||
                        role.toLowerCase()?.includes("product"))
                        ? scrap?.total_product_count?.toString() || ""
                        : 0
                    }
                    link="/scrap"
                    icon={<IoMdCart color="#ffffff" size={28} />}
                  />
                  <Card
                    primaryColor="#2980b9"
                    secondaryColor="#32A1E7"
                    textColor="white"
                    title="Scrap Value"
                    content={
                      role &&
                      (role === "admin" ||
                        role === "Inventory " ||
                        role.toLowerCase()?.includes("product"))
                        ? `${scrap?.total_stock_price}/-`
                        : 0
                    }
                    icon={<FaRupeeSign color="#ffffff" size={24} />}
                    link="product"
                  />
                  <Card
                    primaryColor="#e67e22"
                    secondaryColor="#32A1E7"
                    textColor="white"
                    title="WIP Inventory"
                    content={
                      role &&
                      (role === "admin" ||
                        role === "Inventory " ||
                        role.toLowerCase()?.includes("product"))
                        ? inventory?.total_product_count?.toString() || ""
                        : 0
                    }
                    link="product"
                    icon={<IoMdCart color="#ffffff" size={28} />}
                  />
                  <Card
                    primaryColor="#4CAAE4"
                    secondaryColor="#32A1E7"
                    textColor="white"
                    title="WIP Inventory Value"
                    content={
                      role &&
                      (role === "admin" ||
                        role === "Inventory " ||
                        role.toLowerCase()?.includes("product"))
                        ? `₹ ${inventory?.total_stock_price}/-`
                        : 0
                    }
                    icon={<FaRupeeSign color="#ffffff" size={24} />}
                    link="product"
                  />
                </div>
              </div>
            </GridItem>
          </Grid>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pending Approvals</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              {/* Inventory Card */}
              <Card
                primaryColor="#16a085"
                secondaryColor="#1E387B"
                textColor="white"
                title="Inventory"
                content={approvalsPending?.unapproved_product_count}
                icon={<IoMdCart color="#ffffff" size={28} />}
              />
              {/* Stores Card */}
              <Card
                primaryColor="#e67e22"
                secondaryColor="#1E387B"
                textColor="white"
                title="Stores"
                content={approvalsPending?.unapproved_store_count}
                icon={<FaStoreAlt color="#ffffff" size={28} />}
              />
              {/* Merchants Card */}
              <Card
                primaryColor="#2980b9"
                secondaryColor="#1E387B"
                textColor="white"
                title="Merchants"
                content={approvalsPending?.unapproved_merchant_count}
                icon={<FaUser color="#ffffff" size={28} />}
              />
              {/* BOMs Card */}
              <Card
                primaryColor="#9b59b6"
                secondaryColor="#1E387B"
                textColor="white"
                title="BOMs"
                content={approvalsPending?.unapproved_bom_count}
                icon={<IoIosDocument color="#ffffff" size={28} />}
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;
