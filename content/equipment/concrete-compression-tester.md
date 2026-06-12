---
id: "concrete-compression-tester"
title: "Digital Compression Machine"
model: "Controls Pilot PRO 300"
manufacturer: "Controls Group"
departments:
  - "Civil Engineering"
location:
  building_id: "cluster-5"
  floor: 1
  room_id: "b5-103"
  station_id: "station-civ-1"
media:
  images:
    - "/images/equipment/concrete-exterior.png"
  ambient_color: "#6B7280"
physics:
  primary_mechanism: "Hydraulic Load Application"
  mathematical_model: "Compressive Stress"
  equation: "\\sigma = \\frac{F}{A}"
  target_materials:
    - "Concrete cylinders"
    - "Brick blocks"
specifications:
  capacity: "3000 kN"
  hydraulic_accuracy: "Class 1"
  piston_travel: "50 mm"
links:
  - title: "Concrete Strength Standards"
    url: "https://vgu.edu.vn/concrete-standard"
status: "operational"
---

::equipment-story
Applies slowly increasing compressive force on concrete cylinders until they fail, displaying the exact rupture limit to evaluate architectural materials safety.
::

### Pre-run checklist
1. Close safety shielding doors before loading target specimens.
2. Verify oil pressures in reservoir.
