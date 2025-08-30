//@ts-nocheck
import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  Badge,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Select from "react-select"; // Import react-select
import { socket } from '../socket';
const Assign = ({ empData, saleData, onClose }) => {
  const tasks = saleData?.assinedto;

  const [formData, setFormData] = useState({
    sale_id: saleData?._id,
    assined_to: "",
    assined_process: "",
    assinedby_comment: "",
  });

  const [isEditMode, setIsEditMode] = useState(false); // Track if it's an edit operation
  const [editTaskId, setEditTaskId] = useState(null); // Track the task being edited


  const [cookies] = useCookies(["access_token"]);
  const toast = useToast();
  const token = cookies?.access_token;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle task creation or update
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // If it's edit mode, send update request
      if (isEditMode && editTaskId) {
        const response = await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}assined/update/${editTaskId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast({
          title: "Task Updated",
          description: "The task has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Reset form after update
        socket.emit('notificationdatachange', true);
        setIsEditMode(false);
        setEditTaskId(null);
      } else {
        // Otherwise, create a new task
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}assined/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast({
          title: "Task Created",
          description: "The task has been successfully assigned.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      // Clear form
      setFormData({
        sale_id: saleData?._id,
        assined_to: "",
        assined_process: "",
        assinedby_comment: "",
      });
      socket.emit('notificationdatachange', true);
      onClose();
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = async(id, taskData) => {
    setIsEditMode(true);
    setEditTaskId(id);

    // Pre-fill form with the task data
    setFormData({
      sale_id: saleData?._id,
      assined_to: taskData?.assinedto[0]?._id || "",
      assined_process: taskData?.assined_process || "",
      assinedby_comment: taskData?.assinedby_comment || "",
    });

  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}assined/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Task Deleted",
        description: "The task has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      socket.emit('notificationdatachange', true);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to remove assigned task.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const colorChange = (color: any) => {
    if (color === "Pending" || color === "UnderProcessing") {
      return "orange";
    } else if (color === "Design Rejected") {
      return "red";
    } else {
      return "green";
    }
  };

  // Convert empData into the format needed for react-select
  const employeeOptions = empData?.map((emp) => ({
    value: emp?._id,
    label: `${emp?.first_name} - ${emp?.role?.role}`,
  }));

  return (
    <Box p={2}>
      {/* Task List */}
      {tasks?.length > 0 && (
        <Box mb={6} className="max-h-[10rem] overflow-y-scroll">
          <Text fontWeight="bold" fontSize="lg" color="teal.500" mb={4}>
            Assigned Tasks
          </Text>

          {tasks.map((task) => (
            <Box
              key={task?._id}
              p={4}
              mb={4}
              borderWidth="1px"
              borderRadius="lg"
              shadow="md"
              className="bg-orange-50 border border-orange-500"
            >
              <VStack align="start" spacing={2}>
                <Text>
                  <strong>Date:</strong>{" "}
                  {new Date(task?.createdAt).toLocaleDateString()}
                </Text>
                <Text>
                  <strong>Task:</strong> {task?.assined_process}
                </Text>
                <Text>
                  <strong>Assigned To:</strong>{" "}
                  {task?.assinedto[0]?.first_name} -{" "}
                  {task?.assinedto[0]?.role[0]?.role || ""}
                </Text>
                <Text>
                  <strong>Status:</strong>{" "}
                  <Badge colorScheme={colorChange(task?.isCompleted)}>
                    {task?.isCompleted}
                  </Badge>
                </Text>
                <HStack>
                  <Button
                    bgColor="blue.500"
                    _hover="blue.400"
                    onClick={() => handleEdit(task._id, task)}
                  >
                    <FaEdit className="text-white" />
                  </Button>
                  <Button
                    bgColor="red.500"
                    _hover="red.400"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete?")) {
                        handleDelete(task?._id);
                      }
                    }}
                  >
                    <MdDelete className="text-white" />
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </Box>
      )}

      {/* Assign/Update Form */}
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        shadow="md"
        className="bg-blue-50 border border-blue-500"
      >
        <Text fontWeight="bold" fontSize="lg" color="teal.500" mb={4}>
          {isEditMode ? "Update Task" : "Assign Task"}
        </Text>
        <FormControl mb={4} isRequired>
          <FormLabel>Select Employee</FormLabel>
          <Select
            name="assined_to"
            placeholder="Select an employee"
            value={employeeOptions?.find((emp) => emp.value === formData.assined_to)} // Set selected value
            onChange={(selectedOption) =>
              setFormData((prevData) => ({
                ...prevData,
                assined_to: selectedOption?.value,
              }))
            }
            options={employeeOptions} // Options from empData
            isSearchable={true} // Make it searchable
          />
        </FormControl>
        <FormControl mb={4} isRequired>
          <FormLabel>Define Process</FormLabel>
          <Input
            name="assined_process"
            placeholder="Enter process name"
            value={formData.assined_process}
            onChange={handleChange}
            bgColor="white"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Remarks</FormLabel>
          <Textarea
            name="assinedby_comment"
            placeholder="Enter further details (if any)"
            value={formData.assinedby_comment}
            onChange={handleChange}
            bgColor="white"
          />
        </FormControl>
        <Button
          colorScheme="blue"
          onClick={handleFormSubmit}
          className="w-full"
          disabled={isSubmitting}
        >
          {isEditMode ? "Update" : "Assign"}
        </Button>
      </Box>
    </Box>
  );
};

export default Assign;
