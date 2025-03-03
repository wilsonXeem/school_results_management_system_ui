import React, { useState, useContext } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { ValueContext } from "../../Context";

import unn from "../../data/unn.png";

function PasswordReset() {
  const navigate = useNavigate();
  const { setAlert } = useContext(ValueContext);
  const [email, setEmail] = useState("");
  const [reg_no, setReg_no] = useState("");
  const [password, setPassword] = useState("");
  const [password_match, setPassword_match] = useState("");
  const [code, setCode] = useState("");

  const handle_submit = () => {
    fetch("http://127.0.0.1:1234/api/auth/student/passwordreset", {
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
      .then((json) => navigate(`/student`));
  };

  const handle_code = () => {
    fetch(`http://127.0.0.1:1234/api/auth/student/code/${email}`)
      .then((res) => res.json())
      .then((json) => setAlert(true, json.message, "success"));
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

      <h2>Password reset</h2>

      <div class="admin_login_form">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handle_code}>Get code</button>
        </div>
        <input
          type="text"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Confirm password"
          value={password_match}
          onChange={(e) => setPassword_match(e.target.value)}
        />
        <button onClick={handle_submit}>Submit</button>
      </div>
    </div>
  );
}

export default PasswordReset;
