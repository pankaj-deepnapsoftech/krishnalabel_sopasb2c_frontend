//@ts-nocheck
import { useState } from "react";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Stack,
  Box,
  useBreakpointValue,
  useToast,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {socket} from "../socket";

const DispatchData = ({ sale_id, trackId, trackLink, onClose }) => {
  const [formData, setFormData] = useState({
    tracking_id: "",
    tracking_web: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const [cookies] = useCookies(["access_token"]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/dispatch/${sale_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Tracking data sended to the customer successfully :) ",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      socket.emit('notificationdatachange', true);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to send the data ,  Please try again :( ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }

    
  };

  const formWidth = useBreakpointValue({ base: "100%", md: "50%" });

  return (
    <Box className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-orange-500 mb-4 text-center">
        {trackId && trackLink
          ? "You have already added the link and Id for delivery track :)"
          : "Please provide the website link and the tracking id of the Delivery"}
      </h2>
      {trackId && trackLink ? (
        <div>
          <Text className="text-blue-600 font-semibold">
            Delievery Site Link:{" "}
            <span className="text-gray-800 font-normal">{trackLink}</span>
          </Text>
          <Text className="text-blue-600 font-semibold">
            Tracking Id:{" "}
            <span className="text-gray-800 font-normal">{trackId}</span>
          </Text>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="dispatchDate" isRequired>
              <FormLabel> Delivery Website Link</FormLabel>
              <Input
                type="text"
                name="tracking_web"
                value={formData.tracking_web}
                onChange={handleChange}
                placeholder="Enter website link..."
                className="border border-gray-300 rounded-md p-2"
              />
            </FormControl>

            <FormControl id="trackingNumber" isRequired>
              <FormLabel>Tracking Number</FormLabel>
              <Input
                type="text"
                name="tracking_id"
                value={formData.tracking_id}
                onChange={handleChange}
                placeholder="Enter tracking number"
                className="border border-gray-300 rounded-md p-2"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              className="transition-all duration-300 hover:bg-blue-600"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Stack>
        </form>
      )}
    </Box>
  );
};

export default DispatchData;
