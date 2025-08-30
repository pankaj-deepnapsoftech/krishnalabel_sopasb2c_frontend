import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Select from "react-select";
import { MdOutlineRefresh } from "react-icons/md";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import SampleCSV from '../assets/csv/product-sample.csv';
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useDeleteProductMutation,
  useLazyFetchProductsQuery,
  useProductBulKUploadMutation,
} from "../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import ProductTable from "../components/Table/ProductTable";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddProductDrawer,
  closeProductDetailsDrawer,
  closeUpdateProductDrawer,
  openAddProductDrawer,
  openProductDetailsDrawer,
  openUpdateProductDrawer,
} from "../redux/reducers/drawersSlice";
import AddProduct from "../components/Drawers/Product/AddProduct";
import UpdateProduct from "../components/Drawers/Product/UpdateProduct";
import ProductDetails from "../components/Drawers/Product/ProductDetails";
import { MainColor } from "../constants/constants";

const Products: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("inventory");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [productId, setProductId] = useState<string | undefined>(); // Product Id to be updated or deleted
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [PageSize, setPageSize] = useState<number>(10);
  // Bulk upload menu
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);

  // Filters
  const [productServiceFilter, setProductServiceFilter] = useState<string>("");
  const [storeOptions, setStoreOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [storeFilter, setStoreFilter] = useState<
    { value: string; label: string } | undefined
  >();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);

  const [bulkUpload] = useProductBulKUploadMutation();

  const {
    isAddProductDrawerOpened,
    isUpdateProductDrawerOpened,
    isProductDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const [deleteProduct] = useDeleteProductMutation();

  const openAddProductDrawerHandler = () => {
    dispatch(openAddProductDrawer());
  };

  const closeProductDrawerHandler = () => {
    dispatch(closeAddProductDrawer());
  };

  const openUpdateProductDrawerHandler = (id: string) => {
    setProductId(id);
    dispatch(openUpdateProductDrawer());
  };

  const closeUpdateProductDrawerHandler = () => {
    dispatch(closeUpdateProductDrawer());
  };

  const openProductDetailsDrawerHandler = (id: string) => {
    setProductId(id);
    dispatch(openProductDetailsDrawer());
  };

  const closeProductDetailsDrawerHandler = () => {
    dispatch(closeProductDetailsDrawer());
  };

  const deleteProductHandler = async (id: string) => {
    try {
      const response: any = await deleteProduct({ _id: id }).unwrap();
      toast.success(response.message);
      fetchProductsHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  const fetchProductsHandler = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/all?category=direct",
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
      setData(results.products);
      setFilteredData(results.products);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchAllStores = async () => {
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
      let modifiedStores = [{ value: "", label: "All" }];
      modifiedStores.push(
        ...data.stores.map((store: any) => ({
          value: store._id,
          label: store.name,
        }))
      );
      setStoreOptions(modifiedStores);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const bulkUploadHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const file = fileRef?.current?.files?.[0];
    if (!file) {
      toast.error("CSV file not selected");
      return;
    }

    try {
      setBulkUploading(true);
      const formData = new FormData();
      formData.append("excel", file);

      const response = await bulkUpload(formData).unwrap();
      toast.success(response.message);
      fetchProductsHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setBulkUploading(false);
    }
  };

  useEffect(() => {
    fetchProductsHandler();
    fetchAllStores();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    // // @ts-ignore
    const results = data.filter(
      (prod: any) =>
        (prod.product_or_service?.toLowerCase().includes(productServiceFilter) &&
        (storeFilter &&
        (storeFilter?.value === "" ||
          prod?.store?._id === storeFilter?.value))) &&
        (prod.name?.toLowerCase()?.includes(searchTxt) ||
          prod.product_id?.toLowerCase()?.includes(searchTxt) ||
          prod.category?.toLowerCase()?.includes(searchTxt) ||
          prod.price
            ?.toString()
            ?.toLowerCase()
            ?.toString()
            .includes(searchTxt) ||
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
              ?.includes(searchTxt?.replaceAll("/", "") || "")))
    );
    setFilteredData(searchTxt ? results : data);
  }, [searchKey, productServiceFilter, storeFilter]);

  if(!isAllowed){
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }


  const handleExport = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
  
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}product/exportdirectcsv`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
  
      if (!response.ok) {
        // Throw a custom error to be caught in catch block
        throw new Error(`Failed to export: ${response.statusText}`);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Optionally release the memory
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong during export.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletebulkProductHandler = async (ids: string[]) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}product/bulkdelete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.access_token}`,
        },
        body: JSON.stringify({ ids }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete products");
      }
  
      const result = await response.json();
      toast.success(result.message);
      fetchProductsHandler()
      // Optional: refetch or update table state here
    } catch (error:any) {
      toast.error(error || "Something went wrong");
      console.error("Bulk delete failed", error);
    }
  };

  return (
    <div className="p-4 max-w-full mx-auto">
      {/* Drawers */}
      {isAddProductDrawerOpened && (
        <AddProduct
          closeDrawerHandler={closeProductDrawerHandler}
          fetchProductsHandler={fetchProductsHandler}
        />
      )}
      {isUpdateProductDrawerOpened && (
        <UpdateProduct
          closeDrawerHandler={closeUpdateProductDrawerHandler}
          productId={productId}
          fetchProductsHandler={fetchProductsHandler}
        />
      )}
      {isProductDetailsDrawerOpened && (
        <ProductDetails
          closeDrawerHandler={closeProductDetailsDrawerHandler}
          productId={productId}
        />
      )}

      {/* Title */}
      <h1 className="text-lg md:text-xl font-semibold mb-4">Inventory</h1>

      {/* Search + Filters + Actions */}
      <div className="flex flex-col md:flex-row   items-center gap-4 mb-4">
        {/* Search textarea */}
        <textarea
          rows={1}
          placeholder="Search"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="w-full rounded-lg border border-teal-700 px-3 py-2 text-sm resize-none focus:outline-teal-500 hover:outline-teal-500 transition"
        />

        {/* Product/Service filter */}
        <FormControl className="w-full md:w-[200px]">
          <select
            value={productServiceFilter}
            onChange={(e) => setProductServiceFilter(e.target.value)}
            className="w-full rounded border border-gray-400 py-2 px-3"
          >
            <option value="">All Products/Services</option>
            <option value="product">Products</option>
            <option value="service">Services</option>
          </select>
        </FormControl>

        {/* Store filter */}
        <FormControl className="w-full md:w-[200px]">
          <Select
            options={storeOptions}
            value={storeFilter}
            onChange={(d: any) => setStoreFilter(d)}
            classNamePrefix="react-select"
            styles={{ container: (base) => ({ ...base, width: '100%' }) }}
          />
        </FormControl>

        {/* Add Product Button */}
        <Button
          onClick={openAddProductDrawerHandler}
          color="#fff"
          backgroundColor={MainColor}
          _hover={{ backgroundColor: "#14b8a6" }}
          className="py-3 rounded-lg text-white w-full "
          fontSize="sm"
        >
          Add New Product
        </Button>

        {/* Refresh Button */}
        <Button
          onClick={fetchProductsHandler}
          leftIcon={<MdOutlineRefresh />}
          color="#319795"
          borderColor="#319795"
          variant="outline"
          className="w-full "
          fontSize="sm"
        >
          Refresh
        </Button>

        {/* Page size selector */}
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

      {/* Export + Bulk Upload */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <Button
          onClick={handleExport}
          isLoading={isSubmitting}
          color="#fff"
          backgroundColor={MainColor}
          _hover={{ backgroundColor: "#14b8a6" }}
          className="py-3 rounded-lg text-white w-full md:w-auto"
          fontSize="sm"
        >
          Export CSV
        </Button>

        <div className="w-full md:w-[200px] relative">
          <Button
            onClick={() => setShowBulkUploadMenu(true)}
            color="#fff"
            backgroundColor={MainColor}
            _hover={{ backgroundColor: "#14b8a6" }}
            className="py-3 rounded-lg text-white w-full"
            fontSize="sm"
            rightIcon={<AiFillFileExcel size={22} />}
          >
            Bulk Upload
          </Button>

          {showBulkUploadMenu && (
            <div className="absolute z-10 mt-1 w-full border border-gray-300 rounded bg-white p-3 shadow-lg">
              <form>
                <FormControl>
                  <FormLabel fontWeight="bold" htmlFor="bulk-file">
                    Choose File (.csv)
                  </FormLabel>
                  <Input
                    id="bulk-file"
                    ref={fileRef}
                    type="file"
                    accept=".csv, .xlsx"
                    borderColor="gray.300"
                    py={1}
                  />
                </FormControl>

                <div className="flex gap-2 mt-3">
                  <Button
                    type="submit"
                    onClick={bulkUploadHandler}
                    color="#fff"
                    backgroundColor={MainColor}
                    rightIcon={<AiFillFileExcel size={22} />}
                    isLoading={bulkUploading}
                    fontSize="sm"
                  >
                    Upload
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setShowBulkUploadMenu(false)}
                    color="#fff"
                    backgroundColor={MainColor}
                    rightIcon={<RxCross2 size={22} />}
                    fontSize="sm"
                  >
                    Close
                  </Button>
                </div>

                <a href={SampleCSV} className="block mt-3">
                  <Button
                    type="button"
                    color="#fff"
                    backgroundColor={MainColor}
                    rightIcon={<AiFillFileExcel size={22} />}
                    fontSize="sm"
                    w="full"
                  >
                    Sample CSV
                  </Button>
                </a>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <ProductTable
        isLoadingProducts={isLoadingProducts}
        products={filteredData}
        pageSize={PageSize}
        setPageSize={setPageSize}
        openUpdateProductDrawerHandler={openUpdateProductDrawerHandler}
        openProductDetailsDrawerHandler={openProductDetailsDrawerHandler}
        deleteProductHandler={deleteProductHandler}
        deletebulkProductHandler={deletebulkProductHandler}
      />
    </div>
  
  );
};

export default Products;
