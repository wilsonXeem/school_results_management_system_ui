import React, { useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import levels from "../../../data/levels";
import external_courses from "../../../data/external_courses";
import external_units from "../../../data/external_units";
import units from "../../../data/units";
import Table from "./components/Table";
import useExcelParser from "./components/useExcelParser";
import { ValueContext } from "../../../Context";
import Loader from "../../../components/Loader";
import { API_BASE_URL } from "../../../config/api";
import "./level.css";

// Cache for API responses
const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function Level() {
  const { level, semester, class_id, session } = useParams();
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const { data, parseExcel } = useExcelParser();
  const { setAlert } = useContext(ValueContext);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedExternalCourse, setSelectedExternalCourse] = useState("");
  const [isManualExternal, setIsManualExternal] = useState(false);
  const [manualExternalCode, setManualExternalCode] = useState("");
  const [manualExternalTitle, setManualExternalTitle] = useState("");
  const [manualExternalUnitLoad, setManualExternalUnitLoad] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedExternalFileName, setSelectedExternalFileName] = useState("");
  const [students, setStudents] = useState([]);
  const [skipReport, setSkipReport] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [isRegisterCollapsed, setIsRegisterCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const lastFetchRef = useRef(null);
  
  const current_semester = useMemo(
    () => levels[level]?.[semester] || {},
    [level, semester]
  );
  const course_codes = Object.keys(current_semester);
  const course_titles = Object.values(current_semester);
  const external_codes = Object.keys(external_courses);
  const external_titles = Object.values(external_courses);
  const resolvedExternalCode = isManualExternal
    ? manualExternalCode
    : selectedExternalCourse;
  const resolvedExternalTitle = isManualExternal
    ? manualExternalTitle
    : external_courses[selectedExternalCourse];
  const resolvedExternalUnitLoad = isManualExternal
    ? Number(manualExternalUnitLoad)
    : Number(external_units[selectedExternalCourse]);

  const fetchStudents = useCallback(async (forceRefresh = false) => {
    if (!class_id || !semester || !level || !session) return;
    
    const cacheKey = `${class_id}-${semester}-${level}-${session}`;
    const now = Date.now();
    
    if (!forceRefresh && dataCache.has(cacheKey)) {
      const cached = dataCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        setStudents(cached.data);
        return;
      }
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const requestTime = now;
    lastFetchRef.current = requestTime;
    
    setLoad(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/class/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_id,
          semester,
          level,
          session,
        }),
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      
      if (lastFetchRef.current === requestTime) {
        const studentsData = json.students || [];
        setStudents(studentsData);
        
        dataCache.set(cacheKey, {
          data: studentsData,
          timestamp: now
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      
      if (lastFetchRef.current === requestTime) {
        console.error('Failed to fetch students:', err);
        setError(err.message);
        setStudents([]);
      }
    } finally {
      if (lastFetchRef.current === requestTime) {
        setLoad(false);
      }
    }
  }, [class_id, semester, level, session]);
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFileUpload = useCallback((e, type = "main") => {
    const file = e.target.files[0];
    if (file) {
      if (type === "external") {
        setSelectedExternalFileName(file.name);
      } else {
        setSelectedFileName(file.name);
      }
      parseExcel(file);
    }
  }, [parseExcel]);

  const handle_course_reg = useCallback(async () => {
    if (!selectedCourse || !data?.length) {
      setAlert(true, "Please select a course and upload student data", "error");
      return;
    }
    
    setSkipReport(null);
    setUploadSummary(null);
    setLoad(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/class/register`, {
        method: "POST",
        body: JSON.stringify({
          students: data,
          level,
          course_title: current_semester[selectedCourse],
          course_code: selectedCourse,
          unit_load: units[selectedCourse],
          semester,
          session,
          class_id,
          external: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.message || `HTTP error! status: ${response.status}`);
      }
      setStudents(json.students || []);
      
      const cacheKey = `${class_id}-${semester}-${level}-${session}`;
      dataCache.delete(cacheKey);
      const skipped = Number(json?.summary?.skipped || 0);
      const skippedDetails = Array.isArray(json?.summary?.skipped_details)
        ? json.summary.skipped_details
        : [];
      const processed = Number(json?.summary?.processed || 0);
      const total = Number(json?.summary?.total_rows || data.length || 0);
      const successMessage = `Registered ${processed}/${total} students successfully.`;
      
      if (skipped > 0) {
        setSkipReport({
          type: "Course Registration",
          total,
          processed,
          skipped,
          skippedDetails,
        });
        const warningLines = [
          `${skipped} student row(s) were skipped. See details below.`,
          ...(Array.isArray(json?.summary?.warnings) ? json.summary.warnings : []),
        ];
        setUploadSummary({
          success: successMessage,
          warnings: warningLines,
        });
        setAlert(
          true,
          successMessage,
          "success"
        );
      } else {
        setSkipReport(null);
        const warningLines = Array.isArray(json?.summary?.warnings) ? json.summary.warnings : [];
        setUploadSummary({
          success: successMessage,
          warnings: warningLines,
        });
        setAlert(true, successMessage, "success");
      }
      setSelectedCourse("");
    } catch (err) {
      console.error('Failed to register course:', err);
      setError(err.message);
      setAlert(true, err.message || "Failed to register students", "error");
    } finally {
      setLoad(false);
    }
  }, [selectedCourse, data, level, semester, session, class_id, setAlert, current_semester]);

  const handle_external_course = useCallback(async () => {
    const manualCode = String(manualExternalCode || "").trim();
    const manualTitle = String(manualExternalTitle || "").trim();
    const manualUnit = Number(manualExternalUnitLoad);
    const selectedUnit = Number(external_units[selectedExternalCourse]);
    const courseCode = isManualExternal ? manualCode : selectedExternalCourse;
    const courseTitle = isManualExternal ? manualTitle : external_courses[selectedExternalCourse];
    const unitLoad = isManualExternal ? manualUnit : selectedUnit;

    if (!data?.length) {
      setAlert(true, "Please upload student data first", "error");
      return;
    }

    if (!courseCode || !courseTitle || !Number.isFinite(unitLoad) || unitLoad <= 0) {
      setAlert(
        true,
        "Please provide a valid external course code, title, and unit load",
        "error"
      );
      return;
    }
    
    setSkipReport(null);
    setUploadSummary(null);
    setLoad(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/class/external`, {
        method: "POST",
        body: JSON.stringify({
          students: data,
          level,
          course_title: courseTitle,
          course_code: courseCode,
          unit_load: unitLoad,
          semester,
          session,
          class_id,
          external: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.message || `HTTP error! status: ${response.status}`);
      }
      setStudents(json.students || []);
      
      const cacheKey = `${class_id}-${semester}-${level}-${session}`;
      dataCache.delete(cacheKey);
      const skipped = Number(json?.summary?.skipped || 0);
      const skippedDetails = Array.isArray(json?.summary?.skipped_details)
        ? json.summary.skipped_details
        : [];
      const processed = Number(json?.summary?.processed || 0);
      const total = Number(json?.summary?.total_rows || data.length || 0);
      const successMessage = `Registered ${processed}/${total} external course rows successfully.`;
      
      if (skipped > 0) {
        setSkipReport({
          type: "External Course Registration",
          total,
          processed,
          skipped,
          skippedDetails,
        });
        const warningLines = [
          `${skipped} student row(s) were skipped. See details below.`,
          ...(Array.isArray(json?.summary?.warnings) ? json.summary.warnings : []),
        ];
        setUploadSummary({
          success: successMessage,
          warnings: warningLines,
        });
        setAlert(
          true,
          successMessage,
          "success"
        );
      } else {
        setSkipReport(null);
        const warningLines = Array.isArray(json?.summary?.warnings) ? json.summary.warnings : [];
        setUploadSummary({
          success: successMessage,
          warnings: warningLines,
        });
        setAlert(true, successMessage, "success");
      }
      setSelectedExternalCourse("");
      setManualExternalCode("");
      setManualExternalTitle("");
      setManualExternalUnitLoad("");
      setShow(false);
    } catch (err) {
      console.error('Failed to register external course:', err);
      setError(err.message);
      setAlert(true, err.message || "Failed to register external course", "error");
    } finally {
      setLoad(false);
    }
  }, [
    selectedExternalCourse,
    data,
    level,
    semester,
    session,
    class_id,
    setAlert,
    isManualExternal,
    manualExternalCode,
    manualExternalTitle,
    manualExternalUnitLoad,
  ]);

  const semesterLabel = semester === "1" ? "First Semester" : "Second Semester";

  if (error) {
    return (
      <div className="level_page">
        <div className="level_state_card">
          <h3>Error loading level data</h3>
          <p>{error}</p>
          <button className="level_btn level_btn_primary" onClick={() => fetchStudents(true)}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="level_page">
      <section className="level_page_header">
        <div>
          <p className="level_kicker">Course Registration</p>
          <h2>{level} Level • {semesterLabel}</h2>
        </div>
        <div className="level_meta">
          <span className="level_chip">
            <b>Session:</b> {session}
          </span>
          <span className="level_chip">
            <b>Uploaded rows:</b> {data?.length || 0}
          </span>
        </div>
      </section>

      <section className={`level_form_grid ${show ? "two_column" : ""}`}>
        <article className="level_form_card">
          <div className="level_form_card_head">
            <div>
              <h3>Register Course</h3>
              <p className="level_hint">
                Upload an Excel sheet and register students for the selected course.
              </p>
            </div>
            <button
              type="button"
              className="level_collapse_toggle"
              onClick={() => setIsRegisterCollapsed((prev) => !prev)}
              aria-expanded={!isRegisterCollapsed}
              aria-controls="register-course-body"
            >
              {isRegisterCollapsed ? "Expand" : "Collapse"}
            </button>
          </div>

          {!isRegisterCollapsed ? (
            <div id="register-course-body">
              <div className="level_form_fields">
                <label className="level_field">
                  <span>Course</span>
                  <select
                    name="course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">Select course</option>
                    {course_codes.map((course, key) => (
                      <option key={course} value={course}>
                        <span>{course}</span> {course_titles[key]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="level_field">
                  <span>Unit load</span>
                  <input type="text" value={units[selectedCourse] || "N/A"} readOnly />
                </label>

                <label className="level_field">
                  <span>Excel file</span>
                  <div className="level_upload_control">
                    <input
                      id="level-file-upload-main"
                      className="level_hidden_file_input"
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={(e) => handleFileUpload(e, "main")}
                    />
                    <label htmlFor="level-file-upload-main" className="level_upload_trigger">
                      Choose File
                    </label>
                    <span className="level_upload_filename">
                      {selectedFileName || "No file selected"}
                    </span>
                  </div>
                </label>
              </div>

              <p className="level_file_label">
                {selectedFileName ? `Selected file: ${selectedFileName}` : "No file selected"}
              </p>

              <div className="level_actions_row">
                <button
                  className="level_btn level_btn_primary"
                  onClick={handle_course_reg}
                  disabled={!selectedCourse || !data?.length || load}
                >
                  Upload
                </button>
                <button
                  className="level_btn level_btn_secondary"
                  onClick={() => setShow((prev) => !prev)}
                  disabled={load}
                >
                  {show ? "Hide External Course" : "Add External Course"}
                </button>
              </div>
            </div>
          ) : (
            <p className="level_collapsed_text">Register course section is collapsed.</p>
          )}
        </article>

        {show && (
          <article className="level_form_card level_form_card_alt">
            <h3>Register External Course</h3>
            <p className="level_hint">
              Use the same uploaded sheet and map scores to an external course.
            </p>

            <div className="level_actions_row" style={{ marginTop: 0 }}>
              <button
                type="button"
                className={`level_btn ${!isManualExternal ? "level_btn_primary" : "level_btn_secondary"}`}
                onClick={() => setIsManualExternal(false)}
                disabled={load}
              >
                Select Existing
              </button>
              <button
                type="button"
                className={`level_btn ${isManualExternal ? "level_btn_primary" : "level_btn_secondary"}`}
                onClick={() => setIsManualExternal(true)}
                disabled={load}
              >
                Add Manually
              </button>
            </div>

            <div className="level_form_fields">
              {!isManualExternal ? (
                <label className="level_field">
                  <span>External course</span>
                  <select
                    name="external_course"
                    value={selectedExternalCourse}
                    onChange={(e) => setSelectedExternalCourse(e.target.value)}
                  >
                    <option value="">Select course</option>
                    {external_codes.map((course, key) => (
                      <option key={course} value={course}>
                        <span>{course}</span> {external_titles[key]} {external_units[course]}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <>
                  <label className="level_field">
                    <span>Course code</span>
                    <input
                      type="text"
                      value={manualExternalCode}
                      onChange={(e) => setManualExternalCode(e.target.value.toUpperCase())}
                      placeholder="e.g. CHM101"
                    />
                  </label>

                  <label className="level_field">
                    <span>Course title</span>
                    <input
                      type="text"
                      value={manualExternalTitle}
                      onChange={(e) => setManualExternalTitle(e.target.value)}
                      placeholder="e.g. External CHM101"
                    />
                  </label>
                </>
              )}

              <label className="level_field">
                <span>Unit load</span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={
                    isManualExternal
                      ? manualExternalUnitLoad
                      : external_units[selectedExternalCourse] || ""
                  }
                  readOnly={!isManualExternal}
                  onChange={(e) => setManualExternalUnitLoad(e.target.value)}
                  placeholder={isManualExternal ? "e.g. 2" : "N/A"}
                />
              </label>

              <label className="level_field">
                <span>Excel file</span>
                <div className="level_upload_control">
                  <input
                    id="level-file-upload-external"
                    className="level_hidden_file_input"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => handleFileUpload(e, "external")}
                  />
                  <label htmlFor="level-file-upload-external" className="level_upload_trigger">
                    Choose File
                  </label>
                  <span className="level_upload_filename">
                    {selectedExternalFileName || "No file selected"}
                  </span>
                </div>
              </label>
            </div>

            <p className="level_file_label">
              {selectedExternalFileName
                ? `Selected file: ${selectedExternalFileName}`
                : "No file selected"}
            </p>

            <div className="level_actions_row">
              <button
                className="level_btn level_btn_primary"
                onClick={handle_external_course}
                disabled={
                  !data?.length ||
                  load ||
                  !String(resolvedExternalCode || "").trim() ||
                  !String(resolvedExternalTitle || "").trim() ||
                  !Number.isFinite(resolvedExternalUnitLoad) ||
                  resolvedExternalUnitLoad <= 0
                }
              >
                Register
              </button>
              <button
                className="level_btn level_btn_danger"
                onClick={() => {
                  setShow(false);
                  setSelectedExternalCourse("");
                  setIsManualExternal(false);
                  setManualExternalCode("");
                  setManualExternalTitle("");
                  setManualExternalUnitLoad("");
                }}
                disabled={load}
              >
                Cancel
              </button>
            </div>
          </article>
        )}
      </section>

      {load && <Loader />}

      {uploadSummary && (
        <section className="level_upload_summary_card">
          <p className="level_upload_summary_success">{uploadSummary.success}</p>
          {Array.isArray(uploadSummary.warnings) &&
            uploadSummary.warnings.length > 0 &&
            uploadSummary.warnings.map((warning, index) => (
              <p key={`${warning}-${index}`} className="level_upload_summary_warning">
                {warning}
              </p>
            ))}
        </section>
      )}

      {skipReport && skipReport.skipped > 0 && (
        <section className="level_skip_card">
          <div className="level_skip_head">
            <h3>Skipped Reg Numbers</h3>
            <p>
              {skipReport.type} • {skipReport.processed}/{skipReport.total} processed •{" "}
              {skipReport.skipped} skipped
            </p>
          </div>
          <div className="level_skip_grid">
            {skipReport.skippedDetails.map((item, index) => (
              <div key={`${item?.reg_no || "unknown"}-${index}`} className="level_skip_item">
                <span className="level_skip_reg">{item?.reg_no || "N/A"}</span>
                <span className="level_skip_reason">{item?.reason || "Skipped"}</span>
              </div>
            ))}
          </div>
          {skipReport.skipped > skipReport.skippedDetails.length && (
            <p className="level_skip_more">
              Showing {skipReport.skippedDetails.length} of {skipReport.skipped} skipped rows.
            </p>
          )}
        </section>
      )}

      <section className="level_table_card">
        <div className="level_table_head">
          <h3>Registered Students</h3>
          <span>{students.length} students</span>
        </div>
        {students.length > 0 && <Table students={students} />}
        {!load && students.length === 0 && (
          <div className="level_empty_state">
            <p>No students found for this class and semester.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default React.memo(Level);
