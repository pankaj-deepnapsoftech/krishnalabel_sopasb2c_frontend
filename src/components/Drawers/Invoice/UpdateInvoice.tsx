import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  useUpdateInvoiceMutation
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Loading from "../../../ui/Loading";
import moment from "moment";
import AddItems from "../../Dynamic Add Components/AddItems";

interface UpdateInvoiceProps {
  closeDrawerHandler: () => void;
  fetchInvoicesHandler: () => void;
  id: string | undefined;
}

const UpdateInvoice: React.FC<UpdateInvoiceProps> = ({
  closeDrawerHandler,
  fetchInvoicesHandler,
  id,
}) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [buyer, setBuyer] = useState<
    { value: string; label: string } | undefined
  >();
  const [supplier, setSupplier] = useState<
    { value: string; label: string } | undefined
  >();
  const [invoiceNo, setInvoiceNo] = useState<string | undefined>();
  const [documentDate, setDocumentDate] = useState<string | undefined>();
  const [salesOrderDate, setSalesOrderDate] = useState<string | undefined>();
  const [note, setNote] = useState<string | undefined>();
  const [subtotal, setSubtotal] = useState<number | undefined>(0);
  const [total, setTotal] = useState<number | undefined>();
  const [items, setItems] = useState<any[] | []>([]);
  const [allItems, setAllItems] = useState<any[] | []>([]);
  const [itemOptions, setItemOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [buyers, setBuyers] = useState<any[] | []>([]);
  const [buyerOptions, setBuyerOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [suppliers, setSuppliers] = useState<any[] | []>([]);
  const [supplierOptions, setSupplierOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [category, setCategory] = useState<
    { value: string; label: string } | undefined
  >();
  const categoryOptions = [
    { value: "sale", label: "Sales" },
    { value: "purchase", label: "Purchase" },
  ];
  const [store, setStore] = useState<
    { value: string; label: string } | undefined
  >();
  const [storeOptions, setStoreOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [tax, setTax] = useState<
    { value: number; label: string } | undefined
  >();
  const taxOptions = [
    { value: 0.18, label: "GST 18%" },
    { value: 0, label: "No Tax 0%" },
  ];
  const [inputs, setInputs] = useState<
    {
      item: { value: string; label: string };
      quantity: number;
      price: number;
    }[]
  >([{ item: { value: "", label: "" }, quantity: 0, price: 0 }]);

  const [updateInvoice] = useUpdateInvoiceMutation();

  const updateInvoiceHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      _id: id,
      buyer: buyer?.value,
      invoice_no: invoiceNo,
      document_date: documentDate,
      sales_order_date: salesOrderDate,
      note: note,
      tax: { tax_amount: tax?.value, tax_name: tax?.label },
      subtotal: subtotal,
      total: total,
      store: store?.value,
      items: inputs.map((item: any) => ({
        item: item.item.value,
        quantity: item.quantity,
        amount: item.price,
      })),
    };

    try {
      setIsUpdating(true);
      const response = await updateInvoice(data).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      closeDrawerHandler();
      fetchInvoicesHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchInvoiceDetailsHandler = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `invoice/${id}`,
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
      
      if (data.invoice.buyer) {
        setBuyer({
          value: data.invoice?.buyer?._id,
          label: data.invoice?.buyer?.name,
        });
      } else {
        setSupplier({
          value: data.invoice?.supplier?._id,
          label: data.invoice?.supplier?.name,
        });
      }
      setInvoiceNo(data.invoice.invoice_no);
      setDocumentDate(moment(data.invoice.document_date).format("YYYY-DD-MM"));
      setSalesOrderDate(
        moment(data.invoice.sales_order_date).format("YYYY-DD-MM")
      );
      setSubtotal(data.invoice.subtotal);
      setTotal(data.invoice.total);
      setNote(data.invoice?.note || "");
      setStore({
        value: data.invoice.store._id,
        label: data.invoice.store.name,
      });
      setTax({
        value: data.invoice.tax?.tax_amount,
        label: data.invoice.tax?.tax_name,
      });
      setCategory({
        value: data.invoice.category,
        label:
          data.invoice.category.substr(0, 1).toUpperCase() +
          data.invoice.category.substr(1),
      });
      setInputs(
        data.invoice.items.map((item: any) => ({
          item: { value: item.item._id, label: item.item.name },
          price: item.amount,
          quantity: item.quantity,
        }))
      );
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBuyersHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/buyers",
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

      const buyers = data.agents.map((buyer: any) => ({
        value: buyer._id,
        label: buyer.name,
      }));
      setBuyerOptions(buyers);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchSuppliersHandler = async () => {
    try {
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

      const suppliers = data.agents.map((supplier: any) => ({
        value: supplier._id,
        label: supplier.name,
      }));
      setSupplierOptions(suppliers);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchItemsHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/all",
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
      const products = results.products.map((product: any) => ({
        value: product._id,
        label: product.name,
      }));
      setItemOptions(products);
      setAllItems(results.products);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchStoresHandler = async () => {
    try {
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
      const stores = data.stores.map((store: any) => ({
        value: store._id,
        label: store.name,
      }));
      setStoreOptions(stores);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (tax && subtotal) {
      setTotal(subtotal + tax?.value * subtotal);
    }
  }, [tax, subtotal]);

  useEffect(() => {
    const price = inputs.reduce((acc: number, curr: any) => {
      return acc + (curr?.price * curr?.quantity || 0);
    }, 0);
    setSubtotal(price);
  }, [inputs]);

  useEffect(() => {
    fetchBuyersHandler();
    fetchItemsHandler();
    fetchStoresHandler();
    fetchSuppliersHandler();
  }, []);

  useEffect(() => {
    fetchInvoiceDetailsHandler(id || "");
  }, [id]);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[60vw] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Invoice
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-bold text-white py-5 text-center mb-6 border-y bg-teal-500">
            Update Invoice
          </h2>

          {isLoading && <Loading />}
          {!isLoading && (
            <form onSubmit={updateInvoiceHandler} 
            className="max-w-4xl mx-auto p-8 bg-white space-y-5">
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Category</FormLabel>
                <Select
                  isDisabled
                  value={category}
                  options={categoryOptions}
                  required={true}
                  onChange={(e: any) => setCategory(e)}
                />
              </FormControl>
              {category && category.value === "sale" && (
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Buyer</FormLabel>
                  <Select
                    isDisabled
                    value={buyer}
                    options={buyerOptions}
                    required={true}
                    onChange={(e: any) => setBuyer(e)}
                  />
                </FormControl>
              )}
              {category && category.value === "purchase" && (
                <FormControl className="mt-3 mb-5" isRequired>
                  <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Supplier</FormLabel>
                  <Select
                    isDisabled
                    value={supplier}
                    options={supplierOptions}
                    required={true}
                    onChange={(e: any) => setSupplier(e)}
                  />
                </FormControl>
              )}
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Invoice No.</FormLabel>
                <Input
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  type="text"
                  placeholder="Invoice No."
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Document Date</FormLabel>
                <Input
                  value={documentDate}
                  className="no-scrollbar"
                  onChange={(e) => setDocumentDate(e.target.value)}
                  type="date"
                  placeholder="Document Date"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Sales Order Date</FormLabel>
                <Input
                  value={salesOrderDate}
                  className="no-scrollbar"
                  onChange={(e) => setSalesOrderDate(e.target.value)}
                  type="date"
                  placeholder="Sales Order Date"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Store</FormLabel>
                <Select
                  value={store}
                  options={storeOptions}
                  required={true}
                  onChange={(e: any) => setStore(e)}
                />
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Note</FormLabel>
                <textarea
                  className="border w-full border-[#a9a9a9] rounded"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Items</FormLabel>
                <AddItems inputs={inputs} setInputs={setInputs} />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Subtotal</FormLabel>
                <Input
                  value={subtotal}
                  isDisabled={true}
                  className="no-scrollbar"
                  type="number"
                  placeholder="Subtotal"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Tax</FormLabel>
                <Select
                  required={true}
                  value={tax}
                  options={taxOptions}
                  onChange={(e: any) => setTax(e)}
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel className="text-blue-800 text-lg font-semibold" fontWeight="bold">Total</FormLabel>
                <Input value={total} isDisabled={true} />
              </FormControl>
              <Button
                isLoading={isUpdating}
                backgroundColor="#14b8a6"
                color="#ffffff"
                type="submit"
                _hover={{backgroundColor:"#0d9488"}}
                className="mt-5 w-full py-3 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                Submit
              </Button>
            </form>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default UpdateInvoice;