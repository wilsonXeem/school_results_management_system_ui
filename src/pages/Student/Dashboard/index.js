import React, { useState, useEffect, useContext } from "react";
// import "./studentdashboard.css";
import unn from "../../../data/unn.png";
import Table from "./ocmponents/Table";
import GPtable from "./ocmponents/GPtable";
import { useParams, useNavigate } from "react-router-dom";
import { ValueContext } from "../../../Context";

function StudentDashboard() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { socket, setAlert } = useContext(ValueContext);
  const [session, setSession] = useState({});
  const [student, setStudent] = useState({});
  const [courses, setCourses] = useState([]);
  const [gpa, setGpa] = useState("");
  const [total_semesters, setTotal_semesters] = useState([]);
  const [email, setEmail] = useState("");
  const amount = 200000;
  const publicKey = "pk_test_12bc757a4ffd6f94184fcbb079b67bdf1885a312";

  useEffect(() => {
    socket.emit("student", { _id });
  }, []);

  socket.on("student", (res) => {
    setStudent(res.student);
    setEmail(res.student.email);
    setTotal_semesters(res.student.total_semesters);
    setSession(
      res.student.total_semesters[res.student.total_semesters.length - 1]
    );
    setCourses(
      res.student.total_semesters[res.student.total_semesters.length - 1]
        .courses
    );
    setGpa(
      res.student.total_semesters[res.student.total_semesters.length - 1].gpa
    );
  });

  const componentProps = {
    email,
    amount,
    publicKey,
    text: "Generate transcript",
    onSuccess: () => navigate(`/student/transcript/${session.session}/${_id}`),
    onClose: () =>
      setAlert(
        true,
        "Payment cancelled! Can't continue with process.",
        "danger"
      ),
  };

  return (
    <div class="student_dashboard">
      <div class="student_dashboard_head">
        <div class="passport">
          <div class="passport_img">
            <img src={unn} alt="" />
          </div>
        </div>
        <div class="dashboard_header">
          <div class="student_dashboard_head_title">
            <h2>Faculty of Pharmaceutical Sciences</h2>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "larger",
                marginTop: "0.5rem",
              }}
            >
              University of Nigeria Nsukka
            </p>
            <h2>Semester Statement of Result</h2>
            <i>(This is not a transcript)</i>
          </div>
        </div>
        <div class="passport">
          <div class="passport_img">
            <img src={student.profile_image} alt="" />
          </div>
        </div>
      </div>
      <div class="student_dashboard_body">
        <div class="student_dashboard_body_details">
          <p>
            Name: <b>{student.fullname}</b>
          </p>
          <p>
            Reg. No: <b>{student.reg_no}</b>
          </p>
          <p>
            Programme: <b>Pharm. D</b>
          </p>
          <p>
            Session:{" "}
            <b>
              <select
                onChange={(e) => {
                  if (total_semesters[e.target.value])
                    setSession(total_semesters[e.target.value]);
                  setCourses(total_semesters[e.target.value].courses);
                  setGpa(total_semesters[e.target.value].gpa);
                }}
              >
                <option>{session.session}</option>
                {total_semesters.map((semester, i) => (
                  <option value={i}>
                    {semester.session}- {semester.semester}
                  </option>
                ))}
              </select>
            </b>
          </p>
          <p>
            Level: <b>{session.level}</b>
          </p>
          <p>
            Semester: <b>{session.semester === 1 ? "first" : "second"}</b>
          </p>
        </div>
        {courses.length > 0 && <Table courses={courses} />}
        <GPtable
          cgpa={student.cgpa}
          gpa={gpa}
          id={student._id}
          componentProps={componentProps}
        />
      </div>
    </div>
  );
}

export default StudentDashboard;
