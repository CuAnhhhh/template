import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

export type TimeRange = "hourly" | "daily" | "weekly" | "monthly";
type DataPoint = {
  date: string;
  low: number;
  high: number;
  volume: number;
  open: number;
  close: number;
};

const ChartComponent = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [active, setActive] = useState<TimeRange>("hourly");

  const handleClick = (range: TimeRange) => {
    setActive(range);
  };
  console.log(data);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await callApi();
        setData(result?.candles);
      } catch (error) {
        console.error("Gọi API thất bại");
      }
    };

    fetchData();
  }, [active]);

  const callApi = async (): Promise<{ candles: DataPoint[] }> => {
    try {
      const response = await fetch(
        `https://chart.stockscan.io/candle/v3/TSLA/${active}/NASDAQ`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      const data: { candles: DataPoint[] } = await response.json();
      return data;
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      throw error;
    }
  };

  return (
    <>
      <h2>Revenue chart by {active}</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {(["hourly", "daily", "weekly", "monthly"] as TimeRange[]).map(
          (range) => (
            <button
              key={range}
              onClick={() => handleClick(range)}
              style={{
                padding: "10px 20px",
                backgroundColor: active === range ? "#4f46e5" : "#e5e7eb",
                color: active === range ? "white" : "#111827",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          )
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="close" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartComponent;
