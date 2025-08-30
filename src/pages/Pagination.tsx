//@ts-nocheck
import React, { useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";

const Pagination = ({page,setPage,length}) => {
 
  
  return (
    <VStack spacing={4} className="p-4">

      {/* Pagination Controls */}
      <Box className="flex justify-center items-center mt-4">
        <HStack spacing={2}>
          {/* Previous Button */}
          <div className="flex items-center gap-2 mt-4">
            {/* Previous Button */}
            <Button
              size="sm"
              isDisabled={page === 1}
              onClick={() => setPage(page - 1)}
              bg="#319795"
              px={4}
         
              color="white"
              _hover={{ bg: "table-color", opacity: 0.9 }}
              _disabled={{ bg: "gray.300", cursor: "not-allowed" }}
              borderRadius="20px"
              boxShadow="md"
            >
              Prev
            </Button>

            {/* Current Page (Disabled) */}
            <Button
              size="sm"
              isDisabled
            
              color="black"
              borderRadius="md"
              boxShadow="md"
              cursor="default"
            >
              {page}
            </Button>

            {/* Next Button */}
            <Button
              size="sm"
              px={4}
              isDisabled={length < 5}
              onClick={() => setPage(page + 1)}
              bg="#319795"
              color="white"
              _hover={{ bg: "table-color", opacity: 0.9 }}
              _disabled={{ bg: "gray.300", cursor: "not-allowed" }}
              borderRadius="20px"
              boxShadow="md"
            >
              Next
            </Button>
          </div>

        </HStack>
      </Box>
    </VStack>
  );
};

export default Pagination;
