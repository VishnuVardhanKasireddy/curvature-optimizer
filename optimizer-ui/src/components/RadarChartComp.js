import React, { useState, useEffect } from "react";
import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from "recharts";

// ✅ MOVE OUTSIDE (fixes ESLint warning)
const baseData = {
  SGD: [95, 70, 60, 65],
  Adam: [97, 80, 85, 85],
  CALR: [98, 90, 95, 92],
  CNAG: [99, 92, 96, 95],
  RMSProp: [96, 75, 80, 78]
};

const labels = ["Accuracy", "Stability", "Convergence", "Loss"];

const RadarChartComp = () => {

  const [optimizer, setOptimizer] = useState("CALR");
  const [animatedData, setAnimatedData] = useState([]);

  // 🎬 Animate values
  useEffect(() => {
    const target = baseData[optimizer];

    let step = 0;

    const interval = setInterval(() => {
      step += 2;

      const temp = labels.map((label, i) => ({
        metric: label,
        value: Math.min(step, target[i])
      }));

      setAnimatedData(temp);

      if (step >= 100) clearInterval(interval);
    }, 10);

    return () => clearInterval(interval);
  }, [optimizer]); // ✅ clean dependency

  return (
    <div style={{ width: "100%", height: 480, textAlign: "center" }}>

      {/* 🔥 Title */}
      <h2 style={{ marginBottom: "6px" }}>
        📊 Optimizer Performance Radar
      </h2>

      {/* 🔽 Custom Selector */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "12px"
      }}>
        {Object.keys(baseData).map(opt => (
          <button
            key={opt}
            onClick={() => setOptimizer(opt)}
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              background:
                optimizer === opt
                  ? "linear-gradient(135deg, #f97316, #fb923c)"
                  : "#f9f6f1",
              color: optimizer === opt ? "#fff" : "#334155",
              boxShadow:
                optimizer === opt
                  ? "0 4px 12px rgba(249,115,22,0.4)"
                  : "none",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (optimizer !== opt) {
                e.target.style.background = "#f0eae2";
              }
            }}
            onMouseLeave={(e) => {
              if (optimizer !== opt) {
                e.target.style.background = "#f9f6f1";
              }
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* 📊 Radar */}
      <ResponsiveContainer width="100%" height="75%">
        <RadarChart data={animatedData} outerRadius="85%">

          {/* 🌈 Gradient + Glow */}
          <defs>
            <radialGradient id="radarGradient">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f97316" />
            </radialGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <PolarGrid stroke="#ede4d8" />

          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 14, fontWeight: "600" }}
          />

          <PolarRadiusAxis domain={[0, 100]} tick={false} />

          <Radar
            name={optimizer}
            dataKey="value"
            stroke="#f97316"
            fill="url(#radarGradient)"
            fillOpacity={0.6}
            style={{ filter: "url(#glow)" }}
          />

          <Tooltip />

        </RadarChart>
      </ResponsiveContainer>

      {/* 🎯 Label */}
      <p style={{ marginTop: "6px" }}>
        Showing performance metrics for <b>{optimizer}</b>
      </p>

    </div>
  );
};

export default RadarChartComp;