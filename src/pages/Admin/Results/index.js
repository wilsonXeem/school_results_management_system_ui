import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./level.css";
import Table from "./components/Table";
import ExportToExcel from "../../../components/ExportToExcel";
import Header from "../../../components/Header";

function Results() {
  const target = useRef();
  const { level, semester, session, class_id } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:1234/api/class/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_id,
        session,
        semester,
        level
      }),
    })
      .then((res) => res.json())
      .then((json) => setStudents(json.students))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Header />
      <div
        class="current_level"
        ref={target}
        id="pageContent"
        style={{ textAlign: "center" }}
      >
        <div class="header">
          <h2>
            {session}: {level} Level:{" "}
            {semester === "1" ? "first semester" : "second semester"} results
          </h2>
        </div>
        {students.length > 0 && <Table students={students} />}
      </div>
      <div class="gp_tab no_print">
        <div class="transcript_btn">
          <button onClick={() => window.print()}>Print</button>
        </div>
        <div>
          <ExportToExcel
            tableId="myTable"
            filename={`${session}: ${level} Level:${" "}
            ${semester === "1" ? "first semester" : "second semester"} results`}
          />
        </div>
      </div>
    </>
  );
}

export default Results;
