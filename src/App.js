import React, { useState, useRef } from "react";
import Fretboard from "./components/Fretboard";
import TabPreview from "./components/TabPreview";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getNoteColor } from "./utils/noteColors";

function App() {
  const [capo, setCapo] = useState(0);
  const [capoLocked, setCapoLocked] = useState(false);

  const [selectedNotes, setSelectedNotes] = useState([]);
  const [tabPreview, setTabPreview] = useState([]);

  const previewRef = useRef();

  const handleCapoChange = (value) => {
    setCapo(value);
  };

  const handleStamp = () => {
    if (selectedNotes.length === 0) return;
    setTabPreview((prev) => [...prev, selectedNotes]);
    setSelectedNotes([]);
  };

  const exportPDF = async () => {
    const element = previewRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("guitar-tab.pdf");
  };

  return (
    <div
      style={{
        padding: 20,
        background: "#121212",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      {/* TOP TOOLBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          background: "#1e1e1e",
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Capo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, opacity: 0.7 }}>Capo:</span>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              value={capo}
              disabled={capoLocked}
              onChange={(e) => handleCapoChange(Number(e.target.value))}
              style={{
                width: 70,
                padding: "4px 6px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "#121212",
                color: "#fff",
              }}
            >
              {Array.from({ length: 13 }).map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>

            <button
              onClick={() => setCapoLocked((prev) => !prev)}
              style={btnSecondary}
              title={capoLocked ? "Unlock Capo" : "Lock Capo"}
            >
              {capoLocked ? "🔓 Unlock" : "🔒 Lock"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button style={btnSecondary} onClick={exportPDF}>
            Export PDF
          </button>
        </div>
      </div>

      {/* TAB PREVIEW */}
      <div
        ref={previewRef}
        style={{
          marginBottom: 20,
          background: "#1e1e1e",
          padding: 16,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* 🔥 Capo info (will appear in PDF) */}
        {capo > 0 && (
          <div style={{ marginBottom: 8, color: "#aaa", fontSize: 12 }}>
            Capo on fret {capo} (Tab is relative to capo)
          </div>
        )}

        <TabPreview notes={tabPreview} capo={capo} />
      </div>

      {/* FRETBOARD HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <h3 style={{ opacity: 0.6, fontSize: 12, letterSpacing: 1 }}>
          FRETBOARD VIEW
        </h3>

        <button style={btnPrimaryFloating} onClick={handleStamp}>
          + ADD TO TIMESTAMP
        </button>
      </div>

      {/* SELECTED NOTES */}
      <div
        style={{
          marginBottom: 20,
          background: "#1e1e1e",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h4 style={{ marginBottom: 10 }}>Selected Notes</h4>

        {selectedNotes.length === 0 && (
          <span style={{ opacity: 0.5 }}>No notes selected</span>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {selectedNotes.map((n, i) => {
            const bgColor = getNoteColor(n.note);
            return (
              <span
                key={i}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  background: bgColor,
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                {n.note}
              </span>
            );
          })}
        </div>
      </div>

      {/* FRETBOARD */}
      <div
        style={{
          background: "#1e1e1e",
          padding: 16,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Fretboard
          capo={capo}
          selectedNotes={selectedNotes}
          setSelectedNotes={setSelectedNotes}
        />
      </div>
    </div>
  );
}

const btnPrimaryFloating = {
  background: "#0051d5",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 10,
  fontSize: 12,
  fontWeight: "bold",
  cursor: "pointer",
  letterSpacing: 0.5,
  boxShadow: "0 0 12px rgba(0,81,213,0.3)",
};

const btnSecondary = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

export default App;