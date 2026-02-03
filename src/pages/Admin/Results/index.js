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
  const [sortMode, setSortMode] = useState("none");

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

  const sortedStudents = useMemo(() => {
    if (!students?.length) return students;

    const sorted = [...students];
    if (sortMode === "none") {
      sorted.sort((a, b) =>
        String(a.fullname || "").localeCompare(String(b.fullname || ""), "en", {
          sensitivity: "base",
        })
      );
    } else if (sortMode === "semester_gpa") {
      sorted.sort((a, b) => {
        const calc = (student) => {
          let totalUnits = 0;
          let totalGp = 0;
          (student?.courses || []).forEach((course) => {
            totalUnits += Number(course.unit_load) || 0;
            totalGp += (Number(course.unit_load) || 0) * (Number(course.grade) || 0);
          });
          return totalUnits > 0 ? totalGp / totalUnits : 0;
        };
        return calc(b) - calc(a);
      });
    } else if (sortMode === "session_gpa") {
      sorted.sort((a, b) => (b.session_gpa || 0) - (a.session_gpa || 0));
    } else if (sortMode === "cgpa") {
      sorted.sort((a, b) => (b.cgpa || 0) - (a.cgpa || 0));
    }
    return sorted;
  }, [students, sortMode]);

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
      <div
        className="no_print"
        style={{
          position: "sticky",
          top: "12px",
          zIndex: 10,
          backgroundColor: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
          border: "1px solid #cbd5e1",
          margin: "1rem auto",
          maxWidth: "980px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ fontWeight: "600", color: "#334155" }}>Actions</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button
            onClick={() => setSortMode("semester_gpa")}
            style={{
              padding: "4px 10px",
              border: "none",
              backgroundColor: sortMode === "semester_gpa" ? "#0f172a" : "#e9ecef",
              color: sortMode === "semester_gpa" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          >
            Sort by Semester GPA
          </button>
          <button
            onClick={() => setSortMode("session_gpa")}
            style={{
              padding: "4px 10px",
              border: "none",
              backgroundColor: sortMode === "session_gpa" ? "#0f172a" : "#e9ecef",
              color: sortMode === "session_gpa" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          >
            Sort by Session GPA
          </button>
          <button
            onClick={() => setSortMode("cgpa")}
            style={{
              padding: "4px 10px",
              border: "none",
              backgroundColor: sortMode === "cgpa" ? "#0f172a" : "#e9ecef",
              color: sortMode === "cgpa" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          >
            Sort by Overall GPA
          </button>
          <button
            onClick={() => setSortMode("none")}
            style={{
              padding: "4px 10px",
              border: "none",
              backgroundColor: sortMode === "none" ? "#0f172a" : "#e9ecef",
              color: sortMode === "none" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          >
            Default Order
          </button>
          <button
            onClick={() => window.print()}
            style={{
              padding: "4px 10px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          >
            Print
          </button>
          <div style={{ display: "flex" }}>
            <ExportToExcel tableId="myTable" filename={filename} />
          </div>
        </div>
      </div>
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
        {students.length > 0 && <Table students={sortedStudents} />}
      </div>
      <div className="gp_tab no_print">
        <div className="transcript_btn"></div>
        <div></div>
      </div>
    </>
  );
}

export default React.memo(Results);
