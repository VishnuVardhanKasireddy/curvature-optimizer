import React, { useState, useEffect } from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer
} from "recharts";

const ConvergenceGauge = () => {

  const [optimizer, setOptimizer] = useState("CALR");
  const [animatedSpeed, setAnimatedSpeed] = useState(0);

  const epochs = {
    SGD: 9,
    RMSProp: 6,
    Adam: 4,
    CALR: 2,
    CNAG: 2
  };

  const maxEpoch = Math.max(...Object.values(epochs));
  const minEpoch = Math.min(...Object.values(epochs));

  const epoch = epochs[optimizer];

  const targetSpeed =
    ((maxEpoch - epoch) / (maxEpoch - minEpoch)) * 100;

  // 🔥 Smooth animation
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 2;
      if (start >= targetSpeed) {
        start = targetSpeed;
        clearInterval(interval);
      }
      setAnimatedSpeed(start);
    }, 10);

    return () => clearInterval(interval);
  }, [targetSpeed]);

  const data = [{ value: animatedSpeed }];

  return (
    <div style={{ textAlign: "center" }}>

      {/* 🔥 Title (tight spacing) */}
      <h2 style={{ marginBottom: "4px" }}>
        ⚡ Convergence Speed of Optimizers
      </h2>

      {/* 🔽 CUSTOM DROPDOWN */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "10px"
      }}>
        {Object.keys(epochs).map(opt => (
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
                  : "#f1f5f9",
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

      {/* ⚡ BIGGER GAUGE */}
      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="75%"   // 🔥 reduced gap
            innerRadius="65%"
            outerRadius="120%"
            startAngle={180}
            endAngle={0}
            data={data}
          >

            {/* 🔥 Gradient + Glow */}
            <defs>
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f5cd30" />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />

            <RadialBar
              dataKey="value"
              cornerRadius={20}
              fill="url(#orangeGradient)"
              style={{
                filter: "url(#glow)" // ✨ glow effect
              }}
            />

          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* 🎯 Animated Value */}
      <h1 style={{
        marginTop: "-50px",
        fontSize: "32px",
        fontWeight: "700"
      }}>
        {Math.round(animatedSpeed)}%
      </h1>

      <p style={{ marginTop: "4px" }}>
        <b>{optimizer}</b> converges in {epoch} epochs
      </p>

    </div>
  );
};

export default ConvergenceGauge;