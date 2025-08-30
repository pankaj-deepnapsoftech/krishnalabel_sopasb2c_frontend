//@ts-nocheck
import {
  Button,
  HStack,
  Img,
  Text,
  Toast,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { IoMdCheckmarkCircle } from "react-icons/io";
import {socket} from "../socket";
const PaymentModal = ({ sale_id, payment, verify, assign, payfor, onClose }) => {
  const [cookies] = useCookies(["access_token"]);
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const verifyToken = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/verifyToken/${sale_id}`,
        {assignId: assign },
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Token Amount Verified successfully :) ",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      socket.emit('notificationdatachange', true);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to verify the token,  Please try again :( ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/verify-payement/${sale_id}`,
        { payment_verify: true, assignId: assign },
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Payment Verified successfully :) ",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      socket.emit('notificationdatachange', true);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to verify the payment,  Please try again :( ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
  
      <VStack>
        <Text className="text-green-600 font-bold text-center">
         {payfor === "token" ? "Token Amount has been uploaded by the customer" : " Payment has been uploaded by the customer"}
        </Text>
        <a href={payment} target="_blank">
          Click to view
        </a>

        {verify === true ? (
          <Text className="text-green-600 space-x-2 flex items-center justify-center ">
            <IoMdCheckmarkCircle />
            Verified
          </Text>
        ) : (
          <>
              <Button colorScheme="green" disabled={isSubmitting} onClick={payfor === "token" ? verifyToken : handleVerify }>
              Verify
            </Button>
            <Text className="text-sm text-orange-500">
              Please click on verify button to verify the payment
            </Text>
          </>
        )}
      </VStack>
    </div>
  );
};

export default PaymentModal;
