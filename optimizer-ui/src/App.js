import React, { useState } from "react";
import Graphs from "C:/Dev/Projects/curvature-optimizer/optimizer-ui/src/components/Graph.js";
import OptimizerSelector from "C:/Dev/Projects/curvature-optimizer/optimizer-ui/src/components/OptimizerSelector.js";
import KPISection from "C:/Dev/Projects/curvature-optimizer/optimizer-ui/src/components/KPISection";
import OptimizerToggle from "C:/Dev/Projects/curvature-optimizer/optimizer-ui/src/components/OptimizerToggle";
import Leaderboard from "C:/Dev/Projects/curvature-optimizer/optimizer-ui/src/components/Leaderboard";
import Conclusion from "C:/Dev/Projects/curvature-optimizer/optimizer-ui/src/components/Conclusion";
import { motion } from "framer-motion";
function App() {
  const [dark, setDark] = useState(false);

  const [visible, setVisible] = useState({
    Adam: true,
    SGD: true,
    RMSProp: true,
    CALR: true,
    CNAG: true
  });

  const toggleOptimizer = (opt) => {
    setVisible({ ...visible, [opt]: !visible[opt] });
  };

  const selected = Object.keys(visible).filter(k => visible[k]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
    <div style={{
      background: dark
          ? "linear-gradient(to bottom, #170c02, #170f02)"
          : "linear-gradient(to bottom, #f9f6f1, #f0eae2)",
      color: dark ? "#f8fafc" : "#0f172a",
      textAlign:"center",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "Inter, sans-serif",
      transition: "all 0.3s ease"
    }}>

      {/* HEADER */}
      <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>

          {/* LEFT SIDE (Title + Subtitle) */}
          <div>
            <h1 style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "5px",
              textAlign:"center"
            }}>
              🚀 Gradient Optimizer Performance Dashboard
            </h1>

            <p style={{
              fontSize: "14px",
              color: dark ? "#94a3b8" : "#64748b"
            }}>
              Comparative analysis of gradient optimization algorithms 
            </p>
          </div>

          {/* RIGHT SIDE (Dark Mode Button) */}
          <motion.button
              onClick={() => setDark(!dark)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}

              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: "500",
                background: dark ? "#1e293b" : "#e2e8f0",
                color: dark ? "#f8fafc" : "#0f172a"
              }}
            >
              {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
            </motion.button>

        </div>
        <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "25px"
          }}>
            <motion.div
              whileHover={{
                scale: 1.03,
                boxShadow: "0 12px 35px rgba(249,115,22,0.6)"
              }}
              transition={{ duration: 0.2 }}

              style={{
                width: "60%",
                padding: "20px 30px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #f97316, #fb923c)",
                color: "white",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(249,115,22,0.4)"
              }}
            >
              <h2 style={{ marginBottom: "8px" }}>🏆 Best Performing Optimizer</h2>
              <h1 style={{ fontSize: "32px", fontWeight: "700" }}>CNAG</h1>
              <p style={{ opacity: 0.9 }}>
                Highest accuracy, lowest loss, fastest convergence
              </p>
            </motion.div>
          </div>

      {/* KPI */}
      <KPISection dark={dark} />

      {/* WINNER */}
      <div style={{
        background: "#fc9348",
        color: "white",
        padding: "12px",
        borderRadius: "10px",
        marginBottom: "20px",
        textAlign:"center"
      }}>
        🚀 Best Optimizer: <b>CNAG</b> (Curvature Aware Nesterov Accelerated Gradient Optimizer)
      </div>

      {/* TOGGLE */}
      <OptimizerToggle
        visible={visible}
        toggle={toggleOptimizer}
        dark={dark}
      />

      {/* GRAPHS */}
      <Graphs selected={selected} dark={dark} />
      <Leaderboard dark={dark} />
      <Conclusion dark={dark} />

    </div>
    </motion.div>
  );
}

export default App;