import React, { useState, useEffect } from "react";
import Box from "./components/Box";
import "./dashboard.css";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [current_session, setCurrent_session] = useState("");
  const [load, setLoad] = useState(false);
  const [total_sessions, setTotal_sessions] = useState("");
  const [sessions, setSessions] = useState([]);
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [correcting, setCorrecting] = useState(false);
  const [correctStatus, setCorrectStatus] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleCorrectSemesterLevels = async () => {
    if (!selectedSession || !selectedSemester) return;
    const semester = Number(selectedSemester);
    setCorrecting(true);
    setCorrectStatus({ type: "", text: "" });
    try {
      const response = await fetch(
        "http://127.0.0.1:1234/api/student/correct-semester-levels",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session: selectedSession,
            semester,
          }),
        }
      );
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || "Failed to correct semester levels");
      }
      setCorrectStatus({
        type: "success",
        text: `${json.message} Updated ${json.updated} of ${json.total} records.`,
      });
    } catch (err) {
      console.error(err);
      setCorrectStatus({ type: "error", text: err.message });
    } finally {
      setCorrecting(false);
    }
  };

  useEffect(() => {
    setLoad(true);
    fetch("http://127.0.0.1:1234/api/sessions/")
      .then((res) => res.json())
      .then((json) => {
        setSessions(json.sessions);
        const currentSession = json.sessions.find(
          (session) => session.current === true
        );
        setCurrent_session(currentSession?.session || "");
        setTotal_sessions(json.sessions.length);
        if (!selectedSession && currentSession?.session) {
          setSelectedSession(currentSession.session);
        }
        setLoad(false);
      })
      .catch((err) => console.log(err));
  }, [selectedSession]);

  return (
    <div className="admin_dashboard">
      <div className="admin_dashboard_header">
        <div>
          <p className="admin_dashboard_overline">Faculty Admin</p>
          <h2>Dashboard</h2>
          <p className="admin_dashboard_subtitle">
            Manage sessions, courses, results, and academic decisions.
          </p>
        </div>
        <div className="admin_dashboard_actions">
          <button
            className="dash_btn"
            onClick={() => navigate("/admin/student/management")}
          >
            Student Management
          </button>
          <button
            className="dash_btn ghost"
            onClick={() => navigate("/admin/topstudents")}
          >
            Top Students
          </button>
          <button
            className="dash_btn ghost"
            onClick={() => setShowCorrectModal(true)}
          >
            Correct Semester Levels
          </button>
        </div>
      </div>
      <div className="admin_dashboard_stats">
        <div className="stat_card">
          <p>Current session</p>
          <h3>{current_session !== "" && current_session}</h3>
        </div>
        <div className="stat_card">
          <p>Total sessions</p>
          <h3>{total_sessions}</h3>
        </div>
      </div>
      {load && <Loader />}
      <div className="admin_dashboard_boxes">
        <Box
          title={"Course Registration"}
          color={"green"}
          url={"/admin/course-reg/sessions"}
        />
        <Box title={"Results"} color={"gray"} url={"/admin/results/sessions"} />
        <Box
          title={"Faculty Courses"}
          color={"brown"}
          url={"/admin/faculty/courses"}
        />
        <Box
          title={"Non-Professional Courses"}
          color={"blue"}
          url={"/admin/faculty/external"}
        />
        <Box
          title={"Probation Lists"}
          color={"red"}
          url={"/admin/faculty/probation/sessions"}
        />
        <Box
          title={"Error Students"}
          color={"error"}
          url={"/admin/faculty/error/students/sessions"}
        />
        <Box
          title={"Outstanding Failed Courses"}
          color={"finalists"}
          url={"/admin/ofc"}
        />
        <Box
          title={"Professionals"}
          color={"professionals"}
          url={"/admin/professionals/sessions"}
        />
      </div>
      {showCorrectModal && (
        <div className="dash_modal_overlay" role="dialog" aria-modal="true">
          <div className="dash_modal">
            <h3>Correct Semester Levels</h3>
            <p>Select a session and semester to run the correction.</p>
            <div className="dash_modal_fields">
              <label htmlFor="correct-session">Session</label>
              <select
                id="correct-session"
                value={selectedSession}
                onChange={(e) => {
                  setSelectedSession(e.target.value);
                  setSelectedSemester("");
                  setCorrectStatus({ type: "", text: "" });
                }}
              >
                <option value="">Select session</option>
                {sessions.map((sess) => (
                  <option key={sess.session} value={sess.session}>
                    {sess.session}
                  </option>
                ))}
              </select>
            </div>
            <div className="dash_modal_fields">
              <label htmlFor="correct-semester">Semester</label>
              <select
                id="correct-semester"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={!selectedSession || correcting}
              >
                <option value="">Select semester</option>
                <option value="1">First semester</option>
                <option value="2">Second semester</option>
              </select>
            </div>
            {correctStatus.text && (
              <div className={`dash_modal_status ${correctStatus.type}`}>
                {correctStatus.text}
              </div>
            )}
            <div className="dash_modal_actions">
              <button
                className="dash_btn ghost"
                onClick={() => {
                  setShowCorrectModal(false);
                  setCorrectStatus({ type: "", text: "" });
                }}
                disabled={correcting}
              >
                Cancel
              </button>
              <button
                className="dash_btn"
                onClick={handleCorrectSemesterLevels}
                disabled={!selectedSession || !selectedSemester || correcting}
              >
                {correcting ? "Running..." : "Run Correction"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
