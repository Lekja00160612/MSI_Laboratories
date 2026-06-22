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
    - src: "/images/equipment/furnace-exterior.png"
      title: "Chamber Outer Profile"
      highlighted: true
      position: 40
    - src: "/images/equipment/sem-exterior.png"
      title: "Secondary Scanning Visual"
      position: 41
    - src: "/images/equipment/sem-exterior.png"
      title: "Ternary Scanning Visual"
      position: 42
    - src: "/images/equipment/sem-exterior.png"
      title: "Quaternary Scanning Visual"
      position: 43
  model_3d:
    src: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"
    title: "Diagnostic: 3D Chamber Model"
    position: 10
    render_mode: "realistic"
    auto_rotate: true
  video:
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    title: "Chamber Sintering Demonstration"
    position: 30
  internal_blueprint:
    src: "/images/equipment/furnace-schematic.svg"
    title: "Diagnostic: Internal Heat Loop"
    target_image: "/images/equipment/furnace-exterior.png"
    position: 20
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
  safety:
    - "Never open the tube flange while the temperature is above 100 °C."
    - "Ensure positive pressure ventilation is active for exhaust lines."
    - "High voltage heating elements are insulated; do not bypass safety relays."
  procedures:
    - "Purge chamber with argon for 10 minutes to displace oxygen."
    - "Establish vacuum seal of 10^-3 mbar before thermal ramp."
    - "Set PID controller ramp parameters (max 10 °C/min)."
  maintenance: "Yearly inspection of heating elements and thermocouple calibration required."
status: "operational"
---

::equipment-story
By surrounding a quartz or alumina tube with high-performance heating elements, this system sinters alloys or deposits thin-films under vacuum or inert atmosphere conditions at temperatures up to 1200 °C.

This high-temperature tube furnace is VGU's workhorse for sintering composite alloys, recrystallizing materials, and executing chemical vapor deposition (CVD) steps under tightly regulated vacuum seals. It features automated cooling fans, digital PID controllers for precise thermal ramps, and high-efficiency alumina insulation. Research applications include testing semiconductor interfaces, processing polymer-ceramic matrices, and crystallizing thin films.
::
