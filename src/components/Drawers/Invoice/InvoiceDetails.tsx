import { toast } from "react-toastify";
import Drawer from "../../../ui/Drawer";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import Loading from "../../../ui/Loading";
import { BiX } from "react-icons/bi";
import moment from "moment";

interface InvoiceDetailsProps {
  closeDrawerHandler: () => void;
  id: string | undefined;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  closeDrawerHandler,
  id,
}) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buyer, setBuyer] = useState<string | undefined>();
  const [supplier, setSupplier] = useState<string | undefined>();
  const [invoiceNo, setInvoiceNo] = useState<string | undefined>();
  const [documentDate, setDocumentDate] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [salesOrderDate, setSalesOrderDate] = useState<string | undefined>();
  const [note, setNote] = useState<string | undefined>();
  const [subtotal, setSubtotal] = useState<number | undefined>(0);
  const [total, setTotal] = useState<number | undefined>();
  const [balance, setBalance] = useState<number | undefined>();
  const [items, setItems] = useState<any[] | []>([]);
  const [store, setStore] = useState<string | undefined>();
  const [tax, setTax] = useState<any | undefined>();
  const [creator, setCreator] = useState<any | undefined>();
  const taxOptions = [
    { value: 0.18, label: "GST 18%" },
    { value: 0, label: "No Tax 0%" },
  ];

  const fetchInvoiceDetails = async (id: string) => {
    try {
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
      setInvoiceNo(data.invoice.invoice_no);
      setDocumentDate(data.invoice.document_date);
      setSalesOrderDate(data.invoice.sales_order_date);
      setNote(data.invoice?.note || "Not Available");
      setSubtotal(data.invoice.subtotal);
      setTotal(data.invoice.total);
      setBalance(data.invoice.balance);
      setTax(data.invoice.tax);
      setItems(data.invoice.items);
      setStore(data.invoice.store.name);
      setCategory(data.invoice.category);
      setBuyer(data.invoice?.buyer?.name);
      setSupplier(data.invoice?.supplier?.name);
      setCreator(data.invoice.creator);
    } catch (error: any) {
      toast.error(error.messsage || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchInvoiceDetails(id || "");
  }, [id]);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
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
            Invoice Details
          </h2>

          {isLoading && <Loading />}
          {!isLoading && (
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Created By
                    </p>
                    <p className="text-gray-500">
                      {creator?.first_name + " " + creator?.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Category
                    </p>
                    <p className="text-gray-500">{category?.toUpperCase()}</p>
                  </div>
                </div>

                {buyer && (
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Buyer</p>
                    <p className="text-gray-500">{buyer}</p>
                  </div>
                )}

                {supplier && (
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Supplier
                    </p>
                    <p className="text-gray-500">{supplier}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Invoice No.
                    </p>
                    <p className="text-gray-500">{invoiceNo}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Document Date
                    </p>
                    <p className="text-gray-500">
                      {moment(documentDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Sales Order Date
                    </p>
                    <p className="text-gray-500">
                      {moment(salesOrderDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Store</p>
                    <p className="text-gray-500">{store}</p>
                  </div>
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-700">Items</p>
                  <ul className="border rounded-lg">
                    {items?.map((item: any) => (
                      <li className="flex gap-3 border-b py-3">
                        <span className="flex-1 p-2">{item.item.name}</span>
                        <span className="flex-1 p-2">{item.quantity}</span>
                        <span className="flex-1 p-2">₹ {item.amount}/-</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 mb-5">
                  <p className="text-lg font-semibold text-gray-700">Note</p>
                  <p className="text-gray-500">{note}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Subtotal
                    </p>
                    <p className="text-gray-500">₹ {subtotal}/-</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Tax</p>
                    <p className="text-gray-500">{tax?.tax_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Total</p>
                    <p className="text-gray-500">₹ {total}/-</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Balance
                    </p>
                    <p className="text-gray-500">₹ {balance}/-</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default InvoiceDetails;