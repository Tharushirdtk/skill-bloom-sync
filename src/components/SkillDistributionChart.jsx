import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const SkillDistributionChart = ({ data = [], type = "pie", title }) => {
  const [chartData, setChartData] = useState([]);

  // Colors harmonious
  const COLORS = [
    "#6EC6FF", // Soft Blue
    "#81C784", // Soft Green
    "#FFB74D", // Soft Orange
    "#FFD54F", // Soft Yellow
    "#E57373", // Soft Red
    "#4DD0E1", // Soft Teal
    "#F06292", // Soft Pink
    "#A1887F", // Soft Brown
  ];

  // Transform incoming data safely
  useEffect(() => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      setChartData([]);
      return;
    }

    if (Array.isArray(data)) {
      // Already has correct keys
      if ("name" in data[0] && "value" in data[0]) {
        setChartData(data);
      }
      // Map { level, count }
      else if ("level" in data[0] && "count" in data[0]) {
        setChartData(data.map((d) => ({ name: d.level, value: d.count })));
      }
      // Unknown shape, try guessing
      else {
        const mapped = data.map((d, i) => ({
          name: d.name || d.label || `Item ${i + 1}`,
          value: d.value || d.count || 0,
        }));
        setChartData(mapped);
      }
    }
    // If it's an object { beginner: 10, intermediate: 5 }
    else if (typeof data === "object") {
      const transformed = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: value ?? 0,
      }));
      setChartData(transformed);
    }
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = chartData.reduce((a, b) => a + b.value, 0);
      return (
        <Box
          sx={{
            backgroundColor: "white",
            p: 2,
            border: "1px solid hsl(262 20% 91%)",
            borderRadius: 2,
            boxShadow: "0 4px 20px -4px hsl(262 47% 45% / 0.15)",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
            {type === "pie" ? payload[0].name : label}
          </Typography>
          <Typography variant="body2" sx={{ color: "primary.main" }}>
            Count: {payload[0].value}
          </Typography>
          {type === "pie" && total > 0 && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {((payload[0].value / total) * 100).toFixed(1)}%
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(135deg, hsl(262 47% 45% / 0.02), hsl(262 47% 55% / 0.05))",
        border: "1px solid hsl(262 20% 91%)",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3, width: "100%" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 3,
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            height: 300,
            width: "100%",
          }}
        >
          {chartData.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "text.secondary", mt: 10 }}
            >
              No data available
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {type === "pie" ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "30px", fontSize: "16px" }}
                  />
                </PieChart>
              ) : type === "horizontalBar" ? (
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(262 20% 91%)"
                  />
                  <XAxis
                    type="number"
                    dataKey="value"
                    stroke="hsl(262 47% 25%)"
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(262 47% 25%)"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-bar-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(262 20% 91%)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(262 47% 25%)"
                    fontSize={12}
                  />
                  <YAxis
                    dataKey="value"
                    stroke="hsl(262 47% 25%)"
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#6EC6FF">
                    {/* No radius, just normal bars */}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SkillDistributionChart;
