//@ts-nocheck

import { Button, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { FaCheck } from "react-icons/fa";
import { socket } from "../socket";
const SampleModal = ({ sale, onClose, refresh, approveStatus }) => {
  const toast = useToast();
  const [cookies] = useCookies(["access_token"]);
  const token = cookies?.access_token;

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/approveSample/${sale}`, {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Sample Status",
        description: `${response.data?.message}`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      onClose();
      socket.emit('notificationdatachange', true);
      refresh();
    } catch (error) {
        console.log(error)
      toast({
        title: "Failed",
        description: "Something went wrong :(",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 justify-center">
      {approveStatus === undefined ? (
        <>
          <Text className="text-orange-500 font-semibold text-sm">
            Is sample product approved by customer ? If yes, please mark it as
            approved!{" "}
          </Text>
          <Button
            colorScheme="green"
            leftIcon={<FaCheck />}
            onClick={(e) => handleClick(e)}
          >
            Mark Approved
          </Button>
        </>
      ) : (
        <Text className="text-green-500 font-semibold text-sm">
          The sample product is already approved by customer :){" "}
        </Text>
      )}
    </div>
  );
};

export default SampleModal;
