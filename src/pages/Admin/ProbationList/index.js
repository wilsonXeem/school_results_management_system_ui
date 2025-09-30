import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import "./level.css";
import Table from "./components/Table";
import { ValueContext } from "../../../Context";
import ExportToExcel from "../../../components/ExportToExcel";
import Header from "../../../components/Header";
import Loader from "../../../components/Loader";

function ProbationList() {
  const target = useRef();
  const { level, semester, session, _id } = useParams();
  const [students, setStudents] = useState([]);
  const [load, setLoad] = useState(false);
  const { socket } = useContext(ValueContext);

  useEffect(() => {
    setLoad(true);
    fetch("http://127.0.0.1:1234/api/class/probation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_id: _id,
        level,
        session,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setStudents(json.students);
        setLoad(false);
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
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
            {session}: {level} Level probation list
          </h2>
        </div>
        {load && <Loader />}
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
            probation list`}
          />
        </div>
      </div>
    </>
  );
}

export default ProbationList;
