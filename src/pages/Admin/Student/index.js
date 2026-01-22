import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "./adminstudentdashboard.css";
import unn from "../../../data/unn.png";
import Table from "./ocmponents/Table";
import { useParams, useNavigate } from "react-router-dom";
import generatePDF from "react-to-pdf";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:1234";

function AdminStudentDashboard() {
  const target = useRef();
  const navigate = useNavigate();
  const { _id } = useParams();
  const [semester, setSemester] = useState({});
  const [total_semesters, setTotal_semesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcriptType, setTranscriptType] = useState("faculty");

  const formattedToday = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return dd + "/" + mm + "/" + yyyy;
  }, []);

  const fetchStudentData = useCallback(async () => {
    if (!_id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/results/semester/${_id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      const semesters = Array.isArray(json) ? json : [];
      
      setTotal_semesters(semesters);
      setSemester(semesters[semesters.length - 1] || {});
    } catch (err) {
      console.error('Failed to fetch student data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [_id]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleSemesterChange = useCallback((e) => {
    const index = parseInt(e.target.value);
    if (total_semesters[index]) {
      setSemester(total_semesters[index]);
    }
  }, [total_semesters]);

  const handleGeneratePDF = useCallback(() => {
    if (!semester?.student_id?.fullname) return;
    
    generatePDF(target, {
      filename: `${semester.student_id.fullname} result statement.pdf`,
    });
  }, [semester]);

  const handleNavigateToTranscript = useCallback(() => {
    if (!semester?.session || !semester?.level || !semester?.student_id?._id) return;
    
    navigate(
      `/admin/student/transcript/${semester.session}/${semester.level}/${semester.student_id._id}`
    );
  }, [navigate, semester]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Loading student data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div className="error-message" style={{ color: "red" }}>
          <h3>Error loading student data</h3>
          <p>{error}</p>
          <button onClick={fetchStudentData} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!semester?.student_id) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h3>No student data found</h3>
        <button onClick={() => navigate('/admin')} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Back to Admin
        </button>
      </div>
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
          maxWidth: "820px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ fontWeight: "600", color: "#334155" }}>
            Transcript Type
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setTranscriptType("faculty")}
              style={{
                padding: "4px 10px",
                border: "none",
                backgroundColor:
                  transcriptType === "faculty" ? "#007bff" : "#e9ecef",
                color: transcriptType === "faculty" ? "white" : "#333",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "4px",
              }}
            >
              Faculty
            </button>
            <button
              onClick={() => setTranscriptType("university")}
              style={{
                padding: "4px 10px",
                border: "none",
                backgroundColor:
                  transcriptType === "university" ? "#007bff" : "#e9ecef",
                color: transcriptType === "university" ? "white" : "#333",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "4px",
              }}
            >
              University
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={handleGeneratePDF}
            disabled={!semester?.student_id?.fullname}
            style={{
              padding: "4px 10px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "4px",
              opacity: semester?.student_id?.fullname ? 1 : 0.6,
            }}
          >
            Print Statement
          </button>
          <button
            onClick={handleNavigateToTranscript}
            disabled={
              !semester?.session ||
              !semester?.level ||
              !semester?.student_id?._id
            }
            style={{
              padding: "4px 10px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "4px",
              opacity:
                semester?.session &&
                semester?.level &&
                semester?.student_id?._id
                  ? 1
                  : 0.6,
            }}
          >
            Generate Transcript
          </button>
        </div>
      </div>
      <div className="student_dashboard" ref={target}>
        <div className="d_head">
          <div className="student_dashboard_head">
            <div className="passport">
              <div className="passport_img">
                <img src={unn} alt="University Logo" />
              </div>
            </div>
            <div className="dashboard_header">
              <div className="student_dashboard_head_title">
                <p>Faculty of Pharmaceutical Sciences</p>
                <p>University of Nigeria Nsukka</p>
                <p>PHARM. D PROFESSIONAL EXAMINATION RESULT SHEET</p>
                <i style={{ fontSize: "x-large", fontWeight: "bold" }}>
                  ({transcriptType === "faculty"
                    ? "Faculty Copy"
                    : "University Copy"})
                </i>
              </div>
            </div>
            <div className="passport">
              <div className="passport_img">
                <img 
                  src={semester?.student_id?.profile_image || unn} 
                  alt="Student" 
                  onError={(e) => { e.target.src = unn; }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="student_dashboard_body">
          <div className="student_dashboard_body_details">
            <p>
              Name: <b>{semester?.student_id?.fullname || 'N/A'}</b>
            </p>
            <p>
              Reg. No: <b>{semester?.student_id?.reg_no || 'N/A'}</b>
            </p>
            <p>
              Session:{" "}
              <b>
                <select
                  value={total_semesters.findIndex(s => s === semester)}
                  onChange={handleSemesterChange}
                >
                  {total_semesters.map((sem, i) => (
                    <option key={i} value={i}>
                      {sem?.session} - Semester {sem?.semester}
                    </option>
                  ))}
                </select>
              </b>
            </p>
            <p>
              Level: <b>{semester?.level || 'N/A'}</b>
            </p>
            <p>
              Semester: <b>{semester?.semester === 1 ? "First" : semester?.semester === 2 ? "Second" : 'N/A'}</b>
            </p>
            <p>
              Mode of entry: <b>{semester?.student_id?.moe || 'N/A'}</b>
            </p>
          </div>
          {semester?.courses?.length > 0 ? (
            <Table courses={semester.courses} />
          ) : (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>No courses found for this semester.</p>
            </div>
          )}

          <div className="gp_tab">
            <div className="transcript_btn"></div>
          </div>
          <div className="signature">
            <div className="exam_office">
              <p
                style={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              >
                chukwuma chinyere p. {formattedToday}
              </p>
              <p style={{ borderTop: "1px dotted black" }}>
                Name and Signature of Examination Officer (with date)
              </p>
            </div>
            <div className="dean">
              <p
                style={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              >
                Prof. c. s. Nworu {formattedToday}
              </p>
              <p style={{ borderTop: "1px dotted black" }}>
                Name & Signature of Dean (with date)
              </p>
            </div>
          </div>
        </div>
        <div className="grade_table">
          <table>
            <thead>
              <tr
                style={{
                  textTransform: "uppercase",
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                <th colSpan={3}>non-professional courses</th>
                <th colSpan={3}>professional courses</th>
              </tr>
              <tr style={{ textTransform: "capitalize", fontWeight: "550" }}>
                <td>score range</td>
                <td>letter grade</td>
                <td>grade point</td>
                <td>score range</td>
                <td>letter grade</td>
                <td>grade point</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>70-100</td>
                <td>A (Excellent)</td>
                <td>5</td>
                <td>70-100</td>
                <td>A (Excellent)</td>
                <td>5</td>
              </tr>
              <tr>
                <td>60-69</td>
                <td>B (Very Good)</td>
                <td>4</td>
                <td>60-69</td>
                <td>B (Very Good)</td>
                <td>4</td>
              </tr>
              <tr>
                <td>50-59</td>
                <td>c (Good)</td>
                <td>3</td>
                <td>50-59</td>
                <td>c (Good)</td>
                <td>3</td>
              </tr>
              <tr>
                <td>45-49</td>
                <td>D (Fair)</td>
                <td>2</td>
                <td>0-49</td>
                <td>F (Fail)</td>
                <td>0</td>
              </tr>
              <tr>
                <td>40-44</td>
                <td>E (Pass)</td>
                <td>1</td>
                <td colSpan={3}>
                  <b style={{ color: "red" }}>*</b>{" "}
                  {"< 60 F (Fail) for PCT224 and PCT422"}{" "}
                </td>
              </tr>
              <tr>
                <td>0-39</td>
                <td>F (Fail)</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="transcript_button"></div>
    </>
  );
}

export default React.memo(AdminStudentDashboard);
