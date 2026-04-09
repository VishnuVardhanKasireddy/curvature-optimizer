import React from "react";
import { motion } from "framer-motion";

function KPISection({ dark }) {
  const cards = [
    { title: "Best Accuracy", value: "97.82%", color: "#22c55e" },
    { title: "Lowest Loss", value: "0.0783", color: "#ef4444" },
    { title: "Fastest Convergence", value: "Epoch 2", color: "#3b82f6" },
    { title: "Most Stable", value: "CNAG", color: "#f97316" }
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "15px",
      marginBottom: "25px"
    }}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}

          style={{
            padding: "15px",
            borderRadius: "12px",
            background: dark ? "#3b2b1e" : "#f8dfc6",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            textAlign: "center"
          }}
        >
          <p style={{
            fontSize: "12px",
            color: dark ? "#94a3b8" : "#64748b"
          }}>
            {card.title}
          </p>

          <h3 style={{
            marginTop: "5px",
            color: card.color
          }}>
            {card.value}
          </h3>
        </motion.div>
      ))}
    </div>
  );
}

export default KPISection;