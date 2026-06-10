---
id: "xrd-bruker-d8"
title: "High-Resolution X-Ray Diffractometer"
model: "D8 Advance"
manufacturer: "Bruker"
departments:
  - "Materials Science and Engineering"
  - "Applied Physics"
location:
  building_id: "cluster-1"
  floor: 1
  room_id: "lab-b-104"
  station_id: "station-xrd-1"
media:
  images:
    - "/images/equipment/xrd-exterior.png"
    - "/images/equipment/xrd-front.png"
  internal_blueprint: "/images/equipment/xrd-schematic.svg"
  ambient_color: "#EF5A24"
physics:
  primary_mechanism: "Constructive X-Ray Interference"
  mathematical_model: "Bragg's Law"
  equation: "n\\lambda = 2d \\sin\\theta"
  target_materials:
    - "Crystalline Powders"
    - "Thin Films"
specifications:
  voltage: "40 kV"
  current: "40 mA"
  detector: "LYNXEYE XE-T"
  radiation_source: "Cu K-alpha (\\lambda = 1.5418 Å)"
links:
  - title: "VGU Booking Portal"
    url: "https://booking.vgu.edu.vn/xrd"
  - title: "Bragg Scattering Guide (Physics LibreTexts)"
    url: "https://phys.libretexts.org/Bragg_Scattering"
status: "operational"
---

::equipment-story
When accelerated electrons strike the copper target inside the tube, they generate characteristic X-rays. These collimated X-rays impinge on the rotating sample. At specific incident angles satisfying **Bragg's Law**, constructive interference occurs, generating a diffraction peak recorded by the detector.
::

### Operational Guideline
1. Run a sample standard calibration check before long measurements.
2. Verify water cooling level is above 80% before activating current.
