import React, { useEffect, useState } from "react";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";
import axios from "axios";
const SalesChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
      },
      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // Chỉnh lại thứ tự ngày
      },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/chart",
          {
            withCredentials: true,
          }
        );
        const data = response.data;

        const series = Object.keys(data.commentCountsByRestaurant).map(
          (restaurantId) => {
            const commentStats = data.commentCountsByRestaurant[restaurantId];

            const dataPoints = Array.from({ length: 7 }, (_, index) => {
              return commentStats[index] || 0;
            });

            return {
              name: commentStats.name,
              data: dataPoints,
            };
          }
        );
        setChartData({
          ...chartData,
          series: series,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Comment statistics</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Statistics of comments for each restaurant in the last 7 days
        </CardSubtitle>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Chart
            type="area"
            width="100%"
            height="390"
            options={chartData.options}
            series={chartData.series}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default SalesChart;
