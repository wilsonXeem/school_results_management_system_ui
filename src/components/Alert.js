import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import * as React from "react";
import { useContext } from "react";
import Box from "@mui/joy/Box";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

import { ValueContext } from "../Context";

export default function AlertModal() {
  const { alert_show, alert_message, alert_type, resetAlert } =
    useContext(ValueContext);
  const items = [
    { title: "Success", color: "success", icon: <CheckCircleIcon /> },
    { title: "Warning", color: "warning", icon: <WarningIcon /> },
    { title: "Error", color: "danger", icon: <ReportIcon /> },
    { title: "Neutral", color: "neutral", icon: <InfoIcon /> },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        width: "100%",
        flexDirection: "row-reverse",
        position: "fixed",
        top: 40,
        zIndex: 10,
        right: 10,
      }}
    >
      {alert_show &&
        items.map(
          ({ title, color, icon }) =>
            alert_type === color && (
              <Alert
                key={title}
                sx={{ alignItems: "flex-start" }}
                startDecorator={icon}
                variant="soft"
                color={color}
                endDecorator={
                  <IconButton
                    variant="soft"
                    color={color}
                    onClick={() => resetAlert()}
                  >
                    <CloseRoundedIcon />
                  </IconButton>
                }
              >
                <div>
                  <div>{title}</div>
                  <Typography level="body-sm" color={color}>
                    {alert_message}
                  </Typography>
                </div>
              </Alert>
            )
        )}
    </Box>
  );
}
