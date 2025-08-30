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

// Define prop type for the component
interface ViewDesignProps {
  designUrl: string;
  purchaseData: any;
  onClose: any;
  approve:string;
}

const Salestatus: React.FC<ViewDesignProps> = ({
  designUrl,
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
        salestatus: status,
        salestatus_comment: comment,
    };
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}purchase/updatesales/${purchaseData?._id}`,
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
          {approve}
      {approve === "Approve" ? (
        <p className="text-orange-500 font-normal text-sm">You have already approved the status :)</p>
          ) : approve === "Reject" ? (
                <>
                      <p className="text-orange-500 font-normal text-sm">You have already Reject the status </p>
                    <p>Comment : </p>
                      <p>{purchaseData?.salestatus_comment}</p>
                </>
          ): (
        <form onSubmit={handleSubmit}>
        <HStack align="center" justify="space-between" mb={4}>
          <RadioGroup onChange={setStatus} value={status}>
            <HStack spacing="24px">
              {/* Happy Option */}
              <Radio
                value="Approve"
                colorScheme="green"
                size="lg"
                _focus={{ boxShadow: "outline" }}
              >
                <HStack spacing={2}>
                  <Box
                    as={BiHappyHeartEyes}
                    color={status === "Approve" ? "green.500" : "gray.400"}
                    fontSize="1.5rem"
                  />
                  <Text
                    fontSize="md"
                    fontWeight={status === "Approve" ? "bold" : "normal"}
                    color={status === "Approve" ? "green.500" : "gray.700"}
                  >
                    Approve
                  </Text>
                </HStack>
              </Radio>

              {/* Sad Option */}
              <Radio
                value="Reject"
                colorScheme="red"
                size="lg"
                _focus={{ boxShadow: "outline" }}
              >
                <HStack spacing={2}>
                  <Box
                    as={BiSad}
                    color={status === "Reject" ? "red.500" : "gray.400"}
                    fontSize="1.5rem"
                  />
                  <Text
                    fontSize="md"
                    fontWeight={status === "Reject" ? "bold" : "normal"}
                    color={status === "Reject" ? "red.500" : "gray.700"}
                  >
                    Reject
                  </Text>
                </HStack>
              </Radio>
            </HStack>
          </RadioGroup>
        </HStack>

        {status === "Reject" && (
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

export default Salestatus;
