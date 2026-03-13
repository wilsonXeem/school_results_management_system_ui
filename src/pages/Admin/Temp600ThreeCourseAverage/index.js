import React, { useEffect, useMemo, useState } from "react";
import "./temp600threecourseaverage.css";
import Loader from "../../../components/Loader";
import { API_BASE_URL } from "../../../config/api";

function Temp600ThreeCourseAverage() {
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/class/temp/600-three-course-average?session=2024-2025`
        );
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.message || "Failed to fetch temporary report");
        }
        setPayload(json);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoad(false);
      }
    };

    fetchData();
  }, []);

  const students = useMemo(() => payload?.students || [], [payload]);
  const highest = payload?.highest_student || null;

  return (
    <div className="temp_600_page">
      <div className="temp_600_header">
        <h2>Temporary 600 Level Three-Course Report</h2>
        <p>Session: 2024-2025 | Courses: CED341, CED342, CPM561</p>
      </div>

      {load && <Loader />}

      {error && (
        <div className="temp_error">
          <h3>Error loading report</h3>
          <p>{error}</p>
        </div>
      )}

      {!load && !error && payload && (
        <>
          <div className="temp_stats">
            <div className="stat_card">
              <p>Class Average (3-course)</p>
              <h3>{Number(payload.class_average || 0).toFixed(2)}</h3>
            </div>
            <div className="stat_card">
              <p>Highest Student</p>
              <h3>{highest ? highest.fullname : "N/A"}</h3>
              <small>
                {highest
                  ? `${highest.reg_no} | ${Number(highest.average).toFixed(2)}`
                  : ""}
              </small>
            </div>
            <div className="stat_card">
              <p>Course Averages</p>
              <small>
                CED341: {Number(payload.course_averages?.ced341 || 0).toFixed(2)}
              </small>
              <small>
                CED342: {Number(payload.course_averages?.ced342 || 0).toFixed(2)}
              </small>
              <small>
                CPM561: {Number(payload.course_averages?.cpm561 || 0).toFixed(2)}
              </small>
            </div>
          </div>

          <div className="temp_table_wrap">
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Reg No</th>
                  <th>CED341</th>
                  <th>CED342</th>
                  <th>CPM561</th>
                  <th>Average</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.student_id || `${student.reg_no}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{student.fullname}</td>
                    <td>{student.reg_no}</td>
                    <td>{Number(student.scores?.ced341 || 0).toFixed(2)}</td>
                    <td>{Number(student.scores?.ced342 || 0).toFixed(2)}</td>
                    <td>{Number(student.scores?.cpm561 || 0).toFixed(2)}</td>
                    <td>
                      <b>{Number(student.average || 0).toFixed(2)}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(Temp600ThreeCourseAverage);
