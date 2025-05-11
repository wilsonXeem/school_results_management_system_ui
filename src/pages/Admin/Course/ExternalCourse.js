import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./course.css";
import Table from "./components/Table";
import useExcelParser from "./components/useExcelParser";
import { ValueContext } from "../../../Context";
import Loader from "../../../components/Loader";

function OtherCourse() {
  const { session, semester, code, title, unit } = useParams();
  const [students, setStudents] = useState([]);
  const { socket, setAlert } = useContext(ValueContext);
  const { data, parseExcel } = useExcelParser();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    fetch(`http://127.0.0.1:1234/api/class/${session}/${semester}/${code}`)
      .then((res) => res.json())
      .then((json) => {
        setStudents(json);
        setLoad(false);
      });
  }, []);

  socket.on("students", (res) => setStudents(res.students));

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) parseExcel(file);
  };

  const handle_result_upload = () => {
    setLoad(true);
    fetch("http://127.0.0.1:1234/api/class/score", {
      method: "POST",
      body: JSON.stringify({
        students: data,
        session,
        semester,
        course_code: code,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        window.location.reload();
        setLoad(false);
      })
      .catch((err) => console.log(err));

    setAlert(true, "scores added successfully!", "success");
  };
  return (
    <div className="single_course">
      <div className="header">
        <h2>
          {code} {title}
        </h2>
      </div>
      <div className="current_session">
        <p>Session:</p>
        <h3>{session}</h3>
        <p>Semester:</p>
        <h3>{semester === "1" ? "First semster" : "Second semester"}</h3>
        <p>Unit load</p>
        <h3>{unit}</h3>
        <p>Upload result:</p>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <h4
          style={{
            margin: "0rem",
            background: "#020263",
            color: "white",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
          onClick={handle_result_upload}
        >
          Upload
        </h4>
      </div>
      {load && <Loader />}
      <Table
        students={students}
        session={session}
        semester={semester}
        code={code}
        socket={socket}
      />
    </div>
  );
}

export default OtherCourse;
