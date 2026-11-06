// src/mock/trucks.js

export const mockTrucks = [
  {
    id: "T-1001",
    unitNumber: "1201",
    make: "Freightliner",
    model: "Cascadia",
    year: 2021,
    status: "ON_THE_ROAD", // ON_THE_ROAD | AVAILABLE | IN_SHOP | OUT_OF_SERVICE
    currentLocation: "Omaha, NE",
    driverName: "John Smith",
  },
  {
    id: "T-1002",
    unitNumber: "1202",
    make: "Volvo",
    model: "VNL 760",
    year: 2020,
    status: "AVAILABLE",
    currentLocation: "Lincoln, NE",
    driverName: null,
  },
  {
    id: "T-1003",
    unitNumber: "1203",
    make: "Kenworth",
    model: "T680",
    year: 2019,
    status: "IN_SHOP",
    currentLocation: "Shop – Omaha, NE",
    driverName: "Maria Garcia",
  },
  {
    id: "T-1004",
    unitNumber: "1204",
    make: "Peterbilt",
    model: "579",
    year: 2018,
    status: "ON_THE_ROAD",
    currentLocation: "Des Moines, IA",
    driverName: "Brian Lee",
  },
  {
    id: "T-1005",
    unitNumber: "1205",
    make: "International",
    model: "LT",
    year: 2017,
    status: "OUT_OF_SERVICE",
    currentLocation: "Yard – Council Bluffs, IA",
    driverName: null,
  },
];
