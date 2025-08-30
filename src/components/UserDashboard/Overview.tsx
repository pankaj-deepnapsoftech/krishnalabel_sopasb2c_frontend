//@ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios"; // Axios for API calls
import { Line } from "react-chartjs-2";
import { TbProgressCheck } from "react-icons/tb";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Grid, Text } from "@chakra-ui/react";
import { useCookies } from "react-cookie";
import { ResponsiveContainer } from "recharts";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define types for purchases
interface Purchase {
  createdAt: string;
  product_name: string;
}

interface GraphData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
  }[];
}

const Overview = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalPurchases, setTotalPurchases] = useState<number>(0);
  const [graphData, setGraphData] = useState<GraphData>({
    labels: [],
    datasets: [],
  });
  const [cookies] = useCookies(["access_token"]);
  const { role } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (role === "Security Guard") {
      navigate("/entries");
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = cookies.access_token;

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get<{ data: Purchase[] }>(
          `${process.env.REACT_APP_BACKEND_URL}purchase/customer-get`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const filteredPurchases = response.data.data.filter(
          (purchase) => purchase?.payment_verify === true
        );

        setPurchases(filteredPurchases);

        const monthlyData = Array(12).fill(0);
        filteredPurchases.forEach((purchase) => {
          const purchaseDate = new Date(purchase.createdAt);
          const month = purchaseDate.getMonth();
          monthlyData[month] += 1;
        });

        setGraphData({
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Purchases",
              data: monthlyData,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        });

        // Set the total purchases count
        setTotalPurchases(filteredPurchases.length);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    fetchData();
  }, [cookies.access_token]);

  const productionStatus = {
    title: "Production Status",
    status: "In Progress",
    progress: 75,
  };

  return (
    <div className="md:ml-80 sm:ml-0 overflow-x-hidden mt-10 lg:mt-0 ">
      <h3 className="text-2xl mb-6 text-blue-950 font-bold inline-block border-b-2 border-dashed border-black">
        Overview
      </h3>

      <div className="mb-8 w-full max-w-4xl sm:max-w-full mx-auto">
        <div className="h-full ">
         
             <ResponsiveContainer>
             <Line
               data={graphData}
               options={{
                 responsive: true,
                 plugins: {
                   legend: { position: "top" },
                   title: { display: true, text: "Purchases Over the Year" },
                 },
               }}
             />
           </ResponsiveContainer>
         
         
        </div>
      </div>
      <hr className="bg-gray-800 border" />

      <Box
        bg="green.200"
        p={4}
        color="black"
        borderRadius="md"
        boxShadow="sm"
        width="100%"
        textAlign="center"
      >
        <Text
          fontSize="lg"
          fontWeight="bold"
          alignContent="center"
          display="flex"
          justifyContent="center"
          gap={2}
        >
          No. of Purchases:{" "}
          <Text className="text-red-900">{totalPurchases}</Text>
        </Text>
      </Box>
    </div>
  );
};

export default Overview;
