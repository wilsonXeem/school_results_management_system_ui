import React from "react";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function Box({ title, url, color }) {
  const navigate = useNavigate();
  return (
    <div
      className={`admin_dashboard_box ${color}`}
      onClick={() => navigate(url)}
    >
      <h3>
        {title} <OpenInNewIcon />
      </h3>
    </div>
  );
}

export default Box;
