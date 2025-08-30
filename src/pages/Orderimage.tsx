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

const UploadorderImage = ({ purchaseData, onClose }) => {
  const [file, setFile] = useState(null);
  const dropZoneBg = useColorModeValue("gray.100", "gray.700");
  const [cookies] = useCookies();
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
    formData.append("sample_image", file);
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}purchase/upload-order-image/${purchaseData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
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

      onClose(); // Close the modal or perform any other action
    } catch (error) {
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
        {purchaseData?.sample_image ? (
          <Text fontSize="sm" color="teal.500">
            <strong className="text-black">You have already uploaded the file : </strong>
            <a href={purchaseData?.sample_image} target="_blank">
              Uploaded File
            </a>
          </Text>
        ) : (
          <>
            <FormControl>
              <FormLabel>Upload File</FormLabel>
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

export default UploadorderImage;
