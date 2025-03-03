import React, { useState, useContext } from "react";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import { ValueContext } from "../../Context";

import unn from "../../data/unn.png";

function DetailsUpdate() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const { setAlert } = useContext(ValueContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_match, setPassword_match] = useState("");
  const [previewImage, setPreviewImage] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [code, setCode] = useState("");
  let file;

  const imageChange = (e) => {
    if (e.target.files) {
      file = e.target.files[0];
      setPreviewImage([
        ...previewImage,
        URL.createObjectURL(e.target.files[0]),
      ]);
    }
    setSelectedFile(file);
  };

  const handle_submit = () => {
    if (password === password_match) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("email", email);
      formData.append("password", password);

      fetch(`http://127.0.0.1:1234/api/auth/student/details/update/${_id}`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((json) => navigate(`/student`));
    } else setAlert(true, "Passwords don't match", "danger");
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

      <h2>Student details update</h2>
      <p>Enter your email, upload your passport and change your password</p>

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
        <input type="file" placeholder="passport" onChange={imageChange} />
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

export default DetailsUpdate;
