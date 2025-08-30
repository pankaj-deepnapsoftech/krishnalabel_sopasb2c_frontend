//@ts-nocheck

import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    Toast,
    useColorModeValue,
    useToast,
    VStack,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useState } from "react";
  import { useCookies } from "react-cookie";
  import { socket } from "../../socket";
  const TokenProof = ({ id, amount, tokenFile, onClose }) => {
    const [file, setFile] = useState(null);
    const dropZoneBg = useColorModeValue("gray.100", "gray.700");
    const [cookies] = useCookies(['access_token']);
    const Toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const handleFileDrop = (event) => {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        setFile(event.dataTransfer.files[0]);
      }
    };
  
    const triggerFileInput = () => {
      const fileInput = document.getElementById("file-input");
      fileInput && fileInput.click();
    };
  
    const handleFileUpload = async () => {
      if (!file) {
        alert("Please select a file to upload.");
        return;
      }
  
      const formData = new FormData();
      formData.append("token_ss", file);
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const token = cookies?.access_token
        const response = await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}purchase/tokenProof/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        Toast({
          title: "Success",
          description: "File Uploaded Successfully :) ",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        socket.emit('notificationdatachange', true);
        onClose(); // Close the modal or perform any other action
      } catch (error) {
        console.error("Error uploading file:", error);
        Toast({
          title: "Error",
          description: "Failed to upload the File :( ",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
  
        onClose(); // Close the modal or perform any other action
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div>
        <VStack spacing={4} align="stretch">
          {tokenFile ? (
            <Text color="teal.500" className="text-lg">
              <strong className="text-orange-500">You have already paid the token amount for sample :) </strong> <br/>
              <a href={tokenFile} target="_blank" className="mt-3">
                Uploaded File
              </a>
            </Text>
          ) : (
            <>
            
            <p className="underline">Amount to pay: <span className="text-green-500 font-semibold">{amount}</span></p>
              <FormControl>
                <FormLabel>Upload token Proof Screenshort</FormLabel>
                <Box
                  p={4}
                  borderWidth="2px"
                  borderColor={file ? "teal.500" : "gray.300"}
                  borderRadius="md"
                  bg={dropZoneBg}
                  textAlign="center"
                  onDrop={handleFileDrop}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnter={(event) => event.preventDefault()}
                  onClick={triggerFileInput}
                  cursor="pointer"
                >
                  <Text fontSize="sm" color="gray.500">
                    Drag and drop a file here, or{" "}
                    <Text as="span" color="blue.500" cursor="pointer">
                      browse
                    </Text>
                  </Text>
                </Box>
                <Input
                  type="file"
                  id="file-input"
                  display="none"
                  onChange={(event) =>
                    setFile(event.target.files ? event.target.files[0] : null)
                  }
                />
              </FormControl>
  
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleFileUpload}
                isDisabled={!file}
                disabled={isSubmitting}
              >
                Upload
              </Button>
            </>
          )}
        </VStack>
      </div>
    );
  };
  
  export default TokenProof;
  