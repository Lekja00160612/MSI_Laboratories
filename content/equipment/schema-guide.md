# Scientific Equipment Frontmatter Schema Guide

This guide is designed for VGU laboratory engineers. It explains how to define frontmatter schemas for instruments in `content/equipment/`, how to structure custom data, and how custom frontmatter fields automatically compile into interactive tabs in the Digital Twin interface.

---

## 1. Schema Overview

The equipment collection parses Markdown files containing frontmatter (YAML) blocks at the top, followed by the main markdown text block. 

* **Required fields** serve as core system metadata.
* **Optional / Custom fields** are automatically rendered in the user interface as dedicated, glowing cyberpunk tabs.

---

## 2. Required Frontmatter Fields

These fields must be populated in every equipment file. Omitting them will cause Nuxt build or validation errors.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | A unique lowercase identifier matching the filename (e.g., `hplc-agilent-1260`). |
| `title` | String | The human-readable name of the machine (e.g., `High-Performance Liquid Chromatograph`). |
| `model` | String | The exact manufacturer model (e.g., `Agilent Infinity 1260`). |
| `manufacturer` | String | The brand or manufacturer (e.g., `Agilent Technologies`). |
| `departments` | Array of strings | List of academic divisions hosting the equipment (e.g., `["Chemistry", "Applied Physics"]`). |
| `location` | Object | Sub-fields: `building_id` (e.g. `cluster-1`), `floor` (Integer), `room_id` (e.g. `b1-103`), `station_id` (e.g. `station-ch-1`). |
| `media` | Object | Interactive media elements. Sub-fields: `images` (Array of strings or objects containing `src`, `title`, optional `position` integer, and optional `highlighted: true` boolean), `model_3d` (Optional string path or object with `src`, `title`, `position`, optional `render_mode` (`"realistic"`/`"hologram"`), and optional `auto_rotate` (`true`/`false`)), `video` (Optional string path or object with `src`, `title`, and `position`), `internal_blueprint` (Optional string path or object with `src`, `title`, `position`, and optional `target_image` cover override path), `ambient_color` (Optional HEX color). |
| `status` | String | The system status (typically `operational` or `maintenance`). |

---

## 3. Optional & Custom Fields (Automatic UI Tabs)

Lab engineers have complete freedom to customize their machine contents. Any custom key defined under the `optional_information` block in the frontmatter will **automatically generate a dedicated tab** in the interactive browser details. You can add as many fields as you need (e.g. `safety`, `procedures`, `maintenance`, `calibration`, `diagnostics`, `operational_history`, etc.). The UI formats the tab content dynamically based on the YAML data structure.

### Supported Data Types & UI Renderings

#### A. Special Objects (e.g. `physics`)
If the field is named `physics` inside `optional_information`, the UI formats it as a dedicated scientific card:
```yaml
optional_information:
  physics:
    primary_mechanism: "High Pressure Liquid Phase Separation"
    mathematical_model: "Van Deemter Equation"
    equation: "H = A + \\frac{B}{u} + C \\cdot u"
    target_materials:
      - "Organic solvent mixtures"
      - "Polymer solutions"
```
* **LaTeX Math Equations:** Backslashes inside double-quoted YAML strings **must** be escaped with double backslashes (e.g., `\\frac` instead of `\frac`, `\\nu` instead of `\nu`). Otherwise, they parse incorrectly as control characters (e.g., Form Feed or Newline).

#### B. Array of Links (e.g. `links` or custom links)
If the field is an array of objects containing `title` and `url` inside `optional_information`, the UI renders them as clickable cyberpunk action buttons:
```yaml
optional_information:
  links:
    - title: "Agilent 1260 Protocol Bookings"
      url: "https://booking.vgu.edu.vn/xrd"
```

#### C. Key-Value Records (e.g. `specifications` or custom records)
If the field is a record map inside `optional_information`, the UI renders it as a structured technical grid:
```yaml
optional_information:
  specifications:
    pressure_range: "Up to 600 bar"
    flow_range: "0.05 to 5.0 mL/min"
    detector: "Diode Array Detector (DAD)"
```

#### D. Array of Strings (e.g. `safety`, `procedures` or custom steps)
If the field is a list of strings inside `optional_information`, the UI renders it as a numbered operational checklist:
```yaml
optional_information:
  procedures:
    - "Flush column with clean mobile phase prior to injection."
    - "Degas solvents to prevent bubble traps in pumps."
```

#### E. Plain String
If the field is a flat string inside `optional_information`, the UI renders it as a styled paragraph:
```yaml
optional_information:
  maintenance: "Last inspected on June 12, 2026. Recalibration scheduled in 30 days."
```

---

## 4. Complete Markdown Template

Below is a complete copy-pasteable example of an instrument file containing both required metadata and custom tabs:

```markdown
---
id: "sample-instrument"
title: "Sample Scientific Instrument"
model: "VGU-Model-Alpha"
manufacturer: "Global Tech Inc."
departments:
  - "Applied Physics"
location:
  building_id: "cluster-1"
  floor: 1
  room_id: "b1-103"
  station_id: "station-test-1"
media:
  images:
    - src: "/images/equipment/furnace-exterior.png"
      title: "Chamber Outer Profile"
      highlighted: true  # Flags this as the main card preview image in search/tour views
      position: 40
    - src: "/images/equipment/sem-exterior.png"
      title: "Scanning Microscope Detail"
      position: 41
  model_3d:
    src: "/3d/furnace.glb"
    title: "Diagnostic: 3D Chamber Model"
    position: 10         # Custom order position in the diagnostic carousel
    render_mode: "hologram"  # Optional: Default render mode ("realistic" or "hologram")
    auto_rotate: true    # Optional: Enable/disable auto-rotation (true or false)
  video:
    src: "/images/equipment/furnace-process.mp4"
    title: "Chamber Sintering Demonstration"
    position: 30
  internal_blueprint:
    src: "/images/equipment/furnace-schematic.svg"
    title: "Diagnostic: Internal Heat Loop"
    target_image: "/images/equipment/furnace-exterior.png" # Specific cover photo to show behind the X-Ray cutout
    position: 20
  ambient_color: "#EF5A24"
status: "operational"

# All custom/optional fields must be grouped under optional_information
optional_information:
  # 1. Physics Tab (Object)
  physics:
    primary_mechanism: "Laser Beam Deflection"
    mathematical_model: "Einstein Wave Equation"
    equation: "E = h\\nu"
    target_materials:
      - "Semiconductors"

  # 2. Specifications Tab (Record)
  specifications:
    wavelength: "532 nm"
    output_power: "5 mW"

  # 3. Links Tab (Array of Links)
  links:
    - title: "VGU Booking Guide"
      url: "https://booking.vgu.edu.vn"

  # 4. Procedures Tab (Array of Strings)
  procedures:
    - "Verify optical alignments at low power."
    - "Activate nitrogen purge valve."

  # 5. Maintenance Tab (Plain String)
  maintenance: "Yearly optical bench alignment calibration required."
---

::equipment-story
This is the main summary overview. It will render in the primary 'Overview' tab of the details view.
::
```
