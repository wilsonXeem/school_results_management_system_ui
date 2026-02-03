import React, { useState, useEffect, useRef, useMemo } from "react";
import "./topstudents.css";
import Loader from "../../../components/Loader";
import departments from "../../../data/courses";

function TopStudents() {
  const [sessions, setSessions] = useState([]);
  const [current_session, setCurrent_session] = useState("");
  const [classes, setClasses] = useState([]);
  const [current_class, setCurrent_class] = useState("");
  const [students, setStudents] = useState([]);
  const [topLimit, setTopLimit] = useState(10);
  const [current_department, setCurrent_department] = useState("");
  const [load, setLoad] = useState(false);
  const printRef = useRef(null);

  const { displayDepartments, clinicalDeptId, displayDepartmentsMap } = useMemo(() => {
    const entries = Object.entries(departments);
    const hasDept6 = entries.some(([id]) => String(id) === "6");
    const hasDept8 = entries.some(([id]) => String(id) === "8");
    const clinicalId = hasDept6 ? "6" : hasDept8 ? "8" : null;

    const merged = entries
      .filter(([id]) => String(id) !== "8")
      .map(([id, name]) => {
        if (String(id) === "6") {
          return [id, "clinical pharmacy"];
        }
        return [id, name];
      });

    return {
      displayDepartments: merged,
      clinicalDeptId: clinicalId,
      displayDepartmentsMap: Object.fromEntries(merged),
    };
  }, []);

  const loadTopStudents = (limitOverride) => {
    if (!current_class) return;
    const limit = limitOverride ?? topLimit;
    setLoad(true);
    const classObj = classes.find((c) => c.level === current_class);
    if (!classObj?._id) {
      setLoad(false);
      return;
    }
    if (current_department) {
      fetch(
        `http://127.0.0.1:1234/api/class/topstudents/department/${classObj._id}?limit=${limit}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department_id:
              String(current_department) === "6" && clinicalDeptId
                ? clinicalDeptId
                : current_department,
          }),
        }
      )
        .then((res) => res.json())
        .then((json) => {
          setStudents(json.topStudents);
          setLoad(false);
        })
        .catch((err) => {
          console.log(err);
          setLoad(false);
        });
      return;
    }

    fetch(
      `http://127.0.0.1:1234/api/class/topstudents/${classObj._id}?limit=${limit}`
    )
      .then((res) => res.json())
      .then((json) => {
        setStudents(json.topStudents);
        setLoad(false);
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
  };

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
                  setCurrent_department("");
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
                  setCurrent_department("");
                  setLoad(true);
                  fetch(
                    `http://127.0.0.1:1234/api/class/topstudents/${level._id}?limit=${topLimit}`
                  )
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
        <div className="panel panel_full">
          <h3>Departments</h3>
          <div className="panel_row">
            {displayDepartments.map(([deptId, deptName]) => (
              <button
                key={deptId}
                type="button"
                className={`panel_item ${
                  current_department === deptId ? "active" : ""
                }`}
                onClick={() => {
                  if (!current_class) return;
                  setCurrent_department(deptId);
                  setLoad(true);
                  const classObj = classes.find((c) => c.level === current_class);
                  if (!classObj?._id) return;
                  const departmentId =
                    String(deptId) === "6" && clinicalDeptId
                      ? clinicalDeptId
                      : deptId;
                  fetch(
                    `http://127.0.0.1:1234/api/class/topstudents/department/${classObj._id}?limit=${topLimit}`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ department_id: departmentId }),
                    }
                  )
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
                {deptName}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="top_students_table" ref={printRef}>
        <h2>
          Top {topLimit} Students in {current_class} Level, {current_session} Session
          {current_department &&
            ` • ${displayDepartmentsMap[current_department] || departments[current_department]}`}
        </h2>
        <div className="table">
          {students.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Reg No</th>
                  <th>Fullname</th>
                  <th>{current_department ? "Dept Avg" : "CGPA"}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{student.reg_no}</td>
                    <td>{student.fullname}</td>
                    <td>
                      {(() => {
                        const value = current_department
                          ? student.department_gpa
                          : student.cgpa;
                        if (typeof value === "number") return value.toFixed(2);
                        if (value === null || value === undefined) return "--";
                        const parsed = Number(value);
                        return Number.isFinite(parsed)
                          ? parsed.toFixed(2)
                          : "--";
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {students.length > 0 && (
          <div className="top_students_more no_print">
            <button
              type="button"
              className="view_more"
              onClick={() => {
                const nextLimit = topLimit + 10;
                setTopLimit(nextLimit);
                loadTopStudents(nextLimit);
              }}
            >
              View 10 More
            </button>
          </div>
        )}
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
