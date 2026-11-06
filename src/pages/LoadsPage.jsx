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

function statusColor(status) {
  switch (status) {
    case "PLANNED":
      return "default";
    case "DISPATCHED":
      return "info";
    case "IN_TRANSIT":
      return "warning";
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
}

export default function LoadsPage() {
  const { data: loads = [] } = usePollingFetch(
    `${API_BASE_URL}/loads`,
    5000
  );

  const renderAssignmentLink = (load, type) => {
    const isInTransit = load.status === "IN_TRANSIT";
    const isTruck = type === "truck";
    const label = isTruck ? load.assignedTruckUnit : load.assignedDriverName;
    const path = isTruck ? "/trucks" : "/drivers";

    if (!label) {
      return "Unassigned";
    }

    if (!isInTransit) {
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
        Loads
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ref #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Pickup</TableCell>
              <TableCell>Delivery</TableCell>
              <TableCell>Truck #</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loads.map((load) => (
              <TableRow key={load.id}>
                <TableCell>{load.referenceNumber}</TableCell>
                <TableCell>{load.customerName}</TableCell>
                <TableCell>
                  {load.pickupCity}, {load.pickupState}
                </TableCell>
                <TableCell>
                  {load.deliveryCity}, {load.deliveryState}
                </TableCell>
                <TableCell>{renderAssignmentLink(load, "truck")}</TableCell>
                <TableCell>{renderAssignmentLink(load, "driver")}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={(load.status || "").replace(/_/g, " ")}
                    color={statusColor(load.status)}
                    variant={load.status === "PLANNED" ? "outlined" : "filled"}
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
