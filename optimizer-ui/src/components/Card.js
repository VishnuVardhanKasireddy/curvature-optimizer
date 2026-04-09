import React from "react";
import { motion } from "framer-motion";

function Card({ title, children, dark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}

      whileHover={{
        scale: 1.02,
        boxShadow: dark
          ? "0 8px 20px rgba(0,0,0,0.6)"
          : "0 8px 20px rgba(0,0,0,0.15)"
      }}

      style={{
        background: dark ? "#eb9552" : "#f5d7c1",
        color: dark ? "#e2e8f0" : "#0f172a",
        padding: "20px",
        borderRadius: "14px",
        marginBottom: "25px",
        cursor: "pointer"
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>{title}</h3>
      {children}
    </motion.div>
  );
}

export default Card;