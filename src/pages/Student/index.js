import React, { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

import unn from "../../data/unn.png";

function Student() {
  const navigate = useNavigate();
  const [reg_no, setReg_no] = useState("");
  const [password, setPassword] = useState("");

  const handle_login = () => {
    fetch("http://127.0.0.1:1234/api/auth/student/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reg_no,
        password,
      }),
    })
      .then((res) => res.json())
      .then((json) =>
        json.student.verified
          ? navigate(`/student/dashboard/${json.student._id}`)
          : navigate(`/student/details/${json.student._id}`)
      );
  };
  return (
    <div class="admin_login">
      <div class="admin_login_logos">
        <div class="admin_login_logo">
          <img src={unn} alt="unn_logo" />
        </div>
      </div>
      <div class="admin_login_title">
        <h1>Faculty of Pharmaceutical Sciences</h1>
        <h2>University of Nigeria Nsukka</h2>
      </div>

      <h2>Student Login</h2>

      <div class="admin_login_form">
        <input
          type="text"
          placeholder="Reg. No"
          value={reg_no}
          onChange={(e) => setReg_no(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handle_login}>Submit</button>
      </div>
      <div className="change_password">
        <p onClick={() => navigate("/student/password/reset")}>
          Click <b>here</b> to change password
        </p>
      </div>
    </div>
  );
}

export default Student;
