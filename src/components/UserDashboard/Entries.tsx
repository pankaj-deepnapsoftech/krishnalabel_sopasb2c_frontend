// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Select,
  Box,
  Text,
  Badge,
  Divider,
  Button,
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Input,
} from "@chakra-ui/react";
import { FaPersonWalkingArrowRight } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import axios from "axios";
import { useCookies } from "react-cookie";
import UpdateEntry from "./UpdateEntry";
import { MdEdit } from "react-icons/md";
import { ImBin } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../redux/reducers/commonSlice";
import Pagination from "../../pages/Pagination";

interface Entry {
  _id: string;
  type: "person" | "vehicle";
  name: string;
  details: string;
  phone: string;
  address: string;
  purpose: string;
  contact_persone: string;
  material: string;
  comment: string;
  status: "in" | "out";
  createdAt: string;
  updatedAt: string;
}

const Entries: React.FC = () => {
  const [inOutFilter, setInOutFilter] = useState<"all" | "in" | "out">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "person" | "vehicle">(
    "all"
  );
  const [dateFilter, setDateFilter] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [cookies] = useCookies(["access_token"]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [pages, setPages] = useState(1);
  const { update } = useSelector((state) => state.Common);
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Fetch entries from the backend
  useEffect(() => {
    const fetchEntries = async () => {
      const token = cookies.access_token;
      if (!token) return;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}gard/get-all?page=${pages}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEntries(response.data?.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch entries.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchEntries();
  }, [cookies?.access_token, update]);

  // Filter entries based on selected filters
  const filteredEntries = entries.filter((entry) => {
    const matchesInOutFilter =
      inOutFilter === "all" || entry?.status === inOutFilter;
    const matchesTypeFilter = typeFilter === "all" || entry?.type === typeFilter;
    const matchesDateFilter =
      !dateFilter ||
      new Date(entry?.createdAt).toDateString() ===
        new Date(dateFilter).toDateString();

    return matchesInOutFilter && matchesTypeFilter && matchesDateFilter;
  });

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    onOpen();
  };

  const handleUpdate = async (updatedEntry: Entry) => {
    const token = cookies?.access_token;
    if (!token) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}gard/update/${updatedentry?._id}`,
        updatedEntry,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Entry updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh data
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry?._id === updatedEntry?._id ? updatedEntry : entry
        )
      );
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update entry?.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entry: Entry) => {
    const token = cookies?.access_token;
    if (!token) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Send DELETE request to the backend to delete the entry
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}gard/delete/${entry?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Entry deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setEntries((prevEntries) =>
        prevEntries?.filter((e) => e?._id !== entry?._id)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry?.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOut = async (entry: Entry) => {
    const token = cookies?.access_token;
    if (!token) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Update the status to "out"
    const updatedEntry = { ...entry, status: "out" };

    try {
      // Send PUT request to update the entry status
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}gard/update/${entry?._id}`,
        updatedEntry,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(updateData(1));

      toast({
        title: "Success",
        description: "Entry status updated to 'Out'.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Update state to reflect changes
      setEntries((prevEntries) =>
        prevEntries.map((e) => (e._id === entry?._id ? updatedEntry : e))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update entry status.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render a person card
  const renderPersonCard = (entry: Entry) => (
    <Box
      key={entry?._id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bg="white"
      className="relative p-4 mt-3"
    >
      {/* Left colored bar */}
      <Box className="absolute top-0 left-0 h-full w-2 bg-green-500"></Box>

      {/* Header */}
      <HStack
        justifyContent="space-between"
        flexWrap="wrap"
        align="start"
        mb={2}
        gap={4}
      >
        <VStack align="flex-start" spacing={1}>
          <Text fontSize="sm" fontWeight="bold">
            Date: {new Date(entry?.createdAt).toLocaleDateString()}
          </Text>
          <Text fontSize="sm" className="text-gray-500">
            Time: {new Date(entry?.createdAt).toLocaleTimeString()}
          </Text>
        </VStack>
        <VStack>
          <Badge
            colorScheme={entry?.status === "in" ? "green" : "red"}
            fontSize="sm"
          >
            Status: {entry?.status.toUpperCase()}
          </Badge>
          {entry?.status === "in" && (
            <Button
              size="sm"
              bgColor="white"
              _hover={{ bgColor: "orange.500" }}
              className="border border-orange-500 hover:text-white"
              onClick={() => handleOut(entry)}
            >
              Out
            </Button>
          )}
        </VStack>
      </HStack>

      {/* Divider */}
      <Divider my={2} />

      {/* Content */}
      <HStack
        justifyContent="space-between"
        flexWrap="wrap"
        align="start"
        gap={4}
        mb={2}
      >
        <VStack align="flex-start" spacing={2} w={{ base: "100%", md: "48%" }}>
          <Text fontSize="sm" fontWeight="bold">
            Name: <span className="font-normal">{entry?.name}</span>
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Address: <span className="font-normal">{entry?.address}</span>
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Phone: <span className="font-normal">{entry?.phone}</span>
          </Text>
        </VStack>
        <VStack
          align={{ base: "start", md: "end" }}
          spacing={2}
          w={{ base: "100%", md: "48%" }}
        >
          <Text fontSize="sm" fontWeight="bold">
            Whom To Meet:{" "}
            <span className="font-normal">{entry?.contact_persone}</span>
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Purpose: <span className="font-normal">{entry?.purpose}</span>
          </Text>
        </VStack>
      </HStack>

      {/* Divider */}
      <Divider my={2} />

      {/* Footer */}
      <HStack
        justifyContent="space-between"
        flexWrap="wrap"
        align="center"
        gap={4}
      >
        <HStack gap={2}>
          <Button
            size="sm"
            bgColor="white"
            _hover={{ bgColor: "blue.500" }}
            className="border border-blue-500 hover:text-white"
            onClick={() => handleEdit(entry)}
          >
            <MdEdit />
          </Button>
          <Button
            size="sm"
            bgColor="white"
            _hover={{ bgColor: "red.500" }}
            className="border border-red-500 hover:text-white"
            onClick={() => handleDelete(entry)}
          >
            <ImBin />
          </Button>
        </HStack>
        {entry?.status === "out" && (
          <Text fontSize="sm" className="text-gray-500">
            Exit Time: {new Date(entry?.updatedAt).toLocaleTimeString()}
          </Text>
        )}
        <FaPersonWalkingArrowRight className="text-orange-700 text-4xl" />
      </HStack>
    </Box>
  );

  // Render a vehicle card
  const renderVehicleCard = (entry: Entry) => (
    <Box
      key={entry?._id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bg="white"
      className="relative p-4 mt-3"
    >
      {/* Left colored bar */}
      <Box className="absolute top-0 left-0 h-full w-2 bg-blue-500"></Box>

      {/* Header */}
      <HStack
        justifyContent="space-between"
        flexWrap="wrap"
        align="start"
        gap={4}
        mb={2}
      >
        <VStack align="flex-start" spacing={1}>
          <Text fontSize="sm" fontWeight="bold">
            Date: {new Date(entry?.createdAt).toLocaleDateString()}
          </Text>
          <Text fontSize="sm" className="text-gray-500">
            Entry Time: {new Date(entry?.updatedAt).toLocaleTimeString()}
          </Text>
        </VStack>
        <VStack>
          <Badge
            colorScheme={entry?.status === "in" ? "green" : "red"}
            fontSize="sm"
          >
            Status: {entry?.status.toUpperCase()}
          </Badge>
          {entry?.status === "in" && (
            <Button
              size="sm"
              bgColor="white"
              _hover={{ bgColor: "orange.500" }}
              className="border border-orange-500 hover:text-white"
              onClick={() => handleOut(entry)}
            >
              Out
            </Button>
          )}
        </VStack>
      </HStack>

      {/* Divider */}
      <Divider my={2} />

      {/* Content */}
      <HStack
        justifyContent="space-between"
        flexWrap="wrap"
        align="start"
        gap={4}
        mb={2}
      >
        <VStack align="flex-start" spacing={2} w={{ base: "100%", md: "48%" }}>
          <Text fontSize="sm" fontWeight="bold">
            Name: <span className="font-normal">{entry?.name}</span>
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Address: <span className="font-normal">{entry?.address}</span>
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Phone: <span className="font-normal">{entry?.phone}</span>
          </Text>
        </VStack>
        <VStack   align={{ base: "start", md: "end" }} spacing={2} w={{ base: "100%", md: "48%" }}>
          <Text fontSize="sm" fontWeight="bold">
            Vehicle Details:{" "}
            <span className="font-normal">{entry?.details}</span>
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Material: <span className="font-normal">{entry?.material}</span>
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Comment: <span className="font-normal">{entry?.comment}</span>
          </Text>
        </VStack>
      </HStack>

      {/* Divider */}
      <Divider my={2} />

      {/* Footer */}
      <HStack
        justifyContent="space-between"
        flexWrap="wrap"
        align="center"
        gap={4}
      >
        <HStack gap={2}>
          <Button
            size="sm"
            bgColor="white"
            _hover={{ bgColor: "blue.500" }}
            className="border border-blue-500 hover:text-white"
            onClick={() => handleEdit(entry)}
          >
            <MdEdit />
          </Button>
          <Button
            size="sm"
            bgColor="white"
            _hover={{ bgColor: "red.500" }}
            className="border border-red-500 hover:text-white"
            onClick={() => handleDelete(entry)}
          >
            <ImBin />
          </Button>
        </HStack>
        {entry?.status === "out" && (
          <Text fontSize="sm" className="text-gray-500">
            Exit Time: {new Date(entry?.updatedAt).toLocaleTimeString()}
          </Text>
        )}
        <TbTruckDelivery className="text-orange-700 text-4xl" />
      </HStack>
    </Box>
  );

  return (
    <ChakraProvider>
      <Box className="p-6  max-h-screen  md:ml-80 sm:ml-0   overflow-x-hidden overflow-y-hidden mt-10 lg:mt-0">
        <HStack spacing={4} mb={4}>
          <Select
            placeholder="Filter by status"
            value={inOutFilter}
            onChange={(e) =>
              setInOutFilter(e.target.value as "all" | "in" | "out")
            }
          >
            <option value="all">All</option>
            <option value="in">In</option>
            <option value="out">Out</option>
          </Select>

          <Select
            placeholder="Filter by type"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "all" | "person" | "vehicle")
            }
          >
            <option value="all">All</option>
            <option value="person">Person</option>
            <option value="vehicle">Vehicle</option>
          </Select>

          <Input
            type="date"
            placeholder="Filter by date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </HStack>

        <Box className="relative max-h-[45rem]">
          <Text className="text-xl font-bold mb-4"> Entries</Text>
          <Box className="max-h-[45rem] overflow-y-scroll">
            {filteredEntries.map((entry) =>
              entry?.type === "person"
                ? renderPersonCard(entry)
                : renderVehicleCard(entry)
            )}
          </Box>
        </Box>
        <Pagination page={pages} setPage={setPages} length={entries.length} />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingEntry && (
              <UpdateEntry
                entry={editingEntry}
                onUpdate={handleUpdate}
                onCancel={onClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default Entries;
