import jsPDF from "jspdf";

export const exportPDF = ({ capo, tabRows }) => {
  const fileName = prompt("Enter PDF file name:", "guitar-tab");
  if (!fileName) return;

  const pdf = new jsPDF({ unit: "pt", format: "a4" });

  let y = 60;
  const margin = 40;

  pdf.setFont("Courier", "normal");
  pdf.setFontSize(12);

  pdf.text("Guitar Tab Sheet", margin, y);
  y += 20;

  if (capo > 0) {
    pdf.text(`Capo on fret ${capo}`, margin, y);
    y += 20;
  }

  const STRINGS = ["E", "A", "D", "G", "B", "E"];

  tabRows.forEach((row, rowIndex) => {
    pdf.text(row.name, margin, y);
    y += 16;

    STRINGS.forEach((s, i) => {
      let line = `${s}|`;

      row.steps.forEach((step) => {
        const note = step.find((n) => n.stringIndex === i);

        if (note) {
          const fret = Math.max(note.fret - capo, 0);
          line += `${fret.toString().padStart(2, "0")}---`;
        } else {
          line += "-----";
        }
      });

      line += "|";
      pdf.text(line, margin, y);
      y += 16;
    });

    y += 24;
  });

  pdf.save(`${fileName}.pdf`);
};