import React from "react";
import { motion } from "framer-motion";

const data = [
  { name: "Adam", accuracy: 98.90, loss: 0.0599, convergence: 2 },
  { name: "SGD", accuracy: 98.74, loss: 0.0474, convergence: 13 },
  { name: "CALR", accuracy: 99.17, loss: 0.0461, convergence: 2 },
  { name: "CNAG", accuracy: 99.23, loss: 0.0439, convergence: 2 },
  { name: "RMSProp", accuracy: 98.32, loss: 0.0917, convergence: 2 }
];

// Ranking
const ranked = [...data]
  .map(d => ({
    ...d,
    score: d.accuracy - d.loss * 10 - d.convergence
  }))
  .sort((a, b) => b.score - a.score);

// Medal helper
const getMedal = (index) => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return index + 1;
};

// 🎨 Rank-based background
const getRowStyle = (index, dark) => {
  if (index === 0)
    return "linear-gradient(135deg, #fb9a24, #f7af3c)"; // gold
  if (index === 1)
    return "linear-gradient(135deg, #f5b362, #efbd80)"; // silver
  if (index === 2)
    return "linear-gradient(135deg, #f6c180, #f3cc9d)"; // bronze

  return "linear-gradient(135deg, #f7ce9d, #e7c59d)";
};

function Leaderboard({ dark }) {
  return (
    <div style={{ marginTop: "50px" }}>

      {/* CENTERED TITLE */}
      <h2 style={{
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "24px"
      }}>
        🏆 Optimizer Leaderboard
      </h2>

      {/* CARD */}
      <div style={{
        borderRadius: "16px",
        overflow: "hidden",
        background: dark ? "#020617" : "#ffffff",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
      }}>

        {/* HEADER */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 2fr 2fr 2fr",
          padding: "14px 20px",
          fontWeight: "600",
          background: dark ? "#554733" : "#f9f1e5"
        }}>
          <span>Rank</span>
          <span>Optimizer</span>
          <span>Accuracy</span>
          <span>Loss</span>
          <span>Epoch</span>
        </div>

        {/* ROWS */}
        {ranked.map((opt, index) => (
          <motion.div
            key={opt.name}
            whileHover={{
              scale: 1.02
            }}
            transition={{ duration: 0.2 }}

            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 2fr 2fr 2fr",
              padding: "14px 20px",
              alignItems: "center",
              background: getRowStyle(index, dark),
              color:  "#111827" ,
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              cursor: "pointer"
            }}
          >
            <span style={{ fontSize: "18px" }}>
              {getMedal(index)}
            </span>

            <span style={{
              fontWeight: index === 0 ? "700" : "500"
            }}>
              {opt.name}
            </span>

            <span>{opt.accuracy}%</span>
            <span>{opt.loss}</span>
            <span>{opt.convergence}</span>

          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;