import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportToExcel = ({ tableId, filename }) => {
  const exportToExcel = () => {
    const table = document.getElementById(tableId);
    const workbook = XLSX.utils.table_to_book(table);
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${filename}.xlsx`);
  };

  return <button onClick={exportToExcel}>Download as Excel</button>;
};

export default ExportToExcel;
