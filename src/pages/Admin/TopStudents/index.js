import React, { useState, useEffect, useRef } from "react";
import "./topstudents.css";
import Loader from "../../../components/Loader";

function TopStudents() {
  const [sessions, setSessions] = useState([]);
  const [current_session, setCurrent_session] = useState("");
  const [classes, setClasses] = useState([]);
  const [current_class, setCurrent_class] = useState("");
  const [students, setStudents] = useState([]);
  const [load, setLoad] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    setLoad(true);
    fetch("http://127.0.0.1:1234/api/sessions/")
      .then((res) => res.json())
      .then((json) => {
        setSessions(json.sessions);
        setLoad(false);
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
  }, []);

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Top 10 Students in ${current_class} Level, ${current_session} Session</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; border: 1px solid black; text-transform: uppercase; }
            th { background-color:#000000; color: white; text-align: left; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="top_students">
      <div className="top_students_toolbar no_print">
        <div className="panel">
          <h3>Sessions</h3>
          <div className="panel_row">
            {sessions.map((session) => (
              <button
                key={session.session}
                type="button"
                className={`panel_item ${
                  current_session === session.session ? "active" : ""
                }`}
                onClick={() => {
                  setClasses(session.classes || []);
                  setCurrent_session(session.session);
                  setCurrent_class("");
                  setStudents([]);
                }}
              >
                {session.session}
              </button>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3>Classes</h3>
          <div className="panel_row">
            {classes.map((level) => (
              <button
                key={level._id}
                type="button"
                className={`panel_item ${
                  current_class === level.level ? "active" : ""
                }`}
                onClick={() => {
                  setCurrent_class(level.level);
                  setLoad(true);
                  fetch(`http://127.0.0.1:1234/api/class/topstudents/${level._id}`)
                    .then((res) => res.json())
                    .then((json) => {
                      setStudents(json.topStudents);
                      setLoad(false);
                    })
                    .catch((err) => {
                      console.log(err);
                      setLoad(false);
                    });
                }}
              >
                {level.level} Level
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="top_students_table" ref={printRef}>
        <h2>
          Top 10 Students in {current_class} Level, {current_session} Session
        </h2>
        <div className="table">
          {students.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Reg No</th>
                  <th>Fullname</th>
                  <th>CGPA</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{student.reg_no}</td>
                    <td>{student.fullname}</td>
                    <td>{student.cgpa.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {load && <Loader />}

      {students.length > 0 && (
        <button className="print-btn no_print" onClick={handlePrint}>
          Print Top Students
        </button>
      )}
    </div>
  );
}

export default TopStudents;
