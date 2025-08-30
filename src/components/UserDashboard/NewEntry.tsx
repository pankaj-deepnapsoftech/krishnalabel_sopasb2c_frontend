import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { updateData } from "../../redux/reducers/commonSlice";

const NewEntry: React.FC = () => {
  const [formData, setFormData] = useState({
    type: "person",
    name: "",
    comment: "",
    details: "",
    phone: "",
    address: "",
    purpose: "",
    contact_person: "",
    material: "",
    status: "in",
  });
  const [cookies] = useCookies(["access_token"]);
  const toast = useToast();
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {     

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}gard/create`,
        formData,
        { headers: { Authorization: `Bearer ${cookies.access_token}` } }
      );

      dispatch(updateData(1))
      toast({
        title: res.data.message,
        description: "The new entry has been successfully added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      
      setFormData({
        type: "person",
        name: "",
        comment: "",
        details: "",
        phone: "",
        address: "",
        purpose: "",
        contact_person: "",
        material: "",
        status: "in",
      });
    } catch (error: any) {
      toast({
        title: error.response?.errors?.[0]?.message || error.response?.message || "Something went wrong",
        description: "Failed to add the new entry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ChakraProvider>
      <Box className="p-6 bg-gray-100 min-h-screen md:ml-80 sm:ml-0 overflow-x-hidden">
        <Text className="text-2xl font-bold mb-6">Add New Entry</Text>

        <Box as="form" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* Type Selector */}
          <FormControl mb="4" isRequired>
            <FormLabel>Type</FormLabel>
            <Select name="type" value={formData.type} onChange={handleInputChange} bg="white" borderColor="gray.300">
              <option value="person">Person</option>
              <option value="vehicle">Vehicle</option>
            </Select>
          </FormControl>

          {/* Name Field */}
          <FormControl mb="4" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              bg="white"
              borderColor="gray.300"
            />
          </FormControl>

          {/* Phone Number */}
          <FormControl mb="4">
            <FormLabel>Phone Number</FormLabel>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              bg="white"
              type="number"
              borderColor="gray.300"
              required
            />
          </FormControl>

          {/* Address */}
          <FormControl mb="4">
            <FormLabel>Address</FormLabel>
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
              bg="white"
              borderColor="gray.300"
            />
          </FormControl>

          {/* Conditional Fields */}
          {formData.type === "person" && (
            <>
              {/* Contact Person */}
              <FormControl mb="4" isRequired>
                <FormLabel>Whom to Meet</FormLabel>
                <Input
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  placeholder="Enter name of person/department to meet"
                  bg="white"
                  borderColor="gray.300"
                />
              </FormControl>
            </>
          )}

          {formData.type === "vehicle" && (
            <>
              {/* Details */}
              <FormControl mb="4" isRequired>
                <FormLabel> Vehicle Details</FormLabel>
                <Input
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  placeholder="Enter vehicle details"
                  bg="white"
                  borderColor="gray.300"
                />
              </FormControl>

              {/* Material */}
              <FormControl mb="4" isRequired>
                <FormLabel>Material</FormLabel>
                <Select
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  bg="white"
                  borderColor="gray.300"
                >
                  <option value="">Select Material</option>
                  <option value="Raw Material">Raw Material</option>
                  <option value="Finished Goods">Finished Goods</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>

              {/* Material Comment */}
             
                <FormControl mb="4">
                  <FormLabel>Material Description</FormLabel>
                  <Input
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Describe the Material"
                    bg="white"
                    borderColor="gray.300"
                  />
                </FormControl>
            
            </>
          )}

          {/* Status */}
          <FormControl mb="4" isRequired>
            <FormLabel>Status</FormLabel>
            <Select name="status" value={formData.status} onChange={handleInputChange} bg="white" borderColor="gray.300">
              <option value="in">In</option>
              <option value="out">Out</option>
            </Select>
          </FormControl>

          <Button type="submit" colorScheme="teal" className="w-full" size="lg" disabled={isSubmitting}>
            Add Entry
          </Button>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default NewEntry;
