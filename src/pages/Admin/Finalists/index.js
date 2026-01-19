import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import "./finalists.css";
import Header from "../../../components/Header";
import Loader from "../../../components/Loader";
import ExportToExcel from "../../../components/ExportToExcel";
import Table from "./components/Table";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:1234";

function Finalists() {
  const target = useRef();
  const [sessionList, setSessionList] = useState([]);
  const [currentSession, setCurrentSession] = useState("");
  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoad(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      if (json.success) {
        setSessionList(json.sessions || []);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      setError(err.message);
      setSessionList([]);
    } finally {
      setLoad(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const fetchOutstanding = useCallback(async (classId, sessionLabel, level) => {
    setLoad(true);
    setError(null);
    setStudents([]);
    setSessions([]);
    setCurrentClass({ id: classId, level });
    setCurrentSession(sessionLabel);

    try {
      const response = await fetch(`${API_BASE_URL}/api/class/outstanding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class_id: classId }),
      });
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message || "Failed to fetch outstanding courses");
      }
      const json = await response.json();
      setSessions(json.sessions || []);
      setStudents(json.students || []);
    } catch (err) {
      console.error("Failed to fetch outstanding courses:", err);
      setError(err.message);
    } finally {
      setLoad(false);
    }
  }, []);

  const filename = useMemo(
    () => "Finalists: outstanding failed courses",
    []
  );

  if (error) {
    return (
      <>
        <Header />
        <div
          className="current_level"
          style={{ textAlign: "center", padding: "2rem" }}
        >
          <div className="error-message" style={{ color: "red" }}>
            <h3>Error loading finalists</h3>
            <p>{error}</p>
            <button
              onClick={fetchSessions}
              style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
            >
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
        className="current_level finalists_page"
        ref={target}
        id="pageContent"
        style={{ textAlign: "center" }}
      >
        <div className="header">
          <h2>Outstanding Failed Courses</h2>
        </div>
        {load && <Loader />}
        <div className="finalists_toolbar">
          <div className="finalists_panel">
            <h3>Sessions</h3>
            <div className="panel_row">
              {sessionList.map((session) => (
                <button
                  key={session.session}
                  type="button"
                  className={`panel_item ${
                    currentSession === session.session ? "active" : ""
                  }`}
                  onClick={() => {
                    setClasses(session.classes || []);
                    setCurrentSession(session.session);
                    setCurrentClass(null);
                    setStudents([]);
                    setSessions([]);
                  }}
                >
                  {session.session}
                </button>
              ))}
            </div>
          </div>
          <div className="finalists_panel">
            <h3>Classes</h3>
            {!currentSession && (
              <p className="panel_hint">Select a session to view classes.</p>
            )}
            <div className="panel_row">
              {classes.map((level) => (
                <button
                  key={level._id}
                  type="button"
                  className={`panel_item ${
                    currentClass?.id === level._id ? "active" : ""
                  }`}
                  onClick={() =>
                    fetchOutstanding(level._id, currentSession, level.level)
                  }
                >
                  {level.level} Level
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="finalists_table">
          {currentClass && (
            <div className="table_header">
              <h3>
                {currentSession} • {currentClass.level} Level
              </h3>
            </div>
          )}
          {!load && students.length === 0 && !error && currentClass && (
            <div style={{ padding: "2rem" }}>
              <p>No students with outstanding failed courses.</p>
            </div>
          )}
          {!currentClass && (
            <div style={{ padding: "2rem" }}>
              <p>Select a class to view outstanding courses.</p>
            </div>
          )}
          {students.length > 0 && (
            <Table students={students} sessions={sessions} />
          )}
        </div>
      </div>
      <div className="gp_tab no_print">
        <div className="transcript_btn">
          <button onClick={() => window.print()}>Print</button>
        </div>
        <div>
          <ExportToExcel tableId="myTable" filename={filename} />
        </div>
      </div>
    </>
  );
}

export default React.memo(Finalists);
