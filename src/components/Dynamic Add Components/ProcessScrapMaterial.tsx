import {
  FormControl,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";

interface ProcessScrapMaterialProps {
  inputs: any[];
  products: any[];
  productOptions: any[];
  setInputs: (inputs: any) => void;
}

const ProcessScrapMaterial: React.FC<ProcessScrapMaterialProps> = ({
  inputs,
  setInputs,
  products,
  productOptions,
}) => {
  const [cookies] = useCookies();
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isTableVisible, setIsTableVisible] = useState(true); 

  const onChangeHandler = (name: string, value: string, ind: number) => {
    const inputsArr: any = [...inputs];
    inputsArr[ind][name] = value;

    if (name === "produced_quantity") {
      const unit_cost = inputsArr[ind]["unit_cost"];
      if (unit_cost) {
        inputsArr[ind]["total_part_cost"] = +unit_cost * +value;
      }
    } else if (name === "item_name") {
      const item_id = inputsArr[ind]["item_name"].value;
      const product = products.filter((prd: any) => prd._id === item_id)[0];
      inputsArr[ind]["uom"] = product.uom;
      inputsArr[ind]["unit_cost"] = product.price;
    }

    setInputs(inputsArr);
  };

  useEffect(() => {
    let prods = [];
    prods = inputs?.map((material: any) => ({
      value: material.item_id,
      label: material.item_name,
    }));
    setSelectedProducts(prods);
  }, [inputs]);

  const headings = [
    "Product Name",
    "Description",
    "Estimated Quantity",
    "Produced Quantity",
    "UOM",
    "Unit Cost",
    "Total Part Cost",
  ];

  return (
    <div className="mt-4">
      <FormLabel fontWeight="bold" display="flex" alignItems="center">
        <Text fontWeight="bold" fontSize="lg">
          Scrap Materials
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
      <div className="overflow-x-auto mt-4">
        <Table
          variant="striped"
          colorScheme="gray"
          size="sm"
          className="min-w-full"
        >
          {/* Table Header Row */}
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

          <Tbody>
            {inputs &&
              inputs.map((input, ind) => (
                <Tr key={ind}>
                  {/* Product Name */}
                  <Td>
                    <FormControl isRequired>
                      <Select
                        isDisabled
                        required
                        className="rounded mt-2 border border-[#a9a9a9]"
                        options={productOptions}
                        placeholder="Select"
                        value={selectedProducts[ind]?.label}
                        name="item_name"
                        onChange={(d) => {
                          onChangeHandler("item_name", d, ind);
                        }}
                      />
                    </FormControl>
                  </Td>

                  {/* Description */}
                  <Td>
                    <FormControl>
                      <Input
                        isDisabled
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) => {
                          onChangeHandler(e.target.name, e.target.value, ind);
                        }}
                        type="text"
                        name="description"
                        value={input.description}
                      />
                    </FormControl>
                  </Td>

                  {/* Estimated Quantity */}
                  <Td>
                    <FormControl>
                      <Input
                        isDisabled
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) => {
                          onChangeHandler(e.target.name, e.target.value, ind);
                        }}
                        type="number"
                        name="estimated_quantity"
                        value={input.estimated_quantity}
                      />
                    </FormControl>
                  </Td>

                  {/* Produced Quantity */}
                  <Td>
                    <FormControl>
                      <Input
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) => {
                          onChangeHandler(e.target.name, e.target.value, ind);
                        }}
                        type="number"
                        name="produced_quantity"
                        value={input.produced_quantity}
                      />
                    </FormControl>
                  </Td>

                  {/* UOM */}
                  <Td>
                    <FormControl>
                      <Input
                        isDisabled
                        border="1px"
                        borderColor="#a9a9a9"
                        type="text"
                        name="uom"
                        value={input.uom}
                      />
                    </FormControl>
                  </Td>

                  {/* Unit Cost */}
                  <Td>
                    <FormControl>
                      <Input
                        isDisabled
                        border="1px"
                        borderColor="#a9a9a9"
                        onChange={(e) => {
                          onChangeHandler(e.target.name, e.target.value, ind);
                        }}
                        type="number"
                        name="unit_cost"
                        value={input.unit_cost}
                      />
                    </FormControl>
                  </Td>

                  {/* Total Part Cost */}
                  <Td>
                    <FormControl>
                      <Input
                        isDisabled
                        border="1px"
                        borderColor="#a9a9a9"
                        type="number"
                        name="total_part_cost"
                        value={input.total_part_cost}
                        className="rounded px-2 py-[6px] w-[300px] border-[1px] border-[#a9a9a9] disabled:cursor-not-allowed disabled:bg-white"
                      />
                    </FormControl>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </div>
       )}
    </div>
  );
};

export default ProcessScrapMaterial;