import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./level.css";
import Table from "./components/Table";
import ExportToExcel from "../../../components/ExportToExcel";
import Header from "../../../components/Header";
import Loader from "../../../components/Loader";
import { API_BASE_URL } from "../../../config/api";

function ErrorStudents() {
  const target = useRef();
  const { level, session, _id } = useParams();
  const [students, setStudents] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    fetch(`${API_BASE_URL}/api/class/error`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_id: _id,
        level,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setStudents(json.students);
        setLoad(false);
      })
      .catch((error) => {
        console.log(error);
        setLoad(false);
      });
  }, [_id, level]);

  return (
    <>
      <Header />
      <div
        className="current_level"
        ref={target}
        id="pageContent"
        style={{ textAlign: "center" }}
      >
        <div className="header">
          <h2>
            {session}: {level} error students list
          </h2>
        </div>
        {load && <Loader />}
        {students.length > 0 && <Table students={students} />}
      </div>
      <div className="gp_tab no_print">
        <div className="transcript_btn">
          <button onClick={() => window.print()}>Print</button>
        </div>
        <div>
          <ExportToExcel
            tableId="myTable"
            filename={`${session}: ${level} Level: error students list`}
          />
        </div>
      </div>
    </>
  );
}

export default ErrorStudents;
