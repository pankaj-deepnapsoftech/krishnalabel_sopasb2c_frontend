import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  FormControl,
  FormLabel,
  Input,
  TableContainer,
  background,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoIosRemoveCircleOutline, IoMdAddCircleOutline } from "react-icons/io";
import Select from "react-select";
import { toast } from "react-toastify";

interface RawMaterialProps {
  inputs: any[];
  products: any[];
  productOptions: any[];
  setInputs: (inputs: any) => void;
}

const RawMaterial: React.FC<RawMaterialProps> = ({
  inputs,
  setInputs,
  products,
  productOptions,
}) => {
  const [cookies] = useCookies();
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState<boolean>(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [suppliersOptionsList, setSuppliersOptionsList] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any[]>([]);
  const [isTableVisible, setIsTableVisible] = useState(true);

  const assemblyPhaseOptions = [
    { value: "not started", label: "Not Started" },
    { value: "in production", label: "In Production" },
    { value: "in review", label: "In Review" },
    { value: "complete", label: "Complete" },
  ];

  const onChangeHandler = (name: string, value: string, ind: number) => {
    const inputsArr: any = [...inputs];
    inputsArr[ind][name] = value;

    if (name === "quantity") {
      const unit_cost = inputsArr[ind]["unit_cost"];
      if (unit_cost) {
        inputsArr[ind]["total_part_cost"] = +unit_cost * +value;
      }
    } else if (name === "item_name") {
      const item_id = inputsArr[ind]["item_name"].value;
      const product = products.filter((prd: any) => prd._id === item_id)[0];
      inputsArr[ind]["uom"] = product.uom;
      inputsArr[ind]["unit_cost"] = product.price;
      inputsArr[ind]["category"] = product.category;
    }

    setInputs(inputsArr);
  };

  const addInputHandler = () => {
    setInputs((prev: any) => [
      ...prev,
      {
        item_id: "",
        item_name: "",
        quantity: "",
        uom: "",
        category: "",
        assembly_phase: "",
        supplier: "",
        comments: "",
        unit_cost: "",
        total_part_cost: "",
      },
    ]);
  };

  const deleteInputHandler = (ind: number) => {
    const inputsArr = [...inputs];
    inputsArr.splice(ind, 1);
    setInputs(inputsArr);
  };

  const fetchSuppliersHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/suppliers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setSuppliers(data.agents);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchSuppliersHandler();
  }, []);

  useEffect(() => {
    const supplierOptions = suppliers.map((supp) => ({
      value: supp._id,
      label: supp.name,
    }));
    setSuppliersOptionsList(supplierOptions);
  }, [suppliers]);

  useEffect(() => {
    let prods = [];
    prods = inputs.map((material: any) => ({
      value: material.item_id,
      label: material.item_name,
    }));
    setSelectedProducts(prods);
  }, [inputs]);

  const headings = [
    "Product Name",
    "Quantity",
    "UOM",
    "Category",
    "Comments",
    "Unit Cost",
    "Total Part Cost",
  ];

  return (
    <div>
      <FormControl isRequired>
        <FormLabel fontWeight="bold" display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg">
            Raw Materials
          </Text>
          <span
            className="cursor-pointer ml-5"
            style={{ cursor: "pointer", marginLeft: "10px" }}
            onClick={() => setIsTableVisible(!isTableVisible)}
          >
            {isTableVisible ? (
              <FaChevronUp size={18} color="#111827 " />
            ) : (
              <FaChevronDown size={18} color="#111827 " />
            )}
          </span>
        </FormLabel>

        {isTableVisible && (
          <Table
            variant="striped"
            colorScheme="gray"
            size="sm"
            mt={4}
            sx={{ tableLayout: "auto" }}
          >
            <Thead>
              <Tr>
                {headings.map((heading, index) => (
                  <th key={index}>
                    <Text
                      bg="teal.500"
                      color="white"
                      fontWeight="bold"
                      textTransform="uppercase"
                      textAlign="center"
                      whiteSpace="nowrap"
                      fontSize={"sm"}
                      
                      p={4}
                    >
                      {heading}
                    </Text>
                  </th>
                ))}
              </Tr>
            </Thead>
            <Tbody className="bg-gray-100">
              {inputs.map((input, ind) => (
                <Tr key={ind} bg={ind % 2 === 0 ? "gray.100" : "white"}>
                  <Td width="200px">
                    <FormControl isRequired>
                      <Select
                        required
                        className="outline-none border-none"
                        options={productOptions}
                        placeholder="Select"
                        value={input.item_name}
                        name="item_name"
                        onChange={(e) => onChangeHandler("item_name", e, ind)}
                      />
                    </FormControl>
                  </Td>

                  <Td width="150px">
                    <FormControl isRequired>
                      <Input
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) =>
                          onChangeHandler("quantity", e.target.value, ind)
                        }
                        type="number"
                        name="quantity"
                        value={input.quantity}
                        backgroundColor="white"
                      />
                    </FormControl>
                  </Td>

                  <Td width="150px">
                    <FormControl isRequired>
                      <Input
                        isDisabled={true}
                        border="1px"
                        borderColor="#a9a9a9"
                        type="text"
                        name="uom"
                        value={input.uom}
                         backgroundColor="white"
                      />
                    </FormControl>
                  </Td>

                  <Td width="150px">
                    <FormControl isRequired>
                      <Input
                        isDisabled={true}
                        border="1px"
                        borderColor="#a9a9a9"
                        type="text"
                        name="category"
                        value={input.category}
                         backgroundColor="white"
                      />
                    </FormControl>
                  </Td>

                  <Td width="200px">
                    <FormControl>
                      <Input
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) =>
                          onChangeHandler("comments", e.target.value, ind)
                        }
                        type="text"
                        name="comments"
                        value={input.comments}
                       backgroundColor="white"
                      />
                    </FormControl>
                  </Td>

                  <Td width="150px">
                    <FormControl isRequired>
                      <Input
                        isDisabled={true}
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) =>
                          onChangeHandler("unit_cost", e.target.value, ind)
                        }
                        type="number"
                        name="unit_cost"
                        value={input.unit_cost}
                         backgroundColor="white"
                      />
                    </FormControl>
                  </Td>

                  <Td width="150px">
                    <FormControl>
                      <Input
                        isDisabled={true}
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) =>
                          onChangeHandler(
                            "total_part_cost",
                            e.target.value,
                            ind
                          )
                        }
                        type="number"
                        name="total_part_cost"
                        value={input.total_part_cost}
                      />
                    </FormControl>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </FormControl>

      <div className="text-end my-3">
        {inputs.length > 1 && (
          <Button
            onClick={() => deleteInputHandler(inputs.length - 1)}
            leftIcon={<IoIosRemoveCircleOutline />}
            variant="outline"
            className="mr-2 border"
            color={"#ef4444"}
            borderColor={"#ef4444"}
            backgroundColor={"#ffffff"}
            _hover={{ backgroundColor: "#ef4444", color: "#ffffff" }}
          >
            Remove
          </Button>
        )}
        <Button
          onClick={addInputHandler}
          leftIcon={<IoMdAddCircleOutline />}
          variant="outline"
          className="border "
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

export default RawMaterial;
