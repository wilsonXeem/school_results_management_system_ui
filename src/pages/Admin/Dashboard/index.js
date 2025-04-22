import React, { useState, useEffect } from "react";
import Box from "./components/Box";
import "./dashboard.css";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [current_session, setCurrent_session] = useState("");
  const [load, setLoad] = useState(false);
  const [total_sessions, setTotal_sessions] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoad(true);
    fetch("http://127.0.0.1:1234/api/sessions/")
      .then((res) => res.json())
      .then((json) => {
        setCurrent_session(
          json.sessions.find((session) => session.current === true).session
        );
        setTotal_sessions(json.sessions.length);
        setLoad(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="admin_dashboard">
      <div class="admin_dashboard_header">
        <h2>Faculty Admin Dashboard</h2>
      </div>
      <div class="admin_dashboard_current_session">
        <div>
          <p>Current session: </p>
          <h2>{current_session !== "" && current_session}</h2>
          <p>Total sessions:</p>
          <h2>{total_sessions}</h2>
        </div>
        <button onClick={() => navigate("/admin/student/management")}>
          Search student
        </button>
        <button
          onClick={() => navigate("/admin/topstudents")}
          style={{ marginLeft: "1rem" }}
        >
          Top student
        </button>
      </div>
      {load && <Loader />}
      <div class="admin_dashboard_boxes">
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
          title={"Professionals"}
          color={"professionals"}
          url={"/admin/professionals/sessions"}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
