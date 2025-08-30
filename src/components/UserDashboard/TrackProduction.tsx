import { Box, Text, VStack, Badge, Progress } from "@chakra-ui/react";

const TrackProduction = ({ designProcess, productionProcess, stage }: any) => {
  const ColorChange = (color: any) => {
    if (color === "Pending") {
      return "orange";
    } else if (color === "Design Rejected") {
      return "red";
    } else if (color === "UnderProcessing") {
      return "blue";
    } else {
      return "green";
    }
  };

  const progressChange = (value: any) => {
    if (value === "Pending") {
      return 20;
    } else if (value === "Design Rejected") {
      return 0;
    } else if (value === "UnderProcessing") {
      return 50;
    } else {
      return 100;
    }
  };

  const getProcessStatus = (start: boolean, done: boolean) => {
    if (done) {
      return "Completed";
    } else if (start) {
      return "UnderProcessing";
    } else {
      return "Pending";
    }
  };

  const getProgressValue = (start: boolean, done: boolean) => {
    if (done) {
      return 100;
    } else if (start) {
      return 50;
    } else {
      return 20; 
    }
  };


  return (
    <Box p={4}>
      {/* Design Process Section */}
      <Box mb={8}>
        <Text fontWeight="bold" fontSize="2xl" color="blue.600" mb={4}>
          Process
        </Text>
        {designProcess?.length === 0 ? (
          <Box>No process data available.</Box>
        ) : (
          <VStack align="start" spacing={4} className="max-h-[20rem] overflow-y-scroll">
            {designProcess?.map((stage: any, index: number) => (
              <Box
                key={index}
                p={4}
                w="full"
                borderWidth="1px"
                borderRadius="lg"
                shadow="md"
                bg={`${ColorChange(stage?.isCompleted)}.50`}
                borderColor={ColorChange(stage?.isCompleted)}
              >
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color={ColorChange(stage?.isCompleted)}
                >
                  {stage?.assined_process}
                </Text>
                <Text mt={2} fontSize="md">
                  Status:
                  <Badge ml={2} colorScheme={ColorChange(stage?.isCompleted)} variant="solid">
                    {stage?.isCompleted}
                  </Badge>
                </Text>
                <Box mt={2}>
                  <Text fontSize="sm" color="gray.500">
                    Progress:
                  </Text>
                  <Box mt={1} w="full">
                    <Progress
                      value={progressChange(stage?.isCompleted)}
                      size="sm"
                      colorScheme={ColorChange(stage?.isCompleted)}
                      borderRadius="md"
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* Production Process Section */}
      <Box>
        <Text className="text-gray-600 text-center">
        {stage != "real" ? null : "The sample has been approved :)"}
        </Text>
        <Text fontWeight="bold" fontSize="2xl" color="blue.600" mb={4}>
          {stage === "real" ? "Production Process": "Sample Process"}
        </Text>
        {productionProcess?.length === 0 || designProcess?.length === 0 ? (
          <Box>No production process data available.</Box>
        ) : (
          <VStack align="start" spacing={4} className="max-h-[20rem] overflow-y-scroll">
            {productionProcess?.map((stage: any, index: number) => {
              const status = getProcessStatus(stage?.start, stage?.done);
              const progressValue = getProgressValue(stage?.start, stage?.done);
              const colorScheme = status === "Completed" ? "green" : status === "UnderProcessing" ? "blue" : "orange";

              return (
                <Box
                  key={index}
                  p={4}
                  w="full"
                  borderWidth="1px"
                  borderRadius="lg"
                  shadow="md"
                  bg={status === "Completed" ? "green.50" : status === "UnderProcessing" ? "blue.50" : "orange.50"}
                  borderColor={colorScheme}
                >
                  <Text fontWeight="bold" fontSize="lg" color={colorScheme}>
                    {stage?.process}
                  </Text>
                  <Text mt={2} fontSize="md">
                    Status:
                    <Badge ml={2} colorScheme={colorScheme} variant="solid">
                      {status}
                    </Badge>
                  </Text>
                  <Box mt={2}>
                    <Text fontSize="sm" color="gray.500">
                      Progress:
                    </Text>
                    <Box mt={1} w="full">
                      <Progress
                        value={progressValue}
                        size="sm"
                        colorScheme={colorScheme}
                        borderRadius="md"
                      />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default TrackProduction;
