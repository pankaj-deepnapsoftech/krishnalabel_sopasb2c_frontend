import {
    Box,
    Button,
    HStack,
    Image,
    Radio,
    RadioGroup,
    Text,
    Textarea,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useCookies } from "react-cookie";
  import { BiHappyHeartEyes, BiSad } from "react-icons/bi";
  import {socket} from "../../socket";
  import {
    useUpdateBOMMutation,
  } from "../../redux/api/api";

  import { toast } from "react-toastify";
  // Define prop type for the component
  interface BomApprovalProps {
    bomData: any;
    onClose: any;
    approve:string;
  }
  
  const BomApproval: React.FC<BomApprovalProps> = ({
    bomData,
    approve,
    onClose,
  }) => {

    const [status, setStatus] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [cookies] = useCookies(["access_token"]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [updateBom] = useUpdateBOMMutation();

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      const formData = {
        _id: bomData?._id,
        approved: status,
        admin_bom_comment: comment,
      };
      try {
        const response = await updateBom(formData).unwrap();
        toast.success(response.message);
        socket.emit('notificationdatachange', true);
        onClose();
      } catch (err: any) {
        toast.error(err?.data?.message || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Box className="flex flex-col justify-center items-center">
        {approve == "Reject" ? (
          <>
            <p className="text-orange-500 font-normal text-sm">Admin have already reject the bom wait for update bom :)</p>
            <p>{bomData?.admin_bom_comment}</p>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
          <HStack align="center" justify="space-between" mb={4}>
            <RadioGroup onChange={setStatus} value={status}>
              <HStack spacing="24px">
                {/* Happy Option */}
                <Radio
                  value="true"
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
  
  export default BomApproval;
  