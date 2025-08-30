//@ts-nocheck
import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {socket} from "../socket";

const CreateCustomer: React.FC = ({ onClose, refresh }) => {
  const [customerType, setCustomerType] = useState("Individual");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [cookies] = useCookies();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      type: customerType,
      full_name: fullName,
      email,
      password,
      phone: phoneNo,
      ...(customerType === "company" && {
        company_name: companyName,
        GST_NO: gstNo,
      }),
    };
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}customer/create`,
        payload
      );

      toast({
        title: "Customer Created",
        description: "Customer details have been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset the form
      setCustomerType("individual");
      setFullName("");
      setEmail("");
      setPassword("");
      setPhoneNo("");
      setCompanyName("");
      setGstNo("");

      onClose();
      socket.emit('notificationdatachange', true);
    } catch (error: any) {
      console.log(error);

      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create customer.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev); // Toggle the showPassword state
  };

  return (
    <Box className="w-[100%]  mx-auto px-2">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer Type */}
        <FormControl id="type" isRequired>
          <FormLabel className="text-lg font-medium">Customer Type</FormLabel>
          <Select
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
            className="focus:ring-2 focus:ring-blue-500"
          >
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </Select>
        </FormControl>

        {/* Full Name & Email (side by side on desktop) */}
        <div className="flex flex-col md:flex-row gap-4">
          <FormControl id="fullName" isRequired className="w-full">
            <FormLabel className="text-lg font-medium">Full Name</FormLabel>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              placeholder="Enter full name"
              className="border-2 border-gray-300 rounded-md p-2"
            />
          </FormControl>

          <FormControl id="email" isRequired className="w-full">
            <FormLabel className="text-lg font-medium">Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="border-2 border-gray-300 rounded-md p-2"
            />
          </FormControl>
        </div>

        {/* Password with eye icon (fixed positioning) */}
        <FormControl id="password" isRequired className="relative">
          <FormLabel className="text-lg font-medium">Password</FormLabel>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="border-2 border-gray-300 rounded-md p-2 pr-10"
          />
          <IconButton
            aria-label="Toggle password visibility"
            icon={showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            onClick={toggleShowPassword}
            variant="ghost"
            size="sm"
            className="!absolute top-[43px] right-3 z-10"
          />
        </FormControl>

        {/* Phone Number */}
        <FormControl id="phoneNo" isRequired>
          <FormLabel className="text-lg font-medium">Phone Number</FormLabel>
          <Input
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            type="tel"
            placeholder="Enter phone number"
            className="border-2 border-gray-300 rounded-md p-2"
          />
        </FormControl>

        {/* Company Fields (conditionally rendered) */}
        {customerType === "company" && (
          <div className="flex flex-col md:flex-row gap-4">
            <FormControl id="companyName" isRequired className="w-full">
              <FormLabel className="text-lg font-medium">Company Name</FormLabel>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                type="text"
                placeholder="Enter company name"
                className="border-2 border-gray-300 rounded-md p-2"
              />
            </FormControl>

            <FormControl id="gstNo" isRequired className="w-full">
              <FormLabel className="text-lg font-medium">GST No</FormLabel>
              <Input
                value={gstNo}
                onChange={(e) => setGstNo(e.target.value)}
                type="text"
                placeholder="Enter GST number"
                className="border-2 border-gray-300 rounded-md p-2"
              />
            </FormControl>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          width="full"
          colorScheme="teal"
          isLoading={isSubmitting}
          className="text-white"
        >
          Create Customer
        </Button>
      </form>
    </Box>
  
  );
};

export default CreateCustomer;
