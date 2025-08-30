//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, Grid, GridItem, Img, Text } from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";

const TaskOverview = () => {
  const [cookies] = useCookies(["access_token"]);
  const [taskStatus, setTaskStatus] = useState([]);
  
  // Fetch data from the backend API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}assined/get-count`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      setTaskStatus(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 
  const getStatusCount = (status:any) => {
    const statusData = taskStatus?.find(item => item.status === status);
    return statusData ? statusData?.count : 0; // Return 0 if status is not found
  };

  return (
    <Box
      w="full"
      p={6}
      bg="gray.50"
      className="flex items-center justify-center"
    >
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        className="w-full max-w-6xl"
      >
        <GridItem
          bg="white"
          shadow="md"
          rounded="lg"
          p={6}
          textAlign="center"
          placeItems="center"
          className="border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <Img
            src="/svg/task-complete.svg"
            className="w-14 h-14 filter-orange img-bounce-scale"
          />
          <Text fontSize="2xl" fontWeight="bold" className="text-gray-700">
            {getStatusCount("Completed")}
          </Text>
          <Text className="text-gray-500">Done</Text>
        </GridItem>

        <GridItem
          bg="white"
          shadow="md"
          rounded="lg"
          p={6}
          textAlign="center"
          placeItems="center"
          className="border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <Img
            src="/svg/task-processing.svg"
            className="w-14 h-14  filter-blue img-bounce-scale"
          />
          <Text fontSize="2xl" fontWeight="bold" className="text-gray-700">
            {getStatusCount("UnderProcessing")}
          </Text>
          <Text className="text-gray-500">UnderProcessing</Text>
        </GridItem>

        <GridItem
          bg="white"
          shadow="md"
          rounded="lg"
          p={6}
          textAlign="center"
          placeItems="center"
          className="border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <Img
            src="/svg/task-due.svg"
            className="w-14 h-14  filter-green img-bounce-scale"
          />
          <Text fontSize="2xl" fontWeight="bold" className="text-gray-700">
            {getStatusCount("Pending")}
          </Text>
          <Text className="text-gray-500">Pending</Text>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default TaskOverview;
