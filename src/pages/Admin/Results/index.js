import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./level.css";
import Table from "./components/Table";
import ExportToExcel from "../../../components/ExportToExcel";
import Header from "../../../components/Header";
import Loader from "../../../components/Loader";
import { API_BASE_URL } from "../../../config/api";

function Results() {
  const target = useRef();
  const { level, semester, session, class_id } = useParams();
  const [students, setStudents] = useState([]);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [sortMode, setSortMode] = useState("none");

  const compareByName = useCallback((a, b) => {
    const normalize = (value) =>
      String(value ?? "")
        .replace(/\s+/g, " ")
        .trim();

    const nameCompare = normalize(a?.fullname).localeCompare(
      normalize(b?.fullname),
      "en",
      {
        sensitivity: "base",
        numeric: true,
      }
    );

    if (nameCompare !== 0) return nameCompare;

    return normalize(a?.reg_no).localeCompare(normalize(b?.reg_no), "en", {
      sensitivity: "base",
      numeric: true,
    });
  }, []);

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

  useEffect(() => {
    setSortMode("none");
  }, [class_id, session, semester, level]);
  
  const filename = useMemo(() => 
    `${session}: ${level} Level: ${semester === "1" ? "first semester" : "second semester"} results`,
    [session, level, semester]
  );

  const sortedStudents = useMemo(() => {
    if (!students?.length) return students;

    const sorted = [...students];
    const toNumber = (value) => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : 0;
    };

    if (sortMode === "none") {
      sorted.sort(compareByName);
    } else if (sortMode === "semester_gpa") {
      sorted.sort((a, b) => {
        const diff = toNumber(b.gpa) - toNumber(a.gpa);
        return diff !== 0 ? diff : compareByName(a, b);
      });
    } else if (sortMode === "session_gpa") {
      sorted.sort((a, b) => {
        const diff = toNumber(b.session_gpa) - toNumber(a.session_gpa);
        return diff !== 0 ? diff : compareByName(a, b);
      });
    } else if (sortMode === "cgpa") {
      sorted.sort((a, b) => {
        const diff = toNumber(b.cgpa) - toNumber(a.cgpa);
        return diff !== 0 ? diff : compareByName(a, b);
      });
    }
    return sorted;
  }, [students, sortMode, compareByName]);

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
            Sort A-Z
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
