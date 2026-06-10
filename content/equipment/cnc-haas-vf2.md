---
id: "cnc-haas-vf2"
title: "CNC Vertical Machining Center"
model: "Haas VF-2"
manufacturer: "Haas Automation"
departments:
  - "Mechanical Engineering"
location:
  building_id: "cluster-3"
  floor: 1
  room_id: "lab-d-101"
  station_id: "station-cnc-1"
media:
  images:
    - "/images/equipment/furnace-exterior.png"
  ambient_color: "#34D399"
physics:
  primary_mechanism: "Rotary Chip Removal Cutting"
  mathematical_model: "Cutting Speed Relation"
  equation: "V_c = \frac{\pi \cdot d \cdot n}{1000}"
  target_materials:
    - "Aluminium 6061"
    - "Medium Carbon Steel"
specifications:
  spindle_speed: "8100 rpm"
  axis_travel_x_y_z: "762 x 406 x 508 mm"
  motor_power: "30 hp"
links:
  - title: "CNC Machining Protocol"
    url: "https://vgu.edu.vn/cnc-guide"
status: "operational"
---

::equipment-story
High precision CNC mill designed to carve complex components and test pieces directly out of metal block cylinders following programmed G-code specifications.
::

### Pre-run checklist
1. Verify coolant levels are clean and filled.
2. Execute tool path simulations before doing physical spindle runs.
