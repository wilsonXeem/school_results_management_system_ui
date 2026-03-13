import React, { useEffect, useState, useContext, useCallback } from "react";
import levels from "../../../data/levels";
import units from "../../../data/units";
import { useParams } from "react-router-dom";
import "./course.css";
import Table from "./components/Table";
import useExcelParser from "./components/useExcelParser";
import { ValueContext } from "../../../Context";
import Loader from "../../../components/Loader";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:1234";

function Course() {
  const { session, level, semester, code } = useParams();
  const course_title = levels[level][semester][code];
  const [students, setStudents] = useState([]);
  const { socket, setAlert } = useContext(ValueContext);
  const { data, parseExcel } = useExcelParser();
  const [load, setLoad] = useState(false);

  const fetchStudentsByCourse = useCallback(
    async (withLoader = true) => {
      if (withLoader) setLoad(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/class/${session}/${semester}/${code}`
        );
        if (!response.ok) throw new Error(`Failed to fetch students`);
        const json = await response.json();
        setStudents(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error(err);
        setAlert(true, "Failed to fetch course students", "error");
      } finally {
        if (withLoader) setLoad(false);
      }
    },
    [session, semester, code, setAlert]
  );

  useEffect(() => {
    fetchStudentsByCourse(true);
  }, [fetchStudentsByCourse]);

  // socket.on("students", (res) => {
  //   setStudents(res.students);
  //   setLoad(false);
  // });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) parseExcel(file);
  };

  const handle_result_upload = async () => {
    if (!Array.isArray(data) || data.length === 0) {
      setAlert(true, "Upload an Excel file with student scores first", "error");
      return;
    }

    setLoad(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/class/score`, {
        method: "POST",
        body: JSON.stringify({
          students: data,
          session,
          semester,
          course_code: code,
          level,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.message || "Failed to save scores");
      }

      if (Number(json?.summary?.skipped) > 0) {
        setAlert(
          true,
          `${json.message} Check skipped rows before re-upload.`,
          "error"
        );
      } else {
        setAlert(true, "Scores entered successfully", "success");
      }

      await fetchStudentsByCourse(false);
    } catch (err) {
      console.error(err);
      setAlert(true, err.message || "Error uploading scores", "error");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="single_course">
      <div className="header">
        <h2>
          {code} {course_title}
        </h2>
      </div>
      <div className="current_session">
        <p>Session:</p>
        <h3>{session}</h3>
        <p>Level:</p>
        <h3>{level} Level</h3>
        <p>Semester:</p>
        <h3>{semester === "1" ? "First semster" : "Second semester"}</h3>
        <p>Unit load:</p>
        <h3>{units[code]}</h3>
        <p>Upload result:</p>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <h4
          style={{
            margin: "0rem",
            background: "#020263",
            color: "white",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
          onClick={handle_result_upload}
        >
          Upload
        </h4>
      </div>
      {load && <Loader />}
      <Table
        students={students}
        session={session}
        semester={semester}
        code={code}
        socket={socket}
      />
    </div>
  );
}

export default Course;
