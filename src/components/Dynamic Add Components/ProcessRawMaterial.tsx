import { FormControl, FormLabel, Input, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";

interface ProcessRawMaterialProps {
  inputs: any[];
  products: any[];
  productOptions: any[];
  setInputs: (inputs: any) => void;
}

const ProcessRawMaterial: React.FC<ProcessRawMaterialProps> = ({
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

  const fetchSuppliersHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/suppliers",
        {
          method: "GET",
          headers: {
            AuThorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setSuppliers(data.agents);
    } catch (err: any) {
      toast.error(err?.message || "SomeThing went wrong");
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
    "Description",
    "Estimated Quantity",
    "Used Quantity",
    "UOM",
    "Category",
    "Assembly Phase",
    "Supplier",
    "Comments",
    "Unit Cost",
    "Total Part Cost",

  ]

  return (
    <div>
      <FormControl isRequired>

        <FormLabel fontWeight="bold" display="flex" alignItems="center">
          <Text fontWeight="bold" fontSize="lg">Raw Materials</Text>
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
          <div style={{ overflowY: 'auto' }}>
            <Table variant="striped" colorScheme="gray" size="sm" mt={4} sx={{ tableLayout: "auto" }}>
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
                        fontSize="sm"
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
                    <Td>
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

                    <Td>
                      <FormControl>
                        <Input
                          border="1px"
                          borderColor="#a9a9a9"
                          onChange={(e) => onChangeHandler("description", e.target.value, ind)}
                          type="text"
                          name="description"
                          value={input.description}
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl isRequired>
                        <Input
                          isDisabled={true}
                          border="1px"
                          borderColor="#a9a9a9"
                          type="number"
                          name="estimated_quantity"
                          value={input.estimated_quantity}
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl isRequired>
                        <Input
                          border="1px"
                          borderColor="#a9a9a9"
                          onChange={(e) => onChangeHandler("used_quantity", e.target.value, ind)}
                          type="number"
                          name="used_quantity"
                          value={input.used_quantity}
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl isRequired>
                        <Input
                          isDisabled={true}
                          border="1px"
                          borderColor="#a9a9a9"
                          type="text"
                          name="uom"
                          value={input.uom}
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl isRequired>
                        <Input
                          isDisabled={true}
                          border="1px"
                          borderColor="#a9a9a9"
                          type="text"
                          name="category"
                          value={input.category}
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl>
                        <Select
                          isDisabled
                          className="rounded mt-2 border border-[#a9a9a9]"
                          options={assemblyPhaseOptions}
                          placeholder="Select"
                          value={input.assembly_phase}
                          name="assembly_phase"
                          onChange={(e) => onChangeHandler("assembly_phase", e, ind)}
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl>
                        <Select
                          isDisabled
                          className="rounded mt-2 border border-[#a9a9a9]"
                          options={suppliersOptionsList}
                          placeholder="Select"
                          value={input.supplier}
                          name="supplier"
                          onChange={(e) => onChangeHandler("supplier", e, ind)}
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl>
                        <Input
                          isDisabled
                          border="1px"
                          borderColor="#a9a9a9"
                          onChange={(e) => onChangeHandler("comments", e.target.value, ind)}
                          type="text"
                          name="comments"
                          value={input.comments}
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl isRequired>
                        <Input
                          isDisabled={true}
                          border="1px"
                          borderColor="#a9a9a9"
                          onChange={(e) => onChangeHandler("unit_cost", e.target.value, ind)}
                          type="number"
                          name="unit_cost"
                          value={input.unit_cost}
                        />
                      </FormControl>
                    </Td>

                    <Td>
                      <FormControl>
                        <Input
                          isDisabled={true}
                          border="1px"
                          borderColor="#a9a9a9"
                          onChange={(e) => onChangeHandler("total_part_cost", e.target.value, ind)}
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
          </div>
        )}
      </FormControl>
    </div>
  
  

  );
};

export default ProcessRawMaterial;