import React, { useState, useContext } from "react";
import "./searchstudent.css";
import { ValueContext } from "../../../Context";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";

function SearchStudent() {
  const navigate = useNavigate();
  const { socket } = useContext(ValueContext);
  const [reg_no, setReg_no] = useState("");
  const [students, setStudents] = useState([]);
  const [show, setShow] = useState(false);

  socket.on("search", (result) => setStudents(result.student));

  const handle_search = () => {
    setShow(true);
    socket.emit("search_student", { reg_no });
    setShow(false);
  };

  return (
    <div class="search_student">
      <div class="header">
        <h2>Search student</h2>
      </div>
      {show && <Loader />}

      <div class="search_student_input">
        <p>Input student registration number:</p>
        <div>
          <input
            type="text"
            placeholder="Reg. No."
            value={reg_no}
            onChange={(e) => setReg_no(e.target.value)}
          />
          <button onClick={handle_search}>search</button>
        </div>
      </div>
      <div class="search_result">
        <h2>Result:</h2>
        <div class="student_result">
          {students.map((student) => (
            <h3 onClick={() => navigate(`/admin/student/${student._id}`)}>
              {student.fullname} {student.reg_no}
            </h3>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchStudent;
