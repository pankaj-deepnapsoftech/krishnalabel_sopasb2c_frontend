import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import React from "react";
import { MdWavingHand } from "react-icons/md";
import { NavLink } from "react-router-dom";

const EmployeeDashboard = () => {
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap">
        <div className="text-3xl font-bold text-[#22075e] flex items-center justify-center gap-2">
          <MdWavingHand className="text-orange-500 waving-hand" />
          <i>Hi Employee,</i>
        </div>

        <Grid
          templateColumns={{ base: "1fr", md: "3fr 1fr" }}
          gap={6}
          className="w-full"
        >
          <GridItem className=" p-3">
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={4}
              className="w-full"
            >
              {/* Card 1: Total sales */}
              <GridItem>
                <NavLink to="/employee">
                  <Box
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                    className="bg-white flex items-center justify-around gap-4 cursor-pointer hover:scale-105 transition-all ease-in"
                  >
                    <div>
                      <Text fontSize="lg">Sales By You</Text>
                      <Text fontSize="lg" fontWeight="bold">
                        9
                      </Text>
                    </div>
                    <img
                      src="/images/graph.svg"
                      alt="Total Employees"
                      className="w-20 h-20"
                    />
                  </Box>
                </NavLink>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem>
            <Box p={4} borderRadius="md" boxShadow="md" className=" shadow-md">
             hui
            </Box>
          </GridItem>
        </Grid>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
