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

function truckStatusColor(status) {
  switch (status) {
    case "ON_THE_ROAD":
      return "primary";
    case "AVAILABLE":
      return "success";
    case "IN_SHOP":
      return "warning";
    case "OUT_OF_SERVICE":
      return "error";
    default:
      return "default";
  }
}

export default function TrucksPage() {
  const { data: trucks = [] } = usePollingFetch(
    `${API_BASE_URL}/trucks`,
    5000
  );

  const renderRoadLink = (truck, type) => {
    const isOnTheRoad = truck.status === "ON_THE_ROAD";
    const isDriver = type === "driver";
    const label = isDriver ? truck.driverName : truck.currentLoadRef;
    const path = isDriver ? "/drivers" : "/loads";

    if (!label) {
      return isDriver ? "Unassigned" : "No active load";
    }

    if (!isOnTheRoad) {
      return label;
    }

    return (
      <Link component={RouterLink} to={path} underline="hover">
        {label}
      </Link>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Trucks
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Unit #</TableCell>
              <TableCell>Year / Make / Model</TableCell>
              <TableCell>Current Location</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Load #</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {trucks.map((truck) => (
              <TableRow key={truck.id}>
                <TableCell>{truck.unitNumber}</TableCell>
                <TableCell>
                  {truck.year} {truck.make} {truck.model}
                </TableCell>
                <TableCell>{truck.currentLocation}</TableCell>
                <TableCell>{renderRoadLink(truck, "driver")}</TableCell>
                <TableCell>{renderRoadLink(truck, "load")}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={(truck.status || "").replace(/_/g, " ")}
                    color={truckStatusColor(truck.status)}
                    variant={truck.status === "AVAILABLE" ? "outlined" : "filled"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
}
