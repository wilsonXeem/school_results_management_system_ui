import React, { useState } from "react";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

const ExcelSplitter = () => {
  const [sheets, setSheets] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const ws = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const headers = jsonData[0];
      const baseColumns = headers.slice(0, 3); // First three columns
      const newSheets = [];

      for (let i = 3; i < headers.length; i++) {
        const newSheetData = jsonData
          .map((row, rowIndex) => {
            if (rowIndex === 0) {
              return [...baseColumns, "CA", "Exam"];
            }
            const score = row[i] || 0;
            if (score > 0) {
              const ca = (score * 0.3).toFixed(2);
              const exam = (score * 0.7).toFixed(2);
              return [...row.slice(0, 3), ca, exam];
            }
            return null;
          })
          .filter((row) => row !== null); // Remove students with score 0

        if (newSheetData.length > 1) {
          // Ensure the sheet is not empty after filtering
          newSheets.push({ name: headers[i], data: newSheetData });
        }
      }
      setSheets(newSheets);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownload = (sheet) => {
    const ws = XLSX.utils.aoa_to_sheet(sheet.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    FileSaver.saveAs(new Blob([wbout]), `${sheet.name}.xlsx`);
  };

  return (
    <div>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      {sheets.length > 0 && (
        <div>
          {sheets.map((sheet, index) => (
            <button key={index} onClick={() => handleDownload(sheet)}>
              Download {sheet.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExcelSplitter;
