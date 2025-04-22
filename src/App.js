import "./App.css";

import Admin from "./pages/Admin";
import AdminDashboard from "./pages/Admin/Dashboard";
import Sessions from "./pages/Admin/Sessions";
import OtherSessions from "./pages/Admin/Sessions/OtherSessions";
import Level from "./pages/Admin/Level";
import ResultSessions from "./pages/Admin/ResultSessions"
import Result from "./pages/Admin/Results"
import Departments from "./pages/Admin/Departments";
import Department from "./pages/Admin/Departments/Department";
import Course from "./pages/Admin/Course";
import External from "./pages/Admin/External";
import OtherDepartments from "./pages/Admin/Departments/OtherDepartments";
import OtherResultSessions from "./pages/Admin/ResultSessions/OtherResultSessions";
import OtherExternals from "./pages/Admin/External/OtherExternals";
import OtherCourse from "./pages/Admin/Course/ExternalCourse";
import AdminStudentDashboard from "./pages/Admin/Student";
import AdminTranscript from "./pages/Admin/Transcript";
import SearchStudent from "./pages/Admin/SearchStudent";
import ProbationSessions from "./pages/Admin/ProbationSessions"
import OtherProbationSessions from "./pages/Admin/ProbationSessions/OtherProbationSessions";
import ProbationList from "./pages/Admin/ProbationList"
import ErrorStudents from "./pages/Admin/ErrorStudents";
import ErrorStudentsSessions from "./pages/Admin/ErrorStudentsSessions";
import OtherErrorStudentsSession from "./pages/Admin/ErrorStudentsSessions/OtherErrorStudentsSessions";
import StudentManagement from "./pages/Admin/Student/EditStudent";
import ExtractMoe from "./pages/Admin/Student/ExtractMOE";
import TopStudents from "./pages/Admin/TopStudents";
import Professionals from "./pages/Admin/Professionals";
import ProfessionalsSessions from "./pages/Admin/ProfessionalsSessions";
import OtherProfessionalsSessions from "./pages/Admin/ProfessionalsSessions/OtherProfessionalsSessions";

import Student from "./pages/Student";
import PasswordReset from "./pages/Student/PasswordReset";
import DetailsUpdate from "./pages/Student/DetailsUpdate";
import StudentDashboard from "./pages/Student/Dashboard";
import Transcript from "./pages/Student/Transcript";

import TableExtractor from "./pages/TableExtractor";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/admin" exact element={<Admin />} />
          <Route path="/" exact element={<AdminDashboard />} />
          <Route path="/admin/course-reg/sessions" exact element={<Sessions />} />
          <Route path="/admin/course-reg/sessions/:sesion" exact element={<OtherSessions />} />
          <Route path="/admin/course-reg/:session/:level/:class_id/:semester" exact element={<Level />} />
          <Route path="/admin/results/sessions" exact element={<ResultSessions />} />
          <Route path="/admin/results/sessions/:sesion" exact element={<OtherResultSessions />} />
          <Route path="/admin/results/:session/:class_id/:level/:semester" exact element={<Result />} />
          <Route path="/admin/professionals/sessions" exact element={<ProfessionalsSessions />} />
          <Route path="/admin/professionals/sessions/:sesion" exact element={<OtherProfessionalsSessions />} />
          <Route path="/admin/professionals/:session/:class_id/:level/:semester" exact element={<Professionals />} />
          <Route path="/admin/faculty/courses" exact element={<Departments />} />
          <Route path="/admin/faculty/courses/:sesion" exact element={<OtherDepartments />} />
          <Route path="/admin/faculty/:session/courses/:code" exact element={<Department />} />
          <Route path="/admin/faculty/:session/:level/:semester/:code" exact element={<Course />} />
          <Route path="/admin/faculty/:session/:semester/:code/:title/:unit" exact element={<OtherCourse />} />
          <Route path="/admin/faculty/external" exact element={<External />} />
          <Route path="/admin/faculty/external/:sesion" exact element={<OtherExternals />} />
          <Route path="/admin/student/:_id" exact element={<AdminStudentDashboard />} />
          <Route path="/admin/student/transcript/:sesion/:level/:_id" exact element={<AdminTranscript/>}/>
          <Route path="/admin/faculty/probation/sessions" exact element={<ProbationSessions/>}/>
          <Route path="/admin/faculty/probation/sessions/:sesion" exact element={<OtherProbationSessions/>}/>
          <Route path="/admin/faculty/probation/list/:session/:_id/:level/:semester" exact element={<ProbationList />} />
          <Route path="/admin/faculty/error/students/sessions" exact element={<ErrorStudentsSessions/>}/>
          <Route path="/admin/faculty/error/students/sessions/:sesion" exact element={<OtherErrorStudentsSession/>}/>
          <Route path="/admin/faculty/error/students/list/:session/:_id/:level/:semester" exact element={<ErrorStudents />} />
          <Route path="/admin/student/management" exact element={<StudentManagement />} />
          <Route path="/admin/moe" exact element={<ExtractMoe />} />
          <Route path="/admin/topstudents" exact element={<TopStudents />} />
          
          {/* <Route path="/" exact element={<TableExtractor/>}/> */}
          <Route path="/student" exact element={<Student/>}/>
          <Route path="/student/password/reset" exact element={<PasswordReset/>}/>
          <Route path="/student/details/:_id" exact element={<DetailsUpdate/>}/>
          <Route path="/student/dashboard/:_id" exact element={<StudentDashboard/>}/>
          <Route path="/student/transcript/:sesion/:_id" exact element={<Transcript/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
