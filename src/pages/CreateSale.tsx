// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Box,
  RadioGroup,
  Radio,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { socket } from '../socket';

const CreateSale: React.FC = ({ onClose, refresh }) => {
  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    product_type: "finished goods",
    price: "",
    product_qty: "",
    GST: 0,
    comment: "",
    productFile: null, // New field for image
    performaInvoice: null, // New field for image
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [customerRes, productRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}customer/getall`, {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}product/all`, {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }),
        ]);

        const filteredProducts = (productRes.data.products || []).filter(
          (product: any) => product.category == "finished goods"
        );

        setCustomers(customerRes.data.data || []);
        setProducts(filteredProducts || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data for dropdowns.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchDropdownData();
  }, [cookies.access_token, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleGSTChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      GST: Number(value),
    }));
  };

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("customer_id", formData.customer_id);
    formDataToSend.append("product_id", formData.product_id);
    formDataToSend.append("product_type", formData.product_type);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("product_qty", formData.product_qty);
    formDataToSend.append("GST", formData.GST.toString());
    formDataToSend.append("comment", formData.comment);

    if (formData.performaInvoice) {
      formDataToSend.append("performaInvoice", formData.performaInvoice);
    }
    if (formData.productFile) {
      formDataToSend.append("productFile", formData.productFile);
    }

 
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}purchase/create`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData({
        customer_id: "",
        product_id: "",
        product_type: "finished goods",
        price: "",
        product_qty: "",
        GST: 0,
        comment: "",
        productFile: null,
      });

      toast({
        title: "Sale Created",
        description: "The sale has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      socket.emit('notificationdatachange', true);
      onClose();
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to create the sale. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box w="full" maxW={{ base: "100%", md: "600px" }} mx="auto" px={{ base: 4, md: 0 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={5}>
          {/* Customer */}
          <FormControl id="customer_id" isRequired>
            <FormLabel fontSize="md">Customer</FormLabel>
            <Select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleInputChange}
              placeholder="Select a customer"
            >
              {customers.map((customer: any) => (
                <option key={customer?._id} value={customer?._id}>
                  {customer?.full_name} {customer?.company_name ? ` - ${customer?.company_name}` : ""}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Product */}
          <FormControl id="product_name" isRequired>
            <FormLabel fontSize="md">Product</FormLabel>
            <Select
              name="product_id"
              value={formData?.product_id}
              onChange={handleInputChange}
              placeholder="Select a product"
            >
              {products.map((product: any) => (
                <option key={product?._id} value={product?._id}>
                  {product?.name}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Price */}
          <FormControl id="price" isRequired>
            <FormLabel fontSize="md">Price</FormLabel>
            <Input
              type="number"
              name="price"
              value={formData?.price}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Product Quantity */}
          <FormControl id="product_qty" isRequired>
            <FormLabel fontSize="md">Product Quantity</FormLabel>
            <Input
              type="number"
              name="product_qty"
              value={formData?.product_qty}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Pro Forma Invoice */}
          <FormControl>
            <FormLabel fontSize="md">Proforma Invoice</FormLabel>
            <Input
              type="file"
              accept="application/pdf,image/*"
              name="performaInvoice"
              onChange={handleInputChange}
            />
          </FormControl>

          {/* GST Radio Group */}
          <FormControl id="GST">
            <FormLabel fontSize="md">GST Type</FormLabel>
            <RadioGroup
              onChange={handleGSTChange}
              value={formData?.GST?.toString()}
            >
              <Stack direction={{ base: "column", sm: "row" }}>
                <Radio value="18">18%</Radio>
                <Radio value="12">12%</Radio>
                <Radio value="5">5%</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {/* Product File Upload */}
          <FormControl id="productFile">
            <FormLabel fontSize="md">Product Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              name="productFile"
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Remarks */}
          <FormControl id="comment">
            <FormLabel fontSize="md">Remarks</FormLabel>
            <Input
              type="text"
              name="comment"
              value={formData?.comment}
              onChange={handleInputChange}
              placeholder="Further Details (if any)"
            />
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
            isDisabled={isSubmitting}
          >
            Add Sale
          </Button>
        </Stack>
      </form>
    </Box>
  
  );

};

export default CreateSale;
