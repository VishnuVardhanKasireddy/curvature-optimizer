import React from "react";
import { motion } from "framer-motion";
function OptimizerToggle({ visible, toggle, dark }) {
  return (
    <div style={{
        marginBottom: "25px",
        display: "flex",
        justifyContent: "center"
        }}>
        <div style={{
            display: "flex",
            gap: "10px",
            padding: "10px 15px",
            borderRadius: "30px",
            background: dark ? "#3b2f1e" : "#f4e3ce",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            flexWrap: "wrap",
            justifyContent: "center"
        }}>
      {Object.keys(visible).map((opt) => (
        <motion.button
            key={opt}
            onClick={() => toggle(opt)}

            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}

            style={{
                padding: "8px 14px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                fontWeight: "500",

                background: visible[opt]
                ? "#eb9f25"
                : (dark ? "#334155" : "#cbd5f5"),

                color: visible[opt]
                ? "#ffffff"
                : (dark ? "#cbd5f5" : "#1e293b"),

                transition: "0.2s"
            }}
            >
            {opt}
            </motion.button>
      ))}
    </div>
    </div>
  );
}

export default OptimizerToggle;