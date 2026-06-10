---
id: "sem-jeol-it500"
title: "Scanning Electron Microscope"
model: "JSM-IT500"
manufacturer: "JEOL"
departments:
  - "Materials Science and Engineering"
  - "Electrical Engineering"
location:
  building_id: "cluster-5"
  floor: 2
  room_id: "lab-b-201"
  station_id: "station-sem-1"
media:
  images:
    - "/images/equipment/sem-exterior.png"
    - "/images/equipment/sem-ui.png"
  internal_blueprint: "/images/equipment/sem-schematic.svg"
  ambient_color: "#EF5A24"
physics:
  primary_mechanism: "Focused Electron Beam Scattering"
  mathematical_model: "De Broglie Wavelength"
  equation: "\\lambda = \\frac{h}{p}"
  target_materials:
    - "Metallic fracture surfaces"
    - "Micro-fabricated sensors"
specifications:
  magnification: "5x to 300,000x"
  acceleration_voltage: "0.3 to 30 kV"
  electron_source: "Tungsten Filament"
links:
  - title: "SEM Imaging Protocol"
    url: "https://vgu.edu.vn/sem-guide"
status: "operational"
---

::equipment-story
By focusing high-energy electrons onto a target, this SEM detects secondary electrons emitted from the sample's surface atoms, constructing a high-resolution 3D-like topography scan at nanometer scales.
::

### Pre-run checklist
1. Coat non-conductive samples with gold/carbon before loading.
2. Vent the chamber slowly to prevent pressure shocks.
