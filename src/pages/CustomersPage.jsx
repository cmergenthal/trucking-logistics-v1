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
import { API_BASE_URL } from "../config";
import { usePollingFetch } from "../hooks/usePollingFetch";

export default function CustomersPage() {
  const { data: customers = [] } = usePollingFetch(
    `${API_BASE_URL}/customers`,
    10000 // customers change less often; slower poll is fine
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Customers
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Primary Lane</TableCell>
              <TableCell align="right">Avg Loads / Week</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>
                  {customer.city}, {customer.state}
                </TableCell>
                <TableCell>{customer.primaryLane}</TableCell>
                <TableCell align="right">
                  <Chip
                    size="small"
                    label={customer.avgLoadsPerWeek}
                    color={
                      customer.avgLoadsPerWeek >= 10
                        ? "primary"
                        : customer.avgLoadsPerWeek >= 6
                        ? "success"
                        : "default"
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{customer.contactName}</TableCell>
                <TableCell>{customer.contactPhone}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
}
