import { FaRegCheckCircle } from "react-icons/fa";
import { IoDocumentTextOutline, IoStorefrontOutline } from "react-icons/io5";
import { MdOutlineShoppingCart, MdOutlineSpeed, MdOutlineSell, MdOutlineAttachMoney, MdOutlinePayment, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RiBillLine, RiUserAddFill } from "react-icons/ri";
import { TbLockAccess, TbTruckDelivery, TbUsersGroup } from "react-icons/tb";
import { SlDirection } from "react-icons/sl";
import { FaHandsHelping } from "react-icons/fa";
import { SiScrapy } from "react-icons/si";
import { FaListCheck, FaPeopleGroup } from "react-icons/fa6";
import { BiPurchaseTagAlt, BiSolidDiscount, BiTask } from "react-icons/bi";
import { VscServerProcess } from "react-icons/vsc";
import { GiProgression } from "react-icons/gi";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Approvals from "../pages/Approvals";
import Stores from "../pages/Stores";
import Buyers from "../pages/Buyers";
import Sellers from "../pages/Sellers";
import BOM from "../pages/BOM";
import UserRole from "../pages/UserRoles";
import Employees from "../pages/Emloyees";
import ProformaInvoice from "../pages/ProformaInvoice";
import Invoice from "../pages/Invoice";
import Payment from "../pages/Payment";
import Process from "../pages/Process";
import IndirectProducts from "../pages/IndirectProducts";
import Scrap from "../pages/Scrap";
import WIPProducts from "../pages/WIPProducts";
import InventoryApprovals from "../pages/InventoryApprovals";
import Sales from "../pages/Sales";
import Customer from "../pages/Customer";
import Task from "../pages/Task";
import Production from "../pages/Productions";
import Dispatch from "../pages/Dispatch";



const routes = [
  {
    name: "Dashboard",
    icon: <MdOutlineSpeed />,
    path: "",
    element: <Dashboard />,
    isSublink: false
  },
  {
    name: "User Roles",
    icon: <TbLockAccess />,
    path: "role",
    element: <UserRole />,
    isSublink: false
  },
  {
    name: "Employees",
    icon: <FaPeopleGroup />,
    path: "employee",
    element: <Employees />,
    isSublink: false
  },
  {
    name: "Customer",
    icon: <RiUserAddFill />,
    path: "customer",
    element: <Customer />,
    isSublink: false
  },
  {
    name: "Sales",
    icon: <BiSolidDiscount />,
    path: "/sales",
    element: <Sales />,
    isSublink: false
  },
  {
    name: "Task",
    icon: <BiTask  />,
    path: "/task",
    element: <Task />,
    isSublink: false
  },
  
  /*
  {
    name: "Sales & Purchase",
    path: "sales-purchase",
    icon: <BiPurchaseTagAlt />,
    sublink: [
      {
        name: "Proforma Invoices",
        icon: <IoDocumentTextOutline />,
        path: "proforma-invoice",
        element: <ProformaInvoice />,
      },
      {
        name: "Invoices",
        icon: <RiBillLine />,
        path: "invoice",
        element: <Invoice />,
      },
      {
        name: "Payments",
        icon: <MdOutlinePayment />,
        path: "payment",
        element: <Payment />,
      },
    ],
    isSublink: true
  },
  */
  {
    name: "Inventory",
    icon: <MdOutlineShoppingCart />,
    path: "inventory",
    sublink: [
      {
        name: "Indirect",
        icon: <FaHandsHelping />,
        path: "indirect",
        element: <IndirectProducts />,
      },
      {
        name: "Direct",
        icon: <SlDirection />,
        path: "direct",
        element: <Products />,
      },
      {
        name: "Work In Progress",
        icon: <GiProgression />,
        path: "wip",
        element: <WIPProducts />,
      },
      {
        name: "Approvals",
        icon: <FaRegCheckCircle />,
        path: "approval",
        element: <InventoryApprovals />,
      }
    ],
    isSublink: true
  },
  {
    name: "Scrap Management",
    icon: <SiScrapy />,
    path: "scrap",
    element: <Scrap />,
    isSublink: false
  },
  {
    name: "Store",
    icon: <IoStorefrontOutline />,
    path: "store",
    element: <Stores />,
    isSublink: false
  },
  {
    name: "Approval",
    icon: <FaRegCheckCircle />,
    path: "approval",
    element: <Approvals />,
    isSublink: false
  },
  {
    name: "Merchant",
    path: "merchant",
    icon: <TbUsersGroup />,
    sublink: [
      {
        name: "Buyer",
        icon: <MdOutlineAttachMoney />,
        path: "buyer",
        element: <Buyers />,
      },
      {
        name: "Supplier",
        icon: <MdOutlineSell />,
        path: "supplier",
        element: <Sellers />,
      },
    ],
    isSublink: true
  },
  {
    name: "Production",
    path: "production",
    icon: <MdOutlineProductionQuantityLimits />,
    sublink: [
      {
        name: "Track Production",
        icon: <FaListCheck  />,
        path: "production-track",
        element: <Production />,
      },
      {
        name: "BOM",
        icon: <RiBillLine />,
        path: "bom",
        element: <BOM />,
      },
      {
        name: "Production Process",
        icon: <VscServerProcess />,
        path: "production-process",
        element: <Process />,
      },
     
    ],
    isSublink: true
  },
  {
    name: "Dispatch",
    icon: <TbTruckDelivery   />,
    path: "/dispatch",
    element: <Dispatch />,
    isSublink: false
  },

];

export default routes;
