import { useState, useMemo } from "react";
import "./StudentManagement.css";
import { useNavigate } from "react-router-dom";

const StudentManagement = () => {
  const navigate = useNavigate();
  const [regNo, setRegNo] = useState("");
  const [fullname, setFullname] = useState("");
  const [moe, setMOE] = useState("");
  const [session, setSession] = useState("");
  const [semester, setSemester] = useState("");
  const [level, setLevel] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [student, setStudent] = useState({});
  const [semesterResult, setSemesterResult] = useState(null);
  const [scoreModal, setScoreModal] = useState({
    open: false,
    course: null,
    total: "",
  });
  const [confirmAction, setConfirmAction] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: null,
  });

  const handleRequest = async (endpoint, body, method) => {
    setMessage({ text: "", type: "" });
    setStudent({});
    setSemesterResult(null);
    const response = await fetch(
      `http://127.0.0.1:1234/api/student/${endpoint}`,
      {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    setMessage({
      text: data.message || (response.ok ? "Request completed." : "Request failed."),
      type: response.ok ? "success" : "error",
    });
    if (data.student) setStudent(data.student);
    if (data.semester_result) setSemesterResult(data.semester_result);
  };

  const handleSearchSemester = () => {
    handleRequest(
      "semester-result",
      { reg_no: regNo, session, semester },
      "POST"
    );
  };

  const openScoreModal = (course) => {
    setScoreModal({
      open: true,
      course,
      total: course?.total ?? "",
    });
  };

  const closeScoreModal = () => {
    setScoreModal({ open: false, course: null, total: "" });
  };

  const updateCourseTotal = async () => {
    if (!scoreModal.course) return;
    const response = await fetch(
      "http://127.0.0.1:1234/api/student/update-course-total",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reg_no: regNo,
          session,
          semester,
          course_code: scoreModal.course.course_code,
          total: scoreModal.total,
        }),
      }
    );

    const data = await response.json();
    setMessage({
      text: data.message || JSON.stringify(data),
      type: response.ok ? "success" : "error",
    });

    if (response.ok && semesterResult) {
      const updatedCourses = semesterResult.courses.map((course) =>
        course.course_code === scoreModal.course.course_code
          ? { ...course, ...data.course }
          : course
      );
      setSemesterResult({
        ...semesterResult,
        courses: updatedCourses,
        gpa: data.gpa ?? semesterResult.gpa,
        session_gpa: data.session_gpa ?? semesterResult.session_gpa,
      });
    }

    closeScoreModal();
  };

  const openConfirm = (title, description, onConfirm) => {
    setConfirmAction({ open: true, title, description, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmAction({ open: false, title: "", description: "", onConfirm: null });
  };

  const statusLines = useMemo(() => {
    if (!message.text) return [];
    const parts = message.text
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    return parts.length > 1 ? parts : [message.text];
  }, [message.text]);

  const canShowProfile = useMemo(() => Boolean(student?._id), [student]);

  return (
    <div className="edit_student">
      <div className="student-management">
        <div className="student-header">
          <h2>Student Management</h2>
          <p>Search, update, and clean up student records.</p>
        </div>
        <div className="student-grid">
          <div className="card">
            <h3>Lookup</h3>
            <div className="field">
              <label>Reg No</label>
              <input
                type="text"
                placeholder="e.g. 2018/123456"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
            </div>
            <div className="actions">
              <button
                className="btn primary"
                onClick={() =>
                  handleRequest(`search`, { reg_no: regNo }, "POST")
                }
              >
                Search Student
              </button>
              <button className="btn" onClick={handleSearchSemester}>
                Search by Session
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Update Details</h3>
            <div className="field">
              <label>Fullname</label>
              <input
                type="text"
                placeholder="Fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Mode of Entry</label>
              <input
                type="text"
                placeholder="e.g. UTME / Direct Entry"
                value={moe}
                onChange={(e) => setMOE(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Session</label>
              <input
                type="text"
                placeholder="e.g. 2022-2023"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Semester</label>
              <input
                type="text"
                placeholder="1 or 2"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Level</label>
              <input
                type="text"
                placeholder="e.g. 300"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />
            </div>
            <div className="actions">
              <button
                className="btn"
                onClick={() =>
                  handleRequest("update-name", { reg_no: regNo, fullname }, "PUT")
                }
              >
                Update Name
              </button>
              <button
                className="btn"
                onClick={() =>
                  handleRequest("moe/update", { reg_no: regNo, moe }, "PUT")
                }
              >
                Update Mode of Entry
              </button>
              <button
                className="btn"
                onClick={() =>
                  handleRequest(
                    "update-semester-level",
                    {
                      reg_no: regNo,
                      session,
                      semester,
                      level,
                    },
                    "PUT"
                  )
                }
              >
                Update Semester Level
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Remove Records</h3>
            <div className="field">
              <label>Session</label>
              <input
                type="text"
                placeholder="e.g. 2021-2022"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Semester</label>
              <input
                type="text"
                placeholder="1 or 2"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Course Code</label>
              <input
                type="text"
                placeholder="e.g. PCT224"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            </div>
            <div className="actions">
              <button
                className="btn danger"
                onClick={() =>
                  openConfirm(
                    "Remove Semester",
                    `This will delete ${session || "the selected session"} semester ${semester || ""} for ${regNo || "this student"}.`,
                    () =>
                      handleRequest(
                        "remove-semester",
                        { reg_no: regNo, session, semester },
                        "DELETE"
                      )
                  )
                }
              >
                Remove Semester
              </button>
              <button
                className="btn danger"
                onClick={() =>
                  openConfirm(
                    "Remove Session",
                    `This will delete all results for ${session || "the selected session"} for ${regNo || "this student"}.`,
                    () =>
                      handleRequest(
                        "remove-session",
                        { reg_no: regNo, session },
                        "DELETE"
                      )
                  )
                }
              >
                Remove Session
              </button>
              <button
                className="btn danger"
                onClick={() =>
                  openConfirm(
                    "Remove Course",
                    `This will delete ${courseCode || "the selected course"} for ${regNo || "this student"} in ${session || "the selected session"} semester ${semester || ""}.`,
                    () =>
                      handleRequest(
                        "remove-course",
                        {
                          reg_no: regNo,
                          session,
                          semester,
                          course_code: courseCode,
                        },
                        "DELETE"
                      )
                  )
                }
              >
                Remove Course
              </button>
              <button
                className="btn danger outline"
                onClick={() =>
                  openConfirm(
                    "Remove Student",
                    `This will permanently remove ${regNo || "this student"} and associated records.`,
                    () =>
                      handleRequest(
                        "remove-student",
                        { reg_no: regNo },
                        "DELETE"
                      )
                  )
                }
              >
                Remove Student
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="student-side">
        {message.text && (
          <div className={`status-card ${message.type}`}>
            <h4>Status</h4>
            <ul>
              {statusLines.map((line, index) => (
                <li key={`${line}-${index}`}>{line}</li>
              ))}
            </ul>
          </div>
        )}
        {canShowProfile && (
          <div className="status-card profile">
            <h4>Student Profile</h4>
            <p>{student.fullname}</p>
            <p>{student.reg_no}</p>
            {semesterResult && (
              <div className="semester_summary">
                <p>
                  {semesterResult.session} • Semester {semesterResult.semester}
                </p>
                <p>GPA: {semesterResult.gpa?.toFixed?.(2) ?? semesterResult.gpa}</p>
              </div>
            )}
            <button
              className="btn"
              onClick={() => navigate(`/admin/student/${student?._id}`)}
            >
              Open Profile
            </button>
          </div>
        )}
        {semesterResult && (
          <div className="status-card courses">
            <h4>Semester Courses</h4>
            <div className="course_list">
              {semesterResult.courses.map((course) => (
                <button
                  key={course.course_code}
                  type="button"
                  className="course_item"
                  onClick={() => openScoreModal(course)}
                >
                  <span>{course.course_code}</span>
                  <span>{Number(course.total || 0).toFixed(0)}</span>
                </button>
              ))}
            </div>
            <p className="helper_text">
              Click a course to update the total score.
            </p>
          </div>
        )}
      </div>
      {confirmAction.open && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h3>{confirmAction.title}</h3>
            <p>{confirmAction.description}</p>
            <div className="confirm-actions">
              <button className="btn outline" onClick={closeConfirm}>
                Cancel
              </button>
              <button
                className="btn danger"
                onClick={() => {
                  const action = confirmAction.onConfirm;
                  closeConfirm();
                  if (action) action();
                }}
              >
                Yes, proceed
              </button>
            </div>
          </div>
        </div>
      )}
      {scoreModal.open && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h3>Update Score</h3>
            <p>
              {scoreModal.course?.course_code} •{" "}
              {scoreModal.course?.course_title}
            </p>
            <div className="field">
              <label>Total Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={scoreModal.total}
                onChange={(e) =>
                  setScoreModal((prev) => ({
                    ...prev,
                    total: e.target.value,
                  }))
                }
              />
            </div>
            <div className="confirm-actions">
              <button className="btn outline" onClick={closeScoreModal}>
                Cancel
              </button>
              <button className="btn" onClick={updateCourseTotal}>
                Save Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
