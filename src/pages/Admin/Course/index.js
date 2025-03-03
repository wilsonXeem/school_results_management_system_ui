import React, { useEffect, useState, useContext } from "react";
import levels from "../../../data/levels";
import units from "../../../data/units";
import { useParams } from "react-router-dom";
import "./course.css";
import Table from "./components/Table";
import useExcelParser from "./components/useExcelParser";
import { ValueContext } from "../../../Context";
import Loader from "../../../components/Loader";

function Course() {
  const { session, level, semester, code } = useParams();
  const course_title = levels[level][semester][code];
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

  // socket.on("students", (res) => {
  //   setStudents(res.students);
  //   setLoad(false);
  // });

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
        level,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        setAlert(true, `scores entered successfully!`, "success");
        setLoad(false);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="single_course">
      <div className="header">
        <h2>
          {code} {course_title}
        </h2>
      </div>
      <div className="current_session">
        <p>Session:</p>
        <h3>{session}</h3>
        <p>Level:</p>
        <h3>{level} Level</h3>
        <p>Semester:</p>
        <h3>{semester === "1" ? "First semster" : "Second semester"}</h3>
        <p>Unit load:</p>
        <h3>{units[code]}</h3>
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
          onClick={() => {
            handle_result_upload();
            setLoad(true);
          }}
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

export default Course;
