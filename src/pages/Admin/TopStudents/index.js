import React, { useState, useEffect, useRef } from "react";

function TopStudents() {
  const [sessions, setSessions] = useState([]);
  const [current_session, setCurrent_session] = useState("");
  const [classes, setClasses] = useState([]);
  const [current_class, setCurrent_class] = useState("");
  const [students, setStudents] = useState([]);
  const printRef = useRef(null);

  useEffect(() => {
    fetch("http://127.0.0.1:1234/api/sessions/")
      .then((res) => res.json())
      .then((json) => {
        setSessions(json.sessions);
      })
      .catch((err) => console.log(err));
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
      <div className="sessions">
        <h2>Sessions</h2>
        {sessions.map((session, index) => (
          <p
            key={index}
            onClick={() => {
              setClasses(session.classes);
              setCurrent_session(session.session);
            }}
            style={{ cursor: "pointer" }}
          >
            {session.session}
          </p>
        ))}
      </div>

      <div className="classes">
        <h2>Classes</h2>
        <h3>Session: {current_session}</h3>
        {classes.map((level, index) => (
          <p
            key={index}
            onClick={() => {
              setCurrent_class(level.level);
              fetch(`http://127.0.0.1:1234/api/class/topstudents/${level._id}`)
                .then((res) => res.json())
                .then((json) => setStudents(json.topStudents));
            }}
            style={{ cursor: "pointer" }}
          >
            {level.level}
          </p>
        ))}
      </div>

      <div className="top_students" ref={printRef}>
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

      {students.length > 0 && (
        <button className="print-btn" onClick={handlePrint}>
          Print Top Students
        </button>
      )}
    </div>
  );
}

export default TopStudents;
