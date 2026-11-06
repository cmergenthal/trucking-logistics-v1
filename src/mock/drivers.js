// src/mock/drivers.js

export const mockDrivers = [
  {
    id: "D-2001",
    firstName: "John",
    lastName: "Smith",
    status: "DRIVING", // OFF_DUTY | ON_DUTY | DRIVING
    assignedTruckUnit: "1201",
    homeTerminal: "Omaha, NE",
    phone: "402-555-0101",
  },
  {
    id: "D-2002",
    firstName: "Maria",
    lastName: "Garcia",
    status: "ON_DUTY",
    assignedTruckUnit: "1203",
    homeTerminal: "Omaha, NE",
    phone: "402-555-0102",
  },
  {
    id: "D-2003",
    firstName: "Brian",
    lastName: "Lee",
    status: "DRIVING",
    assignedTruckUnit: "1204",
    homeTerminal: "Des Moines, IA",
    phone: "515-555-0103",
  },
  {
    id: "D-2004",
    firstName: "Emily",
    lastName: "Johnson",
    status: "OFF_DUTY",
    assignedTruckUnit: null,
    homeTerminal: "Lincoln, NE",
    phone: "402-555-0104",
  },
  {
    id: "D-2005",
    firstName: "Ahmed",
    lastName: "Khan",
    status: "ON_DUTY",
    assignedTruckUnit: null,
    homeTerminal: "Omaha, NE",
    phone: "402-555-0105",
  },
];
