import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { usePollingFetch } from "../hooks/usePollingFetch";

function driverStatusColor(status) {
  switch (status) {
    case "DRIVING":
      return "primary";
    case "ON_DUTY":
      return "success";
    case "OFF_DUTY":
      return "default";
    default:
      return "default";
  }
}

export default function DriversPage() {
  const { data: drivers = [] } = usePollingFetch(
    `${API_BASE_URL}/drivers`,
    5000
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Drivers
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Driver</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Truck</TableCell>
              <TableCell>Current Load</TableCell>
              <TableCell>Home Terminal</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  {driver.firstName} {driver.lastName}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={(driver.status || "").replace(/_/g, " ")}
                    color={driverStatusColor(driver.status)}
                    variant={driver.status === "OFF_DUTY" ? "outlined" : "filled"}
                  />
                </TableCell>
                <TableCell>
                  {driver.assignedTruckUnit ? (
                    <Link component={RouterLink} to="/trucks" underline="hover">
                      {driver.assignedTruckUnit}
                    </Link>
                  ) : (
                    "Unassigned"
                  )}
                </TableCell>
                <TableCell>
                  {driver.status === "DRIVING" ? (
                    driver.currentLoadRef ? (
                      <Link component={RouterLink} to="/loads" underline="hover">
                        {driver.currentLoadRef}
                      </Link>
                    ) : (
                      "No active load"
                    )
                  ) : "N/A"}
                </TableCell>
                <TableCell>{driver.homeTerminal}</TableCell>
                <TableCell>{driver.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
}
