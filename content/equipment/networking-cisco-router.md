---
id: "networking-cisco-router"
title: "Enterprise Networking Rack"
model: "Cisco Catalyst 9300"
manufacturer: "Cisco Systems"
departments:
  - "Computer Science"
location:
  building_id: "cluster-2"
  floor: 1
  room_id: "lab-c-102"
  station_id: "station-net-1"
media:
  images:
    - "/images/equipment/sem-exterior.png"
  ambient_color: "#10B981"
physics:
  primary_mechanism: "High-Speed Packet Routing"
  mathematical_model: "Shannon Entropy Channel Capacity"
  equation: "C = B \log_2(1 + S/N)"
  target_materials:
    - "Ethernet packets"
    - "Fiber optic signals"
specifications:
  switching_capacity: "480 Gbps"
  ports: "48x 1G/10G SFP+"
  stacking_bandwidth: "480 Gbps"
links:
  - title: "Cisco Configuration Reference"
    url: "https://vgu.edu.vn/cisco-catalyst"
status: "operational"
---

::equipment-story
High-speed networking hub allowing local loop testing, routing layout optimization, VPN config simulation, and packet analysis training.
::

### Pre-run checklist
1. Wipe configuration state to defaults before starting lab tasks.
2. Check fiber optical transceivers for clean surfaces.
