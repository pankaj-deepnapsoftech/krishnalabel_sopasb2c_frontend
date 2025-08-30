import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useAddProductMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

interface AddProductProps {
  closeDrawerHandler: () => void;
  fetchProductsHandler: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({
  closeDrawerHandler,
  fetchProductsHandler,
}) => {
  const [name, setName] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [code, setCode] = useState<string | undefined>();
  const [id, setId] = useState<string | undefined>();
  const [uom, setUom] = useState<
    { value: string; label: string } | undefined
  >();
  const [category, setCategory] = useState<
    { value: string; label: string } | undefined
  >();
  const [currentStock, setCurrentStock] = useState<string | undefined>();
  const [price, setPrice] = useState<string | undefined>();
  const [regularBuyingPrice, setRegularBuyingPrice] = useState<
    number | undefined
  >();
  const [wholesaleBuyingPrice, setWholeSaleBuyingPrice] = useState<
    number | undefined
  >();
  const [mrp, setMrp] = useState<number | undefined>();
  const [dealerPrice, setDealerPrice] = useState<number | undefined>();
  const [distributorPrice, setDistributorPrice] = useState<
    number | undefined
  >();
  const [minStock, setMinStock] = useState<string | undefined>();
  const [maxStock, setMaxStock] = useState<string | undefined>();
  const [hsn, setHsn] = useState<string | undefined>();
  const [itemType, setItemType] = useState<
    { value: string; label: string } | undefined
  >();
  const [subCategory, setSubCategory] = useState<string | undefined>();
  const [productOrService, setProductOrService] = useState<
    { value: string; label: string } | undefined
  >();
  const [store, setStore] = useState<
    { value: string; label: string } | undefined
  >();
  const [storeOptions, setStoreOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [cookies] = useCookies();
  const [inventoryCategory, setInventoryCategory] = useState<
    { value: string; label: string } | undefined
  >();

  const inventoryCategoryOptions = [
    { value: "direct", label: "Direct" },
    { value: "indirect", label: "Indirect" },
  ];

  const categoryOptions = [
    { value: "finished goods", label: "Finished Goods" },
    { value: "raw materials", label: "Raw Materials" },
    { value: "semi finished goods", label: "Semi Finished Goods" },
    { value: "consumables", label: "Consumables" },
    { value: "bought out parts", label: "Bought Out Parts" },
    { value: "trading goods", label: "Trading Goods" },
    { value: "service", label: "Service" },
  ];

  const itemTypeOptions = [
    { value: "buy", label: "Buy" },
    { value: "sell", label: "Sell" },
    { value: "both", label: "Both" },
  ];

  const productOrServiceOptions = [
    { value: "product", label: "Product" },
    { value: "service", label: "Service" },
  ];

  const uomOptions = [
    { value: "pcs", label: "pcs" },
    { value: "kgs", label: "kgs" },
    { value: "ltr", label: "ltr" },
    { value: "tonne", label: "tonne" },
    { value: "cm", label: "cm" },
    { value: "inch", label: "inch" },
    { value: "mtr", label: "mtr" },
  ];

  const [addProduct] = useAddProductMutation();
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


  const addProductHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (
        !name ||
        !id ||
        !uom ||
        !category ||
        !currentStock ||
        !price ||
        !itemType ||
        !productOrService ||
        name.trim().length === 0 ||
        id.trim().length === 0 ||
        !uom
      ) {
        throw new Error("Please fill all the fileds");
      }

      const response = await addProduct({
        name,
        color,
        code,
        inventory_category: inventoryCategory?.value,
        product_id: id,
        uom: uom?.value,
        category: category?.value,
        min_stock: minStock,
        max_stock: maxStock,
        current_stock: currentStock,
        price: price,
        hsn,
        sub_category: subCategory,
        item_type: itemType?.value,
        product_or_service: productOrService?.value,
        regular_buying_price: regularBuyingPrice,
        wholesale_buying_price: wholesaleBuyingPrice,
        mrp: mrp,
        dealer_price: dealerPrice,
        distributor_price: distributorPrice,
        store: store?.value || undefined,
      }).unwrap();
      toast.success(response.message);
      fetchProductsHandler();
      closeDrawerHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
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
      const modifiedStores = data.stores.map((store: any) => ({
        value: store._id,
        label: store.name,
      }));
      setStoreOptions(modifiedStores);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (name) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const formattedName = name.toLowerCase().replace(/\s+/g, "-");
      setId(`${formattedName}-${randomNum}`);
    }
  }, [name]); // R

  useEffect(() => {
    fetchAllStores();
  }, []);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[60vw] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center cursor-pointer text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Product
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-bold text-white py-5 text-center mb-6 border-y bg-teal-500">
            Add New Product
          </h2>

          <form
            onSubmit={addProductHandler}
            className="max-w-4xl mx-auto p-8 bg-white space-y-5"
          >
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Inventory Category</FormLabel>
              <Select
                value={inventoryCategory}
                options={inventoryCategoryOptions}
                onChange={(e: any) => setInventoryCategory(e)}
                required={true}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Product ID</FormLabel>
              <Input
                value={id}
                readOnly 
                type="text"
                placeholder="Product ID"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Product Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Product Name"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" >
              <FormLabel fontWeight="bold">Product Color Name</FormLabel>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                type="text"
                placeholder="Product Color Name"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" >
              <FormLabel fontWeight="bold">Product Code</FormLabel>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                type="text"
                placeholder="Product Code"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Product Price (Default)</FormLabel>
              <Input
                value={price}
                className="no-scrollbar"
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Product Price"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Regular Buying Price</FormLabel>
              <Input
                value={regularBuyingPrice}
                className="no-scrollbar"
                onChange={(e) => setRegularBuyingPrice(+e.target.value)}
                type="number"
                placeholder="Regular Buying Price"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Wholesale Buying Price</FormLabel>
              <Input
                value={wholesaleBuyingPrice}
                className="no-scrollbar"
                onChange={(e) => setWholeSaleBuyingPrice(+e.target.value)}
                type="number"
                placeholder="Regular Buying Price"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">MRP</FormLabel>
              <Input
                value={mrp}
                className="no-scrollbar"
                onChange={(e) => setMrp(+e.target.value)}
                type="number"
                placeholder="MRP"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Dealer Price</FormLabel>
              <Input
                value={dealerPrice}
                className="no-scrollbar"
                onChange={(e) => setDealerPrice(+e.target.value)}
                type="number"
                placeholder="Dealer Price"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Distributor Price</FormLabel>
              <Input
                value={distributorPrice}
                className="no-scrollbar"
                onChange={(e) => setDistributorPrice(+e.target.value)}
                type="number"
                placeholder="Distributor Price"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Product Category</FormLabel>
              <Select
                value={category}
                options={categoryOptions}
                onChange={(e: any) => setCategory(e)}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">UOM (Unit of Measurement)</FormLabel>
              <Select
                value={uom}
                options={uomOptions}
                onChange={(e: any) => setUom(e)}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Product Subcategory</FormLabel>
              <Input
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                type="text"
                placeholder="Product Subcategory"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Product Type</FormLabel>
              <Select
                value={itemType}
                options={itemTypeOptions}
                onChange={(e: any) => setItemType(e)}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Product/Service</FormLabel>
              <Select
                value={productOrService}
                options={productOrServiceOptions}
                onChange={(e: any) => setProductOrService(e)}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Current Stock</FormLabel>
              <Input
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                type="number"
                placeholder="Current Stock"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Min Stock</FormLabel>
              <Input
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                type="number"
                placeholder="Min Stock"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Max Stock</FormLabel>
              <Input
                value={maxStock}
                onChange={(e) => setMaxStock(e.target.value)}
                type="number"
                placeholder="Max Stock"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">HSN</FormLabel>
              <Input
                value={hsn}
                onChange={(e) => setHsn(e.target.value)}
                type="text"
                placeholder="HSN"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Store</FormLabel>
              <Select
                className="w-full rounded mt-2 border border-[#a9a9a9]"
                options={storeOptions}
                value={store}
                onChange={(d: any) => setStore(d)}
              />
            </FormControl>
            <Button
              backgroundColor="#0d9488"
              color="#ffffff"
              type="submit"
              _hover={{ backgroundColor: "#14b8a6" }}
              className="mt-5 w-full py-3  text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AddProduct;
