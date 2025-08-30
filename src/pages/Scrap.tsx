import {
  Select,
  Button
} from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ScrapTable from "../components/Table/ScrapTable";
import { toast } from "react-toastify";

const Scrap: React.FC = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingScraps, setIsLoadingScraps] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string | undefined>();

  const fetchScrapHandler = async ()=>{
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'scrap/all', {
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if(!data.success){
        throw new Error(data.message);
      }
      setData(data.scraps);
      setFilteredData(data.scraps);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  }

  useEffect(()=>{
    fetchScrapHandler();
  }, [])

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = data.filter(
      (scrap: any) =>
        scrap.bom.bom_name?.toLowerCase()?.includes(searchTxt) ||
        scrap.item.name?.toLowerCase()?.includes(searchTxt) ||
        scrap.produced_quantity.toString().toLowerCase().includes(searchTxt) ||
        scrap.estimated_quantity.toString().toLowerCase().includes(searchTxt) ||
        (scrap?.createdAt &&
          new Date(scrap?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (scrap?.updatedAt &&
          new Date(scrap?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  return (
    <div>

      <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1 pb-4">
        Scrap Management
      </div>

      {/* Employees Page */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="max-[800px]:w-full">
          <textarea
            className="rounded-[10px] w-full px-3 py-2 text-sm border border-[#0d9488] resize-none focus:outline-[#14b8a6] hover:outline-[#14b8a6]"
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>

        {/* Refresh Button and Page Size Selector */}
        <div className="flex w-full md:w-auto flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button
            fontSize="14px"
            px="12px"
            py="6px"
            w="full"
            // sm={{ w: "auto" }}
            onClick={fetchScrapHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#319795"
            borderColor="#319795"
            variant="outline"
          >
            Refresh
          </Button>

          <Select
            width="full"
            size="md"
            rounded="5px"
            variant="outline"
            borderColor="#319795"
            marginBottom="10px"
            marginTop="10px"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={100000}>All</option>
          </Select>
        </div>
      </div>


      <div>
        <ScrapTable scraps={filteredData} isLoadingScraps={isLoadingScraps} openScrapDetailsDrawerHandler={()=>{}} />
      </div>
    </div>
  );
};

export default Scrap;
