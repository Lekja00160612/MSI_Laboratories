---
id: "furnace-carbolite"
title: "High-Temperature Tube Furnace"
model: "HST 12/600"
manufacturer: "Carbolite Gero"
category: "Thermal Processing"
departments:
  - "Materials Science and Engineering"
  - "Chemical Engineering"
location:
  building_id: "cluster-1"
  floor: 1
  room_id: "b1-103"
  station_id: "station-furnace-1"
media:
  images:
    - "/images/equipment/furnace-exterior.png"
  internal_blueprint: "/images/equipment/furnace-schematic.svg"
  ambient_color: "#EF5A24"
optional_information:
  physics:
    primary_mechanism: "Radiative and Convective Heating"
    mathematical_model: "Stefan-Boltzmann Law"
    equation: "P = \\epsilon \\sigma A T^4"
    target_materials:
      - "Alloy ingots for sintering"
      - "Glass substrates"
  specifications:
    max_temperature: "1200 °C"
    heated_length: "600 mm"
    atmosphere_control: "Vacuum / Inert Gas (Ar, N2)"
  links:
    - title: "High Temp Thermal Treatments Info"
      url: "https://vgu.edu.vn/furnace-safety"
status: "operational"
---

::equipment-story
By surrounding a quartz or alumina tube with high-performance heating elements, this system sinters alloys or deposits thin-films under vacuum or inert atmosphere conditions at temperatures up to 1200 °C.

This high-temperature tube furnace is VGU's workhorse for sintering composite alloys, recrystallizing materials, and executing chemical vapor deposition (CVD) steps under tightly regulated vacuum seals. It features automated cooling fans, digital PID controllers for precise thermal ramps, and high-efficiency alumina insulation. Research applications include testing semiconductor interfaces, processing polymer-ceramic matrices, and crystallizing thin films.
::

### Safety Notes
1. Never open the tube flange while the temperature is above 100 °C.
2. Verify gas flow pressure matches safety regulations before ignition.
