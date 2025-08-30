//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useCookies } from 'react-cookie';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesGraph: React.FC = () => {
  const [salesData, setSalesData] = useState<any>(null); // Store sales data
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    // Fetch sales data from backend
    const fetchSalesData = async () => {
      try {
        const token = cookies.access_token;

        if (!token) {
            throw new Error("Authentication token not found");
          }

          
        const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}purchase/sales-graph`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        setSalesData(response.data); // Set the sales data
      } catch (err) {
        setError('Failed to fetch sales data');
        console.error("graph",err);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchSalesData();
  }, []);

  // If the data is still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If there's an error fetching the data
  if (error) {
    return <div>{error}</div>;
  }

  // Prepare the data for the chart
  const chartData = {
    labels: salesData.months, // Labels for the X-axis (Months)
    datasets: [
      {
        label: 'Sales (Including GST)', // Label for the line
        data: salesData.sales, // Data for the Y-axis (Sales data)
        borderColor: '#FF7F50', // Line color (orange)
        backgroundColor: 'rgba(255, 127, 80, 0.2)', // Area color (lighter orange)
        fill: true, // Fill the area under the line
        tension: 0.4, // Smoothness of the line
        pointRadius: 5, // Point size on the line
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sales Data (Monthly)',
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `₹${tooltipItem.raw.toFixed(2)}`; // Format the tooltip to show currency
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start Y-axis at 0
        ticks: {
          callback: (value: number) => `₹${value}`, // Format the Y-axis to show currency
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default SalesGraph;
