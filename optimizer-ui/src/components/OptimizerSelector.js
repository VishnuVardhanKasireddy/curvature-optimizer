import React from "react";

function OptimizerSelector({ selected, setSelected }) {
  const optimizers = ["Adam", "SGD", "RMSProp", "CALR", "CNAG"];

  const handleChange = (opt) => {
    if (selected.includes(opt)) {
      setSelected(selected.filter(o => o !== opt));
    } else {
      setSelected([...selected, opt]);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Select Optimizers</h3>
      {optimizers.map(opt => (
        <label key={opt} style={{ marginRight: "15px" }}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => handleChange(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

export default OptimizerSelector;