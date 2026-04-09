import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { ResponsiveContainer } from "recharts";
import Card from "./Card";

const files = {
  Adam: "/data/adam.csv",
  CALR: "/data/calr.csv",
  CNAG: "/data/cnag.csv",
  SGD: "/data/sgd.csv",
  RMSProp: "/data/rmsprop.csv"
};

// 🎨 Colors
const colors = {
  Adam: "#6366f1",     // Indigo
  SGD: "#ef4444",      // Red
  RMSProp: "#06b6d4",  // Cyan
  CALR: "#22c55e",     // Green
  CNAG: "#f97316"      // Orange (highlight)
};

// 🔥 Custom Tooltip (shows all optimizers)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "white",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px"
      }}>
        <p><b>Epoch {label}</b></p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toFixed(4)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function Graphs({ selected }) {
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const promises = Object.entries(files).map(([name, file]) =>
      fetch(file)
        .then(res => res.text())
        .then(text => {
          const parsed = Papa.parse(text, { header: true });

          return {
            name,
            data: parsed.data
              .filter(row => row.epoch)
              .map(row => ({
                epoch: Number(row.epoch),
                loss: Number(row.loss),
                accuracy: Number(row.accuracy),
                grad_norm: Number(row.grad_norm)
              }))
          };
        })
    );

    Promise.all(promises).then(results => {
      const obj = {};
      results.forEach(r => {
        obj[r.name] = r.data;
      });
      setGroupedData(obj);
    });
  }, []);

  // ⛔ Wait until data loads
  if (Object.keys(groupedData).length === 0) {
    return <p>Loading data...</p>;
  }

return (
  <div>

    {/* 📉 LOSS */}
    <Card title=" Loss vs Epoch">
      <div style={{ width: "100%", height: 420 }}>
        <ResponsiveContainer width="100%" height={400}>
        <LineChart >
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />

          <XAxis
            dataKey="epoch"
            type="number"
            domain={[1, 5]}
            ticks={[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]}
            tickFormatter={(tick) => tick.toFixed(1)}
            label={{ value: "Epoch", position: "insideBottom", offset: -5 }}
          />

          <YAxis
            label={{ value: "Loss", angle: -90, position: "insideLeft" }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />

          {selected.map(opt => (
            groupedData[opt] && (
              <Line
                key={opt}
                data={groupedData[opt]}
                dataKey="loss"
                name={opt}
                stroke={colors[opt]}
                strokeWidth={opt === "CNAG" ? 4 : 2}
                strokeDasharray={opt === "CNAG" ? "0" : "6 4"}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )
          ))}
        </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>


    {/* 📈 ACCURACY */}
    <Card title=" Accuracy vs Epoch">
      <div style={{ width: "100%", height: 420 }}>
        <ResponsiveContainer width="100%" height={400}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />

          <XAxis
            dataKey="epoch"
            type="number"
            domain={[1, 5]}
            ticks={[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]}
            tickFormatter={(tick) => tick.toFixed(1)}
            label={{ value: "Epoch", position: "insideBottom", offset: -5 }}
          />

          <YAxis
            domain={["dataMin - 1", "dataMax + 0.5"]}
            label={{ value: "Accuracy (%)", angle: -90, position: "insideLeft" }}
            />

          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />

          {selected.map(opt => (
            groupedData[opt] && (
              <Line
                key={opt}
                data={groupedData[opt]}
                dataKey="accuracy"
                name={opt}
                stroke={colors[opt]}
                strokeWidth={opt === "CNAG" ? 4 : 2}
                strokeDasharray={opt === "CNAG" ? "0" : "6 4"}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )
          ))}
        </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>


    {/*  GRADIENT NORM */}
    <Card title=" Gradient Norm Stability">
      <div style={{ width: "100%", height: 420 }}>
        <ResponsiveContainer width="100%" height={400}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />

          <XAxis
            dataKey="epoch"
            type="number"
            domain={[1, 5]}
            ticks={[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]}
            tickFormatter={(tick) => tick.toFixed(1)}
            label={{ value: "Epoch", position: "insideBottom", offset: -5 }}
          />

          <YAxis
            label={{ value: "Gradient Norm", angle: -90, position: "insideLeft" }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />

          {selected.map(opt => (
            groupedData[opt] && (
              <Line
                key={opt}
                data={groupedData[opt]}
                dataKey="grad_norm"
                name={opt}
                stroke={colors[opt]}
                strokeWidth={opt === "CNAG" ? 4 : 2}
                strokeDasharray={opt === "CNAG" ? "0" : "6 4"}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )
          ))}
        </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>

  </div>
);
}

export default Graphs;