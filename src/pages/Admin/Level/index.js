import React, { useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import levels from "../../../data/levels";
import external_courses from "../../../data/external_courses";
import external_units from "../../../data/external_units";
import units from "../../../data/units";
import Table from "./components/Table";
import useExcelParser from "./components/useExcelParser";
import { ValueContext } from "../../../Context";
import Loader from "../../../components/Loader";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:1234";

// Cache for API responses
const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function Level() {
  const { level, semester, class_id, session } = useParams();
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const { data, parseExcel } = useExcelParser();
  const { setAlert } = useContext(ValueContext);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const lastFetchRef = useRef(null);
  
  const current_semester = levels[level]?.[semester] || {};
  const course_codes = Object.keys(current_semester);
  const course_titles = Object.values(current_semester);
  const external_codes = Object.keys(external_courses);
  const external_titles = Object.values(external_courses);

  const fetchStudents = useCallback(async (forceRefresh = false) => {
    if (!class_id || !semester || !level || !session) return;
    
    const cacheKey = `${class_id}-${semester}-${level}-${session}`;
    const now = Date.now();
    
    if (!forceRefresh && dataCache.has(cacheKey)) {
      const cached = dataCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        setStudents(cached.data);
        return;
      }
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const requestTime = now;
    lastFetchRef.current = requestTime;
    
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
          semester,
          level,
          session,
        }),
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      
      if (lastFetchRef.current === requestTime) {
        const studentsData = json.students || [];
        setStudents(studentsData);
        
        dataCache.set(cacheKey, {
          data: studentsData,
          timestamp: now
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      
      if (lastFetchRef.current === requestTime) {
        console.error('Failed to fetch students:', err);
        setError(err.message);
        setStudents([]);
      }
    } finally {
      if (lastFetchRef.current === requestTime) {
        setLoad(false);
      }
    }
  }, [class_id, semester, level, session]);
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      parseExcel(file);
    }
  }, [parseExcel]);

  const handle_course_reg = useCallback(async () => {
    if (!selectedCourse || !data?.length) {
      setAlert(true, "Please select a course and upload student data", "error");
      return;
    }
    
    setLoad(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/class/register`, {
        method: "POST",
        body: JSON.stringify({
          students: data,
          level,
          course_title: current_semester[selectedCourse],
          course_code: selectedCourse,
          unit_load: units[selectedCourse],
          semester,
          session,
          class_id,
          external: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      setStudents(json.students || []);
      
      const cacheKey = `${class_id}-${semester}-${level}-${session}`;
      dataCache.delete(cacheKey);
      
      setAlert(true, "All students registered successfully!", "success");
      setSelectedCourse("");
    } catch (err) {
      console.error('Failed to register course:', err);
      setError(err.message);
      setAlert(true, "Failed to register students", "error");
    } finally {
      setLoad(false);
    }
  }, [selectedCourse, data, level, semester, session, class_id, setAlert, current_semester]);

  const handle_external_course = useCallback(async () => {
    if (!selectedCourse || !data?.length) {
      setAlert(true, "Please select a course and upload student data", "error");
      return;
    }
    
    setLoad(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/class/external`, {
        method: "POST",
        body: JSON.stringify({
          students: data,
          level,
          course_title: external_courses[selectedCourse],
          course_code: selectedCourse,
          unit_load: external_units[selectedCourse],
          semester,
          session,
          class_id,
          external: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      setStudents(json.students || []);
      
      const cacheKey = `${class_id}-${semester}-${level}-${session}`;
      dataCache.delete(cacheKey);
      
      setAlert(true, "External course registered successfully!", "success");
      setSelectedCourse("");
      setShow(false);
    } catch (err) {
      console.error('Failed to register external course:', err);
      setError(err.message);
      setAlert(true, "Failed to register external course", "error");
    } finally {
      setLoad(false);
    }
  }, [selectedCourse, data, level, semester, session, class_id, setAlert]);

  if (error) {
    return (
      <div className="current_level" style={{ textAlign: "center", padding: "2rem" }}>
        <div className="error-message" style={{ color: "red" }}>
          <h3>Error loading level data</h3>
          <p>{error}</p>
          <button onClick={() => fetchStudents(true)} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="current_level">
      <div className="header">
        <h2>
          {level} Level:{" "}
          {semester === "1" ? "first semester" : "second semester"}
        </h2>
      </div>
      <div className="course_reg_upload">
        <p>Register course:</p>
        <select
          name="course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select course</option>
          {course_codes.map((course, key) => (
            <option key={course} value={course}>
              <span>{course}</span> {course_titles[key]}
            </option>
          ))}
        </select>
        <p style={{ textAlign: "center" }}>
          Unit load: <b>{units[selectedCourse] || 'N/A'}</b>
        </p>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <button onClick={handle_course_reg} disabled={!selectedCourse || !data?.length || load}>
          Upload
        </button>
        <button onClick={() => setShow(true)} disabled={load}>Add external course</button>
      </div>
      {show && (
        <div className="external_course_reg_upload">
          <p>Register external course:</p>
          <select
            name="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select course</option>
            {external_codes.map((course, key) => (
              <option key={course} value={course}>
                <span>{course}</span> {external_titles[key]}{" "}
                {external_units[course]}
              </option>
            ))}
          </select>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          <button onClick={handle_external_course} disabled={!selectedCourse || !data?.length || load}>
            Register
          </button>
          <button
            style={{ backgroundColor: "red" }}
            onClick={() => { setShow(false); setSelectedCourse(""); }}
            disabled={load}
          >
            Cancel
          </button>
        </div>
      )}
      {load && <Loader />}
      {students.length > 0 && <Table students={students} />}
    </div>
  );
}

export default React.memo(Level);
