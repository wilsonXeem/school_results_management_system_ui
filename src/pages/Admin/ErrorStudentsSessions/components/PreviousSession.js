import React from "react";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate } from "react-router-dom";

function PreviousSession({ session }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate(`/admin/faculty/error/students/sessions/${session}`)
      }
      style={{ cursor: "pointer" }}
    >
      <h3>
        <LinkIcon />
        {session}
      </h3>
    </div>
  );
}

export default PreviousSession;
