//@ts-nocheck
import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Icon,
  Badge,
  SlideFade,
} from "@chakra-ui/react";
import { FaCheckCircle, FaHourglassHalf, FaCircle } from "react-icons/fa";

const Track = ({ sale, selectedBomIndex }) => {  
  const [sampleProcesses, setSampleProcesses] = useState([]);

  useEffect(() => {
 
    const selectedBom = sale?.boms[selectedBomIndex];
    const fetchedSampleProcesses = selectedBom?.production_processes[0]?.processes || [];
    setSampleProcesses(fetchedSampleProcesses);
  }, [sale, selectedBomIndex]);  

  const getStatusText = (start, done) => {
    if (!start && !done) return "Pending";
    if (start && !done) return "Under Processing";
    if (start && done) return "Completed";
    return "";
  };

  return (
    <Box p={6} bg="gray.50" borderRadius="lg" boxShadow="md" className="mb-5">
      <Text className="text-2xl font-bold mb-6 text-center">
        {selectedBomIndex === 0 ? "Sample Product Process" : " Production Process"}
      </Text>

      {sampleProcesses?.length === 0 ? (
        <Text className="text-red-500 text-center">
          Production Process is not Registered yet!
        </Text>
      ) : (
        <VStack
          spacing={8}
          align="stretch"
          position="relative"
          className="timeline-container max-h-[20rem] overflow-y-scroll"
        >
          {sampleProcesses.map((process, index) => {
            const statusText = getStatusText(process?.start, process?.done);
            const isCompleted = process?.done;
            const isUnderProcessing = process?.start && !process?.done;

            return (
              <SlideFade key={process?._id} in={true} offsetY={index * 10}>
                <HStack
                  spacing={6}
                  align="center"
                  className="timeline-item"
                  p={4}
                  bg="white"
                  borderRadius="lg"
                  shadow="lg"
                  borderLeftWidth="4px"
                  borderLeftColor={
                    isCompleted ? "green.400" : isUnderProcessing ? "orange.400" : "gray.400"
                  }
                >
                  <Box className="timeline-icon" position="relative">
                    <Icon
                      as={isCompleted ? FaCheckCircle : FaHourglassHalf}
                      boxSize={6}
                      color={isCompleted ? "green.500" : isUnderProcessing ? "orange.500" : "gray.500"}
                    />
                    {index !== sampleProcesses?.length - 1 && (
                      <Box
                        position="absolute"
                        left="50%"
                        top="100%"
                        width="2px"
                        height="40px"
                        bg="gray.200"
                        transform="translateX(-50%)"
                      />
                    )}
                  </Box>
                  <VStack align="start" spacing={2} flex="1">
                    <Text className="font-medium text-lg">{process?.process}</Text>
                    <Badge
                      colorScheme={
                        isCompleted ? "green" : isUnderProcessing ? "orange" : "gray"
                      }
                      fontSize="sm"
                      textTransform="uppercase"
                    >
                      {statusText}
                    </Badge>
                    <Progress
                      value={isCompleted ? 100 : isUnderProcessing ? 50 : 0}
                      size="sm"
                      colorScheme={isCompleted ? "green" : isUnderProcessing ? "orange" : "gray"}
                      className="w-full"
                    />
                  </VStack>
                </HStack>
              </SlideFade>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default Track;
