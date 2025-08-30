//@ts-nocheck
import { useState } from 'react';
import { Input, Button, FormControl, FormLabel, useToast, Badge } from '@chakra-ui/react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {socket} from "../socket"
const TokenAmount = ({ sale, onClose, refresh, tokenAmount }) => {
  const [amount, setAmount] = useState('');
  const toast = useToast();
  const [cookies] = useCookies();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const token = cookies?.access_token;

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount greater than 0.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/addToken/${sale}`,
        { token_amt: amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      toast({
        title: 'Amount submitted',
        description: `${response.data?.message}`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      socket.emit('notificationdatachange', true);
      onClose();
    } catch (error) {
      console.error('Error submitting amount:', error);

      toast({
        title: 'Submission failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-xl shadow-md">

      {tokenAmount ? (
        <div className='text-center w-full text-lg'>
        <p className='text-orange-500  mb-3 font-semibold'>You've already added the token amount for sample :)</p>
        <Badge colorScheme='green'>
        Amount: {tokenAmount}
        </Badge>
        </div>
      ): (
             <form className="space-y-4">
             <FormControl id="amount" isRequired>
               <FormLabel>Token Amount</FormLabel>
               <Input
                 type="number"
                 value={amount}
                 onChange={handleAmountChange}
                 placeholder="Enter the amount of tokens"
                 className="border-2 border-gray-300 rounded-md"
               />
             </FormControl>
     
             <div className="flex justify-between space-x-2">    
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={isSubmitting}
                >
                 Submit
                </Button>
             </div>
           </form>
      )}


 
    </div>
  );
};

export default TokenAmount;
