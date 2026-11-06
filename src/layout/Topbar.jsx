// src/layout/Topbar.jsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

function Topbar({ drawerWidth }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ml: `${drawerWidth}px`,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          FleetControl – Dispatch Console
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ display: { xs: "none", md: "block" } }}>
            Dispatcher
          </Typography>
          <Avatar>DS</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
