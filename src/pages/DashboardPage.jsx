import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { API_BASE_URL } from "../config";
import { usePollingFetch } from "../hooks/usePollingFetch";

function StatCard({ label, value, sublabel }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>
        {value}
      </Typography>
      {sublabel && (
        <Typography variant="caption" color="text.secondary">
          {sublabel}
        </Typography>
      )}
    </Paper>
  );
}

const mapContainerStyle = {
  width: "100%",
  height: "360px",
};

export default function DashboardPage() {
  // Poll API every 5 seconds
  const { data: loads = [] } = usePollingFetch(
    `${API_BASE_URL}/loads`,
    5000
  );
  const { data: trucks = [] } = usePollingFetch(
    `${API_BASE_URL}/trucks`,
    5000
  );
  const { data: drivers = [] } = usePollingFetch(
    `${API_BASE_URL}/drivers`,
    5000
  );

  // Derived metrics
  const activeLoads = loads.filter((l) =>
    ["PLANNED", "DISPATCHED", "IN_TRANSIT"].includes(l.status)
  ).length;

  const trucksOnTheRoad = trucks.filter((t) => t.status === "ON_THE_ROAD").length;
  const availableTrucks = trucks.filter((t) => t.status === "AVAILABLE").length;

  const driversDriving = drivers.filter((d) => d.status === "DRIVING").length;
  const driversOnDuty = drivers.filter((d) => d.status === "ON_DUTY").length;
  const driversOffDuty = drivers.filter((d) => d.status === "OFF_DUTY").length;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapCenter = useMemo(() => {
    const withCoords = trucks.filter(
      (t) => typeof t.lat === "number" && typeof t.lng === "number"
    );
    if (!withCoords.length) {
      return { lat: 41.2565, lng: -95.9345 }; // default Omaha
    }
    const sum = withCoords.reduce(
      (acc, t) => ({
        lat: acc.lat + t.lat,
        lng: acc.lng + t.lng,
      }),
      { lat: 0, lng: 0 }
    );
    return {
      lat: sum.lat / withCoords.length,
      lng: sum.lng / withCoords.length,
    };
  }, [trucks]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Today&apos;s Overview
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Active Loads"
            value={activeLoads}
            sublabel={`${loads.length} total loads`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Trucks On The Road"
            value={trucksOnTheRoad}
            sublabel={`${availableTrucks} available`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Drivers Driving"
            value={driversDriving}
            sublabel={`${driversOnDuty} on duty`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Drivers Off Duty"
            value={driversOffDuty}
            sublabel={`${drivers.length} total drivers`}
          />
        </Grid>
      </Grid>

      {/* Map */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Truck Locations
        </Typography>

        {loadError && (
          <Typography variant="body2" color="error" sx={{ mb: 1 }}>
            Failed to load map.
          </Typography>
        )}

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={6}
          >
            {trucks
              .filter((t) => typeof t.lat === "number" && typeof t.lng === "number")
              .map((truck) => (
                <Marker
                  key={truck.id}
                  position={{ lat: truck.lat, lng: truck.lng }}
                  label={truck.unitNumber}
                />
              ))}
          </GoogleMap>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Loading map…
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
