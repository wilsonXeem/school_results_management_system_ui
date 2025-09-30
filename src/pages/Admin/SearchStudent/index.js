import React, { useState, useContext, useEffect, useCallback } from "react";
import "./searchstudent.css";
import { ValueContext } from "../../../Context";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:1234";

function SearchStudent() {
  const navigate = useNavigate();
  const { socket } = useContext(ValueContext);
  const [reg_no, setReg_no] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchResult = useCallback((result) => {
    setStudents(result.student || []);
    setLoading(false);
    setError(null);
  }, []);

  const handleSearchError = useCallback((error) => {
    setError(error.message || 'Search failed');
    setLoading(false);
    setStudents([]);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("search", handleSearchResult);
    socket.on("search_error", handleSearchError);

    return () => {
      socket.off("search", handleSearchResult);
      socket.off("search_error", handleSearchError);
    };
  }, [socket, handleSearchResult, handleSearchError]);

  const handle_search = useCallback(async () => {
    if (!reg_no.trim()) {
      setError("Please enter a registration number");
      return;
    }

    setLoading(true);
    setError(null);
    setStudents([]);

    if (socket) {
      // Use socket if available
      socket.emit("search_student", { reg_no: reg_no.trim() });
    } else {
      // Fallback to direct API call
      try {
        const response = await fetch(`${API_BASE_URL}/api/student/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reg_no: reg_no.trim() }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setStudents(result.student || []);
        setLoading(false);
      } catch (err) {
        console.error('Search failed:', err);
        setError(err.message);
        setLoading(false);
      }
    }
  }, [reg_no, socket]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handle_search();
    }
  }, [handle_search]);

  return (
    <div className="search_student">
      <div className="header">
        <h2>Search Student</h2>
      </div>
      
      <div className="search_student_input">
        <p>Input student registration number:</p>
        <div>
          <input
            type="text"
            placeholder="Reg. No."
            value={reg_no}
            onChange={(e) => setReg_no(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button 
            onClick={handle_search} 
            disabled={loading || !reg_no.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      
      {loading && <Loader />}
      
      {error && (
        <div className="error-message" style={{ color: "red", textAlign: "center", padding: "1rem" }}>
          <p>{error}</p>
        </div>
      )}
      
      <div className="search_result">
        <h2>Results:</h2>
        <div className="student_result">
          {students.length === 0 && !loading && !error && reg_no && (
            <p style={{ textAlign: "center", color: "#666" }}>No students found.</p>
          )}
          {students.map((student, index) => (
            <div
              key={student._id || index}
              className="student-item"
              onClick={() => navigate(`/admin/student/${student._id}`)}
              style={{
                cursor: "pointer",
                padding: "0.5rem",
                margin: "0.5rem 0",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#f9f9f9"
              }}
            >
              <h3 style={{ margin: "0" }}>
                {student.fullname} - {student.reg_no}
              </h3>
              {student.level && (
                <p style={{ margin: "0.2rem 0", fontSize: "0.9rem", color: "#666" }}>
                  Level: {student.level}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(SearchStudent);
