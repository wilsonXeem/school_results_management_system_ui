import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import levels from "../../../data/levels";
import external_courses from "../../../data/external_courses";
import external_units from "../../../data/external_units";
import units from "../../../data/units";
// import "./level.css";
import Table from "./components/Table";
import useExcelParser from "./components/useExcelParser";
import { ValueContext } from "../../../Context";
import Loader from "../../../components/Loader";

function Level() {
  const { level, semester, class_id, session } = useParams();
  const current_semester = levels[level][semester];
  const course_code = Object.keys(current_semester);
  const course_title = Object.values(current_semester);
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const { data, parseExcel } = useExcelParser();
  const { setAlert } = useContext(ValueContext);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const external_codes = Object.keys(external_courses);
  const external_titles = Object.values(external_courses);

  const [reg_no, setReg_no] = useState("");
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [unit_load, setUnit_load] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:1234/api/class/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_id,
        semester,
        level,
        session,
      }),
    })
      .then((res) => res.json())
      .then((json) => setStudents(json.students))
      .catch((err) => console.log(err));
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      parseExcel(file);
    }
  };

  const handle_course_reg = () => {
    setLoad(true);
    fetch("http://127.0.0.1:1234/api/class/register", {
      method: "POST",
      body: JSON.stringify({
        students: data,
        level,
        course_title: current_semester[selectedCourse],
        course_code: selectedCourse,
        unit_load: units[selectedCourse],
        semester,
        session,
        class_id,
        external: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setStudents(json.students);
        setAlert(true, `all students registered!`, "success");
        setLoad(false);
        // window.location.reload()
      })
      .catch((err) => console.log(err));
  };

  const handle_external_course = () => {
    fetch("http://127.0.0.1:1234/api/class/external", {
      method: "POST",
      body: JSON.stringify({
        students: data,
        level,
        course_title: external_courses[selectedCourse],
        course_code: selectedCourse,
        unit_load: external_units[selectedCourse],
        semester,
        session,
        class_id,
        external: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setStudents(json.students);
        setLoad(false);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div class="current_level">
      <div class="header">
        <h2>
          {level} Level:{" "}
          {semester === "1" ? "first semester" : "second semester"}
        </h2>
      </div>
      <div class="course_reg_upload">
        <p>Register course:</p>
        <select
          name="course"
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option>Select course</option>
          {course_code.map((course, key) => (
            <option value={course}>
              <span>{course}</span> {course_title[key]}
            </option>
          ))}
        </select>
        <p style={{ textAlign: "center" }}>
          Unit load: <b>{units[selectedCourse]}</b>
        </p>
        {/* <input type="number" placeholder="Unit load"/> */}
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <button
          onClick={() => {
            handle_course_reg();
            setLoad(true);
          }}
        >
          Upload
        </button>
        <button onClick={() => setShow(true)}>Add external course</button>
      </div>
      {show && (
        <div class="external_course_reg_upload">
          <p>Register external course:</p>
          <select
            name="course"
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option>Select course</option>
            {external_codes.map((course, key) => (
              <option value={course}>
                <span>{course}</span> {external_titles[key]}{" "}
                {external_units[course]}
              </option>
            ))}
          </select>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          <button
            onClick={() => {
              handle_external_course();
              setLoad(true);
            }}
          >
            Register
          </button>
          <button
            style={{ backgroundColor: "red" }}
            onClick={() => setShow(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {load && <Loader />}
      {students.length > 0 && <Table students={students} />}
    </div>
  );
}

export default Level;
