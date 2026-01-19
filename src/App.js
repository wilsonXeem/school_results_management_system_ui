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
import Finalists from "./pages/Admin/Finalists";
import AdminLayout from "./components/AdminLayout";

import Student from "./pages/Student";
import PasswordReset from "./pages/Student/PasswordReset";
import DetailsUpdate from "./pages/Student/DetailsUpdate";
import StudentDashboard from "./pages/Student/Dashboard";
import Transcript from "./pages/Student/Transcript";

import TableExtractor from "./pages/TableExtractor";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const withAdminLayout = (element) => <AdminLayout>{element}</AdminLayout>;

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/admin" exact element={<Admin />} />
          <Route path="/" exact element={<AdminDashboard />} />
          <Route path="/admin/course-reg/sessions" exact element={withAdminLayout(<Sessions />)} />
          <Route path="/admin/course-reg/sessions/:sesion" exact element={withAdminLayout(<OtherSessions />)} />
          <Route path="/admin/course-reg/:session/:level/:class_id/:semester" exact element={withAdminLayout(<Level />)} />
          <Route path="/admin/results/sessions" exact element={withAdminLayout(<ResultSessions />)} />
          <Route path="/admin/results/sessions/:sesion" exact element={withAdminLayout(<OtherResultSessions />)} />
          <Route path="/admin/results/:session/:class_id/:level/:semester" exact element={withAdminLayout(<Result />)} />
          <Route path="/admin/professionals/sessions" exact element={withAdminLayout(<ProfessionalsSessions />)} />
          <Route path="/admin/professionals/sessions/:sesion" exact element={withAdminLayout(<OtherProfessionalsSessions />)} />
          <Route path="/admin/professionals/:session/:class_id/:level/:semester" exact element={withAdminLayout(<Professionals />)} />
          <Route path="/admin/faculty/courses" exact element={withAdminLayout(<Departments />)} />
          <Route path="/admin/faculty/courses/:sesion" exact element={withAdminLayout(<OtherDepartments />)} />
          <Route path="/admin/faculty/:session/courses/:code" exact element={withAdminLayout(<Department />)} />
          <Route path="/admin/faculty/:session/:level/:semester/:code" exact element={withAdminLayout(<Course />)} />
          <Route path="/admin/faculty/:session/:semester/:code/:title/:unit" exact element={withAdminLayout(<OtherCourse />)} />
          <Route path="/admin/faculty/external" exact element={withAdminLayout(<External />)} />
          <Route path="/admin/faculty/external/:sesion" exact element={withAdminLayout(<OtherExternals />)} />
          <Route path="/admin/student/:_id" exact element={withAdminLayout(<AdminStudentDashboard />)} />
          <Route path="/admin/student/transcript/:sesion/:level/:_id" exact element={withAdminLayout(<AdminTranscript/>)} />
          <Route path="/admin/faculty/probation/sessions" exact element={withAdminLayout(<ProbationSessions/>)} />
          <Route path="/admin/faculty/probation/sessions/:sesion" exact element={withAdminLayout(<OtherProbationSessions/>)} />
          <Route path="/admin/faculty/probation/list/:session/:_id/:level/:semester" exact element={withAdminLayout(<ProbationList />)} />
          <Route path="/admin/faculty/error/students/sessions" exact element={withAdminLayout(<ErrorStudentsSessions/>)} />
          <Route path="/admin/faculty/error/students/sessions/:sesion" exact element={withAdminLayout(<OtherErrorStudentsSession/>)} />
          <Route path="/admin/faculty/error/students/list/:session/:_id/:level/:semester" exact element={withAdminLayout(<ErrorStudents />)} />
          <Route path="/admin/student/management" exact element={withAdminLayout(<StudentManagement />)} />
          <Route path="/admin/moe" exact element={withAdminLayout(<ExtractMoe />)} />
          <Route path="/admin/topstudents" exact element={withAdminLayout(<TopStudents />)} />
          <Route path="/admin/finalists" exact element={withAdminLayout(<Finalists />)} />
          
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
