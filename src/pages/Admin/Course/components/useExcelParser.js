import { useState } from "react";
import * as XLSX from "xlsx";

const useExcelParser = () => {
  const [data, setData] = useState([]);

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

      // Assuming the first row is a header row; skip it
      const formattedData = jsonData
        .slice(1)
        .map((row) => {
          const [, regNoCell, nameCell, caCell, examCell] = row; // Skip the first column (s/n)
          const reg_no = String(regNoCell ?? "").trim();
          const name = String(nameCell ?? "").trim();

          // Blank score cells default to 0; invalid text is removed during backend validation.
          const ca =
            caCell === undefined || caCell === null || String(caCell).trim() === ""
              ? 0
              : Number(caCell);
          const exam =
            examCell === undefined || examCell === null || String(examCell).trim() === ""
              ? 0
              : Number(examCell);

          if (!reg_no) return null;
          return { reg_no, name, ca, exam };
        })
        .filter(Boolean);

      setData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  return { data, parseExcel };
};

export default useExcelParser;
