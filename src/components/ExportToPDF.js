import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ExportTableToPDF = ({ tableData, columns, filename }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Define table columns and rows
    const tableColumns = columns;
    const tableRows = tableData.map((row) =>
      tableColumns.map((col) => row[col])
    );

    // Add autoTable to PDF
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      theme: "striped",
      startY: 20,
      margin: { top: 10, left: 10, right: 10 },
    });

    // Save the PDF
    doc.save(`${filename}.pdf`);
  };

  return <button onClick={exportToPDF}>Download Table as PDF</button>;
};

export default ExportTableToPDF;
