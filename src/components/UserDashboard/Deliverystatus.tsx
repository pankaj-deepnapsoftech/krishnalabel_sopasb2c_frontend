import {
  Box,
  Button,
  HStack,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { BiHappyHeartEyes, BiSad } from "react-icons/bi";
import {socket} from "../../socket";
// Define prop type for the component
interface DeliverystatusProps {
  purchaseData: any;
  onClose: any;
  approve:any;
}

const Deliverystatus: React.FC<DeliverystatusProps> = ({
  purchaseData,
  approve,
  onClose,
}) => {
  const [status, setStatus] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [cookies] = useCookies(["access_token"]);
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = {
      customer_approve: status,
      customer_design_comment: comment,
    };
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/delivery-status/${purchaseData}`,
        formData,
        {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        }
      );
      toast({
        title: response.data.message,
        description: "Response added successfully :) ",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      socket.emit('notificationdatachange', true);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed",
        description: "error adding your response, try again :( ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <Box className="flex flex-col justify-center items-center">
      {approve ? (
        <p className="text-orange-500 font-normal text-sm">You have already change the delivery status: {approve})</p>
      ) : (
        <form onSubmit={handleSubmit}>
            <Text className="mb-5">Have you received the delivery?</Text>
        <HStack align="center" justify="space-between" mb={4}>
          <RadioGroup onChange={setStatus} value={status}>
            <HStack spacing="24px">
              {/* Happy Option */}
              <Radio
                value="yes"
                colorScheme="green"
                size="lg"
                _focus={{ boxShadow: "outline" }}
              >
                <HStack spacing={2}>
                  <Box
                    as={BiHappyHeartEyes}
                    color={status === "yes" ? "green.500" : "gray.400"}
                    fontSize="1.5rem"
                  />
                  <Text
                    fontSize="md"
                    fontWeight={status === "yes" ? "bold" : "normal"}
                    color={status === "yes" ? "green.500" : "gray.700"}
                  >
                    Yes
                  </Text>
                </HStack>
              </Radio>

              {/* Sad Option */}
              <Radio
                value="no"
                colorScheme="red"
                size="lg"
                _focus={{ boxShadow: "outline" }}
              >
                <HStack spacing={2}>
                  <Box
                    as={BiSad}
                    color={status === "no" ? "red.500" : "gray.400"}
                    fontSize="1.5rem"
                  />
                  <Text
                    fontSize="md"
                    fontWeight={status === "no" ? "bold" : "normal"}
                    color={status === "no" ? "red.500" : "gray.700"}
                  >
                    No
                  </Text>
                </HStack>
              </Radio>
            </HStack>
          </RadioGroup>
        </HStack>

        {status === "no" && (
          <Textarea
            placeholder="Please provide feedback..."
            mt={2}
            resize="vertical"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}

        <Button
          type="submit"
          size="sm"
          bgColor="white"
          _hover={{ bgColor: "blue.500" }}
          className="border border-blue-500 hover:text-white mt-2 w-full"
              disabled={isSubmitting}
        >
          Submit
        </Button>
      </form>
      )}

     
    </Box>
  );
};

export default Deliverystatus;
