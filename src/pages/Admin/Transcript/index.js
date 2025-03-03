import React, { useState, useRef, useEffect, useContext } from "react";
import unn from "../../../data/unn.png";
import Table from "./components/Table";
import { useParams } from "react-router-dom";
import { ValueContext } from "../../../Context";
import professionals from "../../../data/professionals";

import generatePDF from "react-to-pdf";

function AdminTranscript() {
  const target = useRef();
  const { _id, sesion, level } = useParams();
  const { socket } = useContext(ValueContext);
  const [student, setStudent] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:1234/api/student/results/session/${_id}/${sesion}`)
      .then((res) => res.json())
      .then((json) => {
        setStudent(json);
      })
      .catch((err) => console.log(err));
  }, []);

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;

  return (
    <>
      <div class="student_db" id="transcript" ref={target}>
        <div className="d_head">
          <div class="student_dashboard_head">
            <div class="passport">
              <div class="passport_img">
                <img src={unn} alt="" />
              </div>
            </div>
            <div class="dashboard_header">
              {/* <div class="student_dashboard_header_img">
            <img src={unn} alt="" />
          </div> */}
              <div class="student_dashboard_head_title">
                <p>Faculty of Pharmaceutical Sciences</p>
                <p>University of Nigeria Nsukka</p>
                <p>PHARM. D PROFESSIONAL EXAMINATION RESULT SHEET</p>
                <i style={{ fontSize: "x-large", fontWeight: "bold" }}>
                  (Faculty Copy)
                </i>
              </div>
            </div>
            <div class="passport">
              <div class="passport_img">
                <img src={student.profile_image} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="student_dashboard_bod">
          <div class="student_dashboard_body_details">
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
            show={
              student.first_external?.length > 0 ||
              student.second_external?.length > 0
            }
          />
          {/* <GPtable
            generatePDF={generatePDF}
            target_element={target_element}
            options={options}
          /> */}
        </div>
        <div class="gp_tab">
          <div class="transcript_btn"></div>
        </div>
        <div class="signature">
          <div class="exam_office">
            <p
              style={{
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
            >
              chukwuma chinyere p. {formattedToday}
            </p>
            <p style={{ borderTop: "1px dotted black" }}>
              Name and Signature of Examination Officer (with date)
            </p>
          </div>
          <div class="dean">
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
        </div>
        <div className="grade_table">
          <table>
            <thead>
              <tr
                style={{
                  textTransform: "uppercase",
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                <th colSpan={3}>non-professional courses</th>
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

      <div class="gp_tab">
        <div class="transcript_btn">
          <button
            onClick={() =>
              generatePDF(target, {
                filename: `${student.fullname} ${sesion} result`,
              })
            }
          >
            Print
          </button>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default AdminTranscript;
