import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Textarea,
} from "@chakra-ui/react";

interface Entry {
  _id: string;
  type: "person" | "vehicle";
  name: string;
  comment?: string;
  details?: string;
  phone: string;
  address: string;
  purpose?: string;
  contact_persone?: string;
  material?: string;
  status: "in" | "out";
  createdAt: string;
}

interface UpdateEntryProps {
  entry: Entry;
  onUpdate: (updatedEntry: Entry) => void;
  onCancel: () => void;
}

const UpdateEntry: React.FC<UpdateEntryProps> = ({
  entry,
  onUpdate,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Entry>({
    ...entry,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (field: keyof Entry, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData); // Pass the updated data to the parent component
  };

  return (
    <ChakraProvider>
      <Box
        as="form"
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <FormControl mb="4" isRequired>
          <FormLabel>Type</FormLabel>
          <Select
            value={formData.type}
            onChange={(e) =>
              handleChange("type", e.target.value as "person" | "vehicle")
            }
            bg="white"
            borderColor="gray.300"
          >
            <option value="person">Person</option>
            <option value="vehicle">Vehicle</option>
          </Select>
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Name</FormLabel>
          <Input
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="material description"
            bg="white"
            borderColor="gray.300"
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Phone Number</FormLabel>
          <Input
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
            bg="white"
            borderColor="gray.300"
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel>Address</FormLabel>
          <Textarea
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Enter address"
            bg="white"
            borderColor="gray.300"
          />
        </FormControl>

        {formData.type === "vehicle" && (
          <>
            <FormControl mb="4" isRequired>
              <FormLabel>Vehicle Details</FormLabel>
              <Input
                value={formData.details || ""}
                onChange={(e) => handleChange("details", e.target.value)}
                placeholder="Enter vehicle details"
                bg="white"
                borderColor="gray.300"
              />
            </FormControl>

            <FormControl mb="4" isRequired>
              <FormLabel>Material</FormLabel>
              <Select
                value={formData.material || ""}
                onChange={(e) => handleChange("material", e.target.value)}
                bg="white"
                borderColor="gray.300"
              >
                <option value="">Select Material</option>
                <option value="Raw Material">Raw Material</option>
                <option value="Finished Goods">Finished Goods</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Comment</FormLabel>
              <Input
                value={formData.comment || ""}
                onChange={(e) => handleChange("comment", e.target.value)}
                placeholder="material description"
                bg="white"
                borderColor="gray.300"
              />
            </FormControl>
          </>
        )}

        {formData.type === "person" && (
          <FormControl mb="4" isRequired>
            <FormLabel>Contact Person</FormLabel>
            <Input
              value={formData.contact_persone || ""}
              onChange={(e) => handleChange("contact_persone", e.target.value)}
              placeholder="Enter name of person/department to meet"
              bg="white"
              borderColor="gray.300"
            />
          </FormControl>
        )}

      

        {formData.type === "person" && (
          <FormControl mb="4" isRequired>
            <FormLabel>Purpose of Visit</FormLabel>
            <Input
              value={formData.purpose || ""}
              onChange={(e) => handleChange("purpose", e.target.value)}
              placeholder="Enter purpose of visit"
              bg="white"
              borderColor="gray.300"
            />
          </FormControl>
        )}

        <FormControl mb="4" isRequired>
          <FormLabel>Status</FormLabel>
          <Select
            value={formData.status}
            onChange={(e) =>
              handleChange("status", e.target.value as "in" | "out")
            }
            bg="white"
            borderColor="gray.300"
          >
            <option value="in">In</option>
            <option value="out">Out</option>
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="teal" className="w-full" size="lg" disabled={isSubmitting}>
          Update Entry
        </Button>
        <Button
          onClick={onCancel}
          mt="4"
          colorScheme="gray"
          className="w-full"
          size="lg"
        >
          Cancel
        </Button>
      </Box>
    </ChakraProvider>
  );
};

export default UpdateEntry;
