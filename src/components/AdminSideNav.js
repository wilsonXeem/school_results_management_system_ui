import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ScienceIcon from "@mui/icons-material/Science";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleIcon from "@mui/icons-material/People";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const navItems = [
  { label: "Dashboard", to: "/", icon: DashboardIcon },
  { label: "Student Management", to: "/admin/student/management", icon: ManageAccountsIcon },
  { label: "Course Registration", to: "/admin/course-reg/sessions", icon: AppRegistrationIcon },
  { label: "Results", to: "/admin/results/sessions", icon: AssessmentIcon },
  { label: "Faculty Courses", to: "/admin/faculty/courses", icon: AccountBalanceIcon },
  { label: "Non-Professional Courses", to: "/admin/faculty/external", icon: ScienceIcon },
  { label: "Probation Lists", to: "/admin/faculty/probation/sessions", icon: WarningAmberIcon },
  { label: "Error Students", to: "/admin/faculty/error/students/sessions", icon: ReportProblemIcon },
  { label: "Professionals", to: "/admin/professionals/sessions", icon: PeopleIcon },
  { label: "Finalists", to: "/admin/finalists", icon: WorkspacePremiumIcon },
  { label: "Top Students", to: "/admin/topstudents", icon: EmojiEventsIcon },
];

function AdminSideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (to) => {
    if (to === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(to);
  };

  return (
    <aside className="admin_sidenav">
      <div className="sidenav_brand">PS</div>
      <nav className="sidenav_links">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.to}
              type="button"
              className={`nav_item ${isActive(item.to) ? "active" : ""}`}
              onClick={() => navigate(item.to)}
              aria-label={item.label}
              title={item.label}
            >
              <Icon fontSize="small" />
              <span className="nav_label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSideNav;
