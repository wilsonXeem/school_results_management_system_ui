import React, { useState, useContext } from "react";
import "./index.css";
import unn from "../../data/unn.png";
import { ValueContext } from "../../Context";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

function Admin() {
  const navigate = useNavigate();
  const { setAlert } = useContext(ValueContext);
  const [show, setShow] = useState(false);
  const [otp, setotp] = useState("");

  const request_otp = () => {
    fetch(`${API_BASE_URL}/api/auth/admin/passkey`)
      .then((res) => res.json())
      .then((json) => {
        setShow(true);
        setAlert(true, json.message, "success");
      })
      .catch((err) => console.log(err));
  };

  const handle_signin = () => {
    fetch(`${API_BASE_URL}/api/auth/admin/signin/${otp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          localStorage.setItem("token", json.token);
          navigate("/admin/dashboard");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="admin_login">
      <div className="admin_login_logos">
        <div className="admin_login_logo">
          <img src={unn} alt="unn_logo" />
        </div>
      </div>
      <div className="admin_login_title">
        <h1>Faculty of Pharmaceutical Sciences</h1>
        <h2>University of Nigeria Nsukka</h2>
      </div>

      <h2>Admin login</h2>

      <div className="admin_login_form">
        <input type="text" value="wilsonzim566@gmail.com" disabled />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setotp(e.target.value)}
        />
        {!show && <button onClick={request_otp}>Request OTP</button>}
        {show && <button onClick={handle_signin}>Submit</button>}
      </div>
    </div>
  );
}

export default Admin;
