import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import LoadsPage from "./pages/LoadsPage";
import TrucksPage from "./pages/TrucksPage";
import DriversPage from "./pages/DriversPage";
import CustomersPage from "./pages/CustomersPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1565c0" },
    background: { default: "#f3f4f6" }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/loads" element={<LoadsPage />} />
          <Route path="/trucks" element={<TrucksPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/customers" element={<CustomersPage />} />
        </Routes>
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
