import React from "react";

function SectionEditor({ name, onChange }) {
  return (
    <input
      value={name}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter section name"
      style={input}
    />
  );
}

export default SectionEditor;

/* styles */
const input = {
  padding: "4px 6px",
  borderRadius: 6,
  background: "#121212",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  marginBottom: 6,
  width: "60%",
};