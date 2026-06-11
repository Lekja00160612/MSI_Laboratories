---
id: "hplc-agilent-1260"
title: "High-Performance Liquid Chromatograph"
model: "Agilent Infinity 1260"
manufacturer: "Agilent Technologies"
departments:
  - "Chemistry"
location:
  building_id: "cluster-1"
  floor: 1
  room_id: "b1-103"
  station_id: "station-ch-1"
media:
  images:
    - "/images/equipment/xrd-exterior.png"
  ambient_color: "#EC4899"
physics:
  primary_mechanism: "High Pressure Liquid Phase Separation"
  mathematical_model: "Van Deemter Equation"
  equation: "H = A + \frac{B}{u} + C \cdot u"
  target_materials:
    - "Organic solvent mixtures"
    - "Polymer solutions"
specifications:
  pressure_range: "Up to 600 bar"
  flow_range: "0.05 to 5.0 mL/min"
  detector: "Diode Array Detector (DAD)"
links:
  - title: "Agilent 1260 Protocol"
    url: "https://vgu.edu.vn/agilent-guide"
status: "operational"
---

::equipment-story
Separates components within chemical mixtures by pushing liquid solvents at extreme pressures through separation columns packed with solid particles, detecting molecules as they exit.

This high-performance liquid chromatography setup enables separating organic polymers and chemicals with high resolution and reproducibility. The mobile phase carrier fluid is pumped through columns containing active chemical layers, allowing compound separation by size, charge, or solubility. The resulting eluent peaks are analyzed using a diode array detector (DAD) spanning wavelengths from UV to visible ranges.
::

### Pre-run checklist
1. Flush column with clean mobile phase prior to injection.
2. Degas solvents to prevent bubble traps in pumps.
