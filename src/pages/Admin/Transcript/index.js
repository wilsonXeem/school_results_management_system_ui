import React, { useState, useRef, useEffect } from "react";
import unn from "../../../data/unn.png";
import Table from "./components/Table";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";

import generatePDF from "react-to-pdf";

function AdminTranscript() {
  const target = useRef();
  const { _id, sesion, level } = useParams();
  const [student, setStudent] = useState({});
  const [transcriptType, setTranscriptType] = useState("faculty");
  const [overallUnits, setOverallUnits] = useState(0);
  const [overallGp, setOverallGp] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/student/results/session/${_id}/${sesion}`)
      .then((res) => res.json())
      .then((json) => {
        setStudent(json);
        setOverallUnits(Number(json?.overall_units) || 0);
        setOverallGp(Number(json?.overall_gp) || 0);
      })
      .catch((err) => console.log(err));
  }, [_id, sesion]);

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;

  return (
    <div>
      <div
        className="no_print"
        style={{
          position: "sticky",
          top: "12px",
          zIndex: 10,
          backgroundColor: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
          border: "1px solid #cbd5e1",
          margin: "1rem auto",
          maxWidth: "820px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ fontWeight: "600", color: "#334155" }}>
            Transcript Type
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setTranscriptType("university")}
              style={{
                padding: "4px 10px",
                border: "none",
                backgroundColor:
                  transcriptType === "university" ? "#007bff" : "#e9ecef",
                color: transcriptType === "university" ? "white" : "#333",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "4px",
              }}
            >
              University
            </button>
            <button
              onClick={() => setTranscriptType("faculty")}
              style={{
                padding: "4px 10px",
                border: "none",
                backgroundColor:
                  transcriptType === "faculty" ? "#007bff" : "#e9ecef",
                color: transcriptType === "faculty" ? "white" : "#333",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "4px",
              }}
            >
              Faculty
            </button>
          </div>
        </div>
        <button
          onClick={() =>
            generatePDF(target, {
              filename: `${student.fullname} ${sesion} result`,
            })
          }
          style={{
            padding: "4px 10px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        >
          Print
        </button>
      </div>
      <div className="student_db" id="transcript" ref={target}>
        <div className="d_head">
          <div className="student_dashboard_head">
            <div className="passport">
              <div className="passport_img">
                <img src={unn} alt="" />
              </div>
            </div>
            <div className="dashboard_header">
              {/* <div className="student_dashboard_header_img">
            <img src={unn} alt="" />
          </div> */}
              <div className="student_dashboard_head_title">
                {transcriptType === "university" ? (
                  <>
                    <p>University of Nigeria, Nsukka</p>
                    <p>Office of the Registrar (Examinations Unit)</p>
                    <p>
                      Doctor of Pharmacy Professional Examination Results Sheet
                    </p>
                  </>
                ) : (
                  <>
                    <p>University of Nigeria Nsukka</p>
                    <p>Faculty of Pharmaceutical Sciences</p>
                    <p>PHARMD PROFESSIONAL EXAMINATION RESULT SHEET</p>
                  </>
                )}
                <i style={{ fontSize: "x-large", fontWeight: "bold" }}>
                  {transcriptType === "faculty" ? "(Faculty Copy)" : ""}
                </i>
              </div>
            </div>
            <div className="passport">
              <div className="passport_img">
                <img src={student.profile_image} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="student_dashboard_bod">
          <div className="student_dashboard_body_details">
              <p>
                Name of Student: <b>{student.fullname}</b>
              </p>
            <p>
              Reg. No: <b>{student.reg_no}</b>
            </p>
            <p>
              Session: <b>{sesion}</b>
            </p>
            <p>
              Level: <b>{level}</b>
            </p>
            <p>
              mode of entry: <b>{student.moe}</b>
            </p>
          </div>

          <Table
            level={level}
            first_semester={student.first_semester}
            second_semester={student.second_semester}
            first_external={student.first_external}
            second_external={student.second_external}
            transcriptType={transcriptType}
            overall_units={overallUnits}
            overall_gp={overallGp}
            session_cgpa={student.session_cgpa}
            overall_cgpa={student.cgpa}
          />
          {/* <GPtable
            generatePDF={generatePDF}
            target_element={target_element}
            options={options}
          /> */}
        </div>
        <div className="gp_tab">
          <div className="transcript_btn"></div>
        </div>
        <div
          className="signature"
          style={
            transcriptType === "university" && Number(level) === 600
              ? {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "3rem",
                }
              : undefined
          }
        >
          {transcriptType === "university" ? (
            Number(level) === 600 ? (
              <>
                <div className="exam_office">
                  <p
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      minHeight: "1.2rem",
                    }}
                  >
                    &nbsp;
                  </p>
                  <p style={{ borderTop: "1px dotted black" }}>
                    Name and Signature of Computing Officer (with Date)
                  </p>
                </div>
                <div className="dean">
                  <p
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      minHeight: "1.2rem",
                    }}
                  >
                    &nbsp;
                  </p>
                  <p style={{ borderTop: "1px dotted black" }}>
                    Name and Signature of Cross-checking Officer (with Date)
                  </p>
                </div>
                <div className="exam_office">
                  <p
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      minHeight: "1.2rem",
                    }}
                  >
                    &nbsp;
                  </p>
                  <p style={{ borderTop: "1px dotted black" }}>
                    Name and Signature of Certifying Officer (with Date)
                  </p>
                </div>
                <div className="dean">
                  <p
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      minHeight: "1.2rem",
                    }}
                  >
                    &nbsp;
                  </p>
                  <p style={{ borderTop: "1px dotted black" }}>
                    Name and Signature of Dean of the Faculty (with Date)
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="exam_office">
                  <p
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      minHeight: "1.2rem",
                    }}
                  >
                    &nbsp;
                  </p>
                  <p style={{ borderTop: "1px dotted black" }}>
                    Name and Signature of Computing Officer (with Date)
                  </p>
                </div>
                <div className="dean">
                  <p
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      minHeight: "1.2rem",
                    }}
                  >
                    &nbsp;
                  </p>
                  <p style={{ borderTop: "1px dotted black" }}>
                    Name and Signature of Crossing-checking Officer (with Date)
                  </p>
                </div>
              </>
            )
          ) : (
            <>
              <div className="exam_office">
                <p
                  style={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                  }}
                >
                  Mrs Uchenna C. Ugwu {formattedToday}
                </p>
                <p style={{ borderTop: "1px dotted black" }}>
                  Name and Signature of Faculty Officer (with date)
                </p>
              </div>
              <div className="dean">
                <p
                  style={{
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
            </>
          )}
        </div>
        <div style={{ marginTop: "2rem", marginBottom: "0.5rem", textAlign: "center" }}>
          <p style={{ fontWeight: "bold", fontSize: "14px" }}>
            #Units not included in CGPA computation
          </p>
        </div>
        <div className="grade_table" style={{ marginTop: "0.5rem" }}>
          <table>
            <thead>
              <tr
                style={{
                  textTransform: "uppercase",
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                <th colSpan={3}>non pharmacy courses</th>
                <th colSpan={3}>professional courses</th>
              </tr>
              <tr style={{ textTransform: "capitalize", fontWeight: "550" }}>
                <td>score range</td>
                <td>letter grade</td>
                <td>grade point</td>
                <td>score range</td>
                <td>letter grade</td>
                <td>grade point</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>70-100</td>
                <td>A (Excellent)</td>
                <td>5</td>
                <td>70-100</td>
                <td>A (Excellent)</td>
                <td>5</td>
              </tr>
              <tr>
                <td>60-69</td>
                <td>B (Very Good)</td>
                <td>4</td>
                <td>60-69</td>
                <td>B (Very Good)</td>
                <td>4</td>
              </tr>
              <tr>
                <td>50-59</td>
                <td>c (Good)</td>
                <td>3</td>
                <td>50-59</td>
                <td>c (Good)</td>
                <td>3</td>
              </tr>
              <tr>
                <td>45-49</td>
                <td>D (Fair)</td>
                <td>2</td>
                <td>0-49</td>
                <td>F (Fail)</td>
                <td>0</td>
              </tr>
              <tr>
                <td>40-44</td>
                <td>E (Pass)</td>
                <td>1</td>
                <td colSpan={3}>
                  <b style={{ color: "red" }}>*</b>{" "}
                  {"< 60 F (Fail) for PCT224 and PCT422"}{" "}
                </td>
              </tr>
              <tr>
                <td>0-39</td>
                <td>F (Fail)</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="gp_tab">
        <div className="transcript_btn"></div>
        <div></div>
      </div>
    </div>
  );
}

export default AdminTranscript;
