import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./level.css";
import Table from "./components/Table";
import ExportToExcel from "../../../components/ExportToExcel";
import Header from "../../../components/Header";
import Loader from "../../../components/Loader";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:1234";

function Results() {
  const target = useRef();
  const { level, semester, session, class_id } = useParams();
  const [students, setStudents] = useState([]);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    if (!class_id || !session || !semester || !level) return;
    
    setLoad(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/class/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_id,
          session,
          semester,
          level
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      setStudents(json.students || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError(err.message);
      setStudents([]);
    } finally {
      setLoad(false);
    }
  }, [class_id, session, semester, level]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);
  
  const filename = useMemo(() => 
    `${session}: ${level} Level: ${semester === "1" ? "first semester" : "second semester"} results`,
    [session, level, semester]
  );

  if (error) {
    return (
      <>
        <Header />
        <div className="current_level" style={{ textAlign: "center", padding: "2rem" }}>
          <div className="error-message" style={{ color: "red" }}>
            <h3>Error loading results</h3>
            <p>{error}</p>
            <button onClick={fetchStudents} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div
        className="current_level"
        ref={target}
        id="pageContent"
        style={{ textAlign: "center" }}
      >
        <div className="header">
          <h2>
            {session}: {level} Level:{" "}
            {semester === "1" ? "first semester" : "second semester"} results
          </h2>
        </div>
        {load && <Loader />}
        {!load && students.length === 0 && !error && (
          <div style={{ padding: "2rem" }}>
            <p>No students found for this class.</p>
          </div>
        )}
        {students.length > 0 && <Table students={students} />}
      </div>
      <div className="gp_tab no_print">
        <div className="transcript_btn">
          <button onClick={() => window.print()}>Print</button>
        </div>
        <div>
          <ExportToExcel
            tableId="myTable"
            filename={filename}
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(Results);
