import React from "react";
import { motion } from "framer-motion";

function Conclusion({ dark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}

      style={{
        marginTop: "60px",
        padding: "30px",
        borderRadius: "18px",

        background: dark
          ? "linear-gradient(135deg, #2a200f, #3b2d1e)"
          : "linear-gradient(135deg, #fcdfc6, #f8efe8)",

        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}
    >

      {/* CENTER TITLE */}
      <h2 style={{
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "24px"
      }}>
         Summary
      </h2>

      {/* MAIN TEXT */}
      <p style={{
        lineHeight: "1.8",
        fontSize: "15px",
        color: dark ? "#cbd5f5" : "#334155",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        The proposed <b>Curvature-Aware Nesterov Accelerated Gradient (CNAG)</b>
        optimizer demonstrates superior performance across all evaluation metrics.

        It achieves <b>higher accuracy</b>, <b>lower loss</b>, and <b>faster convergence</b>
        compared to traditional optimizers such as Adam, SGD, and RMSProp.

        <br /><br />

        By integrating curvature-based adaptation with Nesterov momentum,
        CNAG enables more stable and efficient gradient updates, improving
        overall training dynamics.

        <br /><br />

        These results validate that curvature-aware optimization plays a
        significant role in enhancing deep learning performance.
      </p>

      {/* HIGHLIGHT BOX */}
      <div style={{
        marginTop: "25px",
        padding: "15px",
        borderRadius: "12px",
        textAlign: "center",
        background: dark ? "#554733" : "#ebc7a2"
      }}>
        <b>Key Takeaway:</b> CNAG achieves the best balance of
        speed, stability, and accuracy among all optimizers.
      </div>

    </motion.div>
  );
}

export default Conclusion;