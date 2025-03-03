import { useState } from "react";
import "./StudentManagement.css";
import { useNavigate } from "react-router-dom";

const StudentManagement = () => {
  const navigate = useNavigate();
  const [regNo, setRegNo] = useState("");
  const [fullname, setFullname] = useState("");
  const [moe, setMOE] = useState("");
  const [session, setSession] = useState("");
  const [semester, setSemester] = useState("");
  const [level, setLevel] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [message, setMessage] = useState("");
  const [student, setStudent] = useState({});

  const handleRequest = async (endpoint, body, method) => {
    setMessage("");
    setStudent({});
    const response = await fetch(
      `http://127.0.0.1:1234/api/student/${endpoint}`,
      {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    setMessage(data.message || JSON.stringify(data));
    if (data.student) setStudent(data.student);
  };

  return (
    <div className="edit_student">
      <div className="student-management">
        <h2>Student Management</h2>
        <input
          type="text"
          placeholder="Reg No"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Session"
          value={session}
          onChange={(e) => setSession(e.target.value)}
        />
        <input
          type="text"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <input
          type="text"
          placeholder="Level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course Code"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mode of Entry"
          value={moe}
          onChange={(e) => setMOE(e.target.value)}
        />
        <button
          onClick={() => handleRequest(`search`, { reg_no: regNo }, "POST")}
        >
          Search Student
        </button>
        <button
          onClick={() =>
            handleRequest("update-name", { reg_no: regNo, fullname }, "PUT")
          }
        >
          Update Name
        </button>
        <button
          onClick={() =>
            handleRequest("moe/update", { reg_no: regNo, moe }, "PUT")
          }
        >
          Update Mode of Entry
        </button>
        <button
          onClick={() =>
            handleRequest(
              "update-semester-level",
              {
                reg_no: regNo,
                session,
                semester,
                level,
              },
              "PUT"
            )
          }
        >
          Update Semester Level
        </button>
        <button
          onClick={() =>
            handleRequest(
              "remove-semester",
              { reg_no: regNo, session, semester },
              "DELETE"
            )
          }
        >
          Remove Semester
        </button>
        <button
          onClick={() =>
            handleRequest(
              "remove-session",
              { reg_no: regNo, session },
              "DELETE"
            )
          }
        >
          Remove Session
        </button>
        <button
          onClick={() =>
            handleRequest(
              "remove-course",
              {
                reg_no: regNo,
                session,
                semester,
                course_code: courseCode,
              },
              "DELETE"
            )
          }
        >
          Remove Course
        </button>
        <button
          onClick={() =>
            handleRequest("remove-student", { reg_no: regNo }, "DELETE")
          }
        >
          Remove Student
        </button>
      </div>
      <div>
        {" "}
        <p>{message}</p>
        {student._id && (
          <p
            onClick={() => navigate(`/admin/student/${student?._id}`)}
            style={{ cursor: "pointer" }}
          >
            {student.fullname} {student.reg_no}
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
