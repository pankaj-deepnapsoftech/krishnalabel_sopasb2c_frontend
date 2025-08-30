import {Box,  Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosRemoveCircleOutline, IoMdAddCircleOutline } from "react-icons/io";

interface ProcessProps {
  inputs: any[];
  setInputs: (input: any) => void;
}

const Process: React.FC<ProcessProps> = ({ inputs, setInputs }) => {
  // const [inputs, setInputs] = useState<string[]>([""]);

  const addInputHandler = () => {
    setInputs((prev: any[]) => [...prev, ""]);
  };


  const deleteInputHandler = (ind: number) => {
    const inputsArr = [...inputs];
    inputsArr.splice(ind, 1);
    setInputs(inputsArr);
  };

  const onChangeHandler = (process: string, ind: number) => {
    const inputsArr = [...inputs];
    inputsArr[ind] = process;
    setInputs(inputsArr);
  };

  return (
    <div>
      <FormLabel fontWeight="bold">Processes</FormLabel>
      <div className="grid grid-cols-4 gap-4 items-center">
        {inputs.map((input, index) => (
          <Box
            key={index}          
            border="1px"
            className="bg-gray-50"
            borderColor="#e2e8f0"
            borderRadius="8px"
            padding="4"
            boxShadow="md"
            backgroundColor="#f9fafb"
          >
            <FormControl isRequired>
              <FormLabel htmlFor={`process-${index}`} fontWeight="bold">
                Process {index + 1}
              </FormLabel>
              <Input
                id={`process-${index}`}
                border="1px"
                borderColor="#a9a9a9"
                onChange={(e) => onChangeHandler(e.target.value, index)}
                type="text"
                name="process"
                backgroundColor={"white"}
                value={input}
                placeholder={`Enter Process ${index + 1}`}
              />
            </FormControl>
          </Box>
        ))}
      </div>
      <div className="text-end mt-4">
        {inputs.length > 1 && (
          <Button
            onClick={() => deleteInputHandler(inputs.length - 1)}
            leftIcon={<IoIosRemoveCircleOutline />}
            variant="outline"
            color={"#ef4444"}
            borderColor={"#ef4444"}
            backgroundColor={"#ffffff"}
            _hover={{ backgroundColor: "#ef4444", color: "#ffffff" }}
            className="mr-3"
          >
            Remove
          </Button>
        )}
        <Button
          onClick={addInputHandler}
          leftIcon={<IoMdAddCircleOutline />}
          variant="outline"
          color={"#16a34a"}
          borderColor={"#16a34a"}
          backgroundColor={"#ffffff"}
          _hover={{ backgroundColor: "#16a34a", color: "#ffffff" }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default Process;