import { useState } from "react";
import * as XLSX from "xlsx";

const ExtractMoe = () => {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1, // Get data as an array of arrays
      });

      const extractedData = sheet.slice(1).map((row) => ({
        reg_no: row[1], // Second column
        moe: row[2], // Third column
      }));

      setStudents(extractedData);
    };
  };

  const handleSubmit = async () => {
    const response = await fetch(
      "http://127.0.0.1:1234/api/student/moe",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }),
      }
    );

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h2>Upload Excel File to Extract MOE</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button onClick={handleSubmit} disabled={students.length === 0}>
        Submit MOE Data
      </button>
      {message && <p>{message}</p>}

      {students.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Reg No</th>
              <th>MOE</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.reg_no}</td>
                <td>{student.moe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExtractMoe;
