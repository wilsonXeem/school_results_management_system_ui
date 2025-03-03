import React, { useState, useRef, useEffect, useContext } from "react";
// import "./transcript.css";
import unn from "../../../data/unn.png";
import Table from "./components/Table";
import { useParams } from "react-router-dom";
import { ValueContext } from "../../../Context";
import professionals from "../../../data/professionals";

import generatePDF from "react-to-pdf";

function Transcript() {
  const target = useRef();
  const { _id } = useParams();
  const { socket } = useContext(ValueContext);
  const [student, setStudent] = useState({});
  const [session, setSession] = useState("");
  const [level, setLevel] = useState("");
  const [first_semester, setFirst_semester] = useState([]);
  const [second_semester, setSecond_semester] = useState([]);
  const [first_external, setFirst_external] = useState([]);
  const [second_external, setSecond_external] = useState([]);

  useEffect(() => {
    socket.emit("student", { _id });
  }, []);

  socket.on("student", (res) => {
    setStudent(res.student);
    setSession(
      res.student.total_semesters[res.student.total_semesters.length - 1]
        .session
    );
    setLevel(
      res.student.total_semesters[res.student.total_semesters.length - 1].level
    );
    setFirst_semester(
      res.student.total_semesters[
        res.student.total_semesters.length - 1
      ].courses.filter((course) => course.course_code in professionals)
    );
    res.student.total_semesters[res.student.total_semesters.length - 2] &&
      setSecond_semester(
        res.student.total_semesters[
          res.student.total_semesters.length - 2
        ].courses.filter((course) => course.course_code in professionals)
      );
    res.student.total_semesters[res.student.total_semesters.length - 1] &&
      setFirst_external(
        res.student.total_semesters[
          res.student.total_semesters.length - 1
        ].courses.filter((course) => !(course.course_code in professionals))
      );
    res.student.total_semesters[res.student.total_semesters.length - 2] &&
      setSecond_external(
        res.student.total_semesters[
          res.student.total_semesters.length - 2
        ].courses.filter((course) => !(course.course_code in professionals))
      );
  });

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;

  return (
    <>
      <div class="student_db" id="transcript" ref={target}>
        <div class="student_dashboard_head">
          <div class="passport">
            <div class="passport_img">
              <img src={unn} alt="" />
            </div>
          </div>
          <div class="dashboard_header">
            {/* <div class="student_dashboard_header_img">
            <img src={unn} alt="" />
          </div> */}
            <div class="student_dashboard_head_title">
              <h2>Faculty of Pharmaceutical Sciences</h2>
              <p style={{ fontWeight: "bold", fontSize: "larger" }}>
                University of Nigeria Nsukka
              </p>
              <h2>Semester Statement of Result</h2>
            </div>
          </div>
          <div class="passport">
            <div class="passport_img">
              <img src={student.profile_image} alt="" />
            </div>
          </div>
        </div>
        <div class="student_dashboard_bod">
          <div class="student_dashboard_body_details">
            <p>
              Name of Student: <b>{student.fullname}</b>
            </p>
            <p>
              Reg. No: <b>{student.reg_no}</b>
            </p>
            <p>
              Programme: <b>Pharm. D</b>
            </p>
            <p>
              Session: <b>{session}</b>
            </p>
            <p>
              Level: <b>{level}</b>
            </p>
          </div>

          <Table
            level={level}
            first_semester={first_semester}
            second_semester={second_semester}
            first_external={first_external}
            second_external={second_external}
          />
          {/* <GPtable
            generatePDF={generatePDF}
            target_element={target_element}
            options={options}
          /> */}
        </div>
        <div class="gp_tab">
          <div class="transcript_btn"></div>
          <div style={{ textTransform: "uppercase" }}>
            <div class="cummulative_grade">
              <p>cummulative grade point avarage:</p>
              <h3>{student.cgpa}</h3>
            </div>
            <div class="total_grade">
              <p>cummulative grade points:</p>
              <h3>{student.cgpa}</h3>
            </div>
          </div>
        </div>
        <div class="signature">
          <div class="exam_office">
            <p
              style={{
                fontSize: "large",
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
            >
              chukwuma chinyere p. {formattedToday}
            </p>
            <p style={{ borderTop: "1px dotted black" }}>
              Name and Signature of Examination Officer (with date)
            </p>
          </div>
          <div class="dean">
            <p
              style={{
                fontSize: "large",
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
            >
              Prof. c. s. Nworu {formattedToday}
            </p>
            <p style={{ borderTop: "1px dotted black" }}>
              Name & Signature of Dean (with date)
            </p>
          </div>
        </div>
      </div>

      <div class="gp_tab">
        <div class="transcript_btn">
          <button
            onClick={() => generatePDF(target, { filename: "transcript.pdf" })}
          >
            Print
          </button>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default Transcript;
