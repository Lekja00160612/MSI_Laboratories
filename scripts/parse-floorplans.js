import fs from 'fs';
import path from 'path';

const labsDir = 'd:/OVGU/MSI_Laboratories/content/labs';
const csvBaseDir = 'd:/OVGU/MSI_Laboratories/content/floor_plans';
const outputDir = 'd:/OVGU/MSI_Laboratories/public/data/floorplans';

// 1. Parse markdown frontmatter manually to avoid extra dependencies
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!match) return {};
  const yaml = match[1];
  const obj = {};
  yaml.split(/\r?\n/).forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      }
      obj[key] = value;
    }
  });
  return obj;
}

function getLabFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getLabFiles(fullPath));
    } else if (file.endsWith('.md')) {
      results.push(fullPath);
    }
  });
  return results;
}

// Load metadata for all labs
const labsMetadata = {};
const labFiles = getLabFiles(labsDir);
labFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const metadata = parseFrontmatter(content);
    if (metadata.room_id) {
      labsMetadata[metadata.room_id.toLowerCase()] = metadata;
    }
  } catch (err) {
    console.error(`Failed to parse lab file: ${file}`, err);
  }
});

// Affine coefficients solved earlier
const b1Coeffs = {
  a: 8.953441376466221e-9,
  b: -3.1497975865435756e-9,
  c: 106.61539732322666,
  d: 3.182455243237762e-9,
  e: 8.530074661663595e-9,
  f: 11.108226425177252
};

const b5Coeffs = {
  a: 9.348060047786096e-9,
  b: -3.137160929858734e-9,
  c: 106.61606158856533,
  d: 3.3218630132168528e-9,
  e: 8.497975978545847e-9,
  f: 11.108450685256834
};

const suffixes = ['1st', '2nd', '3rd', '4th', '5th'];

for (let floor = 1; floor <= 5; floor++) {
  const suffix = suffixes[floor - 1];
  const floorJsonPath = path.join(outputDir, `msi-floor${floor}.json`);

  // Load existing floor plan if it exists
  let keptFeatures = [];
  if (fs.existsSync(floorJsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(floorJsonPath, 'utf-8'));
      if (data.features) {
        // Keep non-CAD procedural fallback features
        keptFeatures = data.features.filter(
          f => f.properties && f.properties.building_id !== 'cluster-1' && f.properties.building_id !== 'cluster-5'
        );
      }
    } catch (err) {
      console.warn(`Could not read existing floorplan JSON at ${floorJsonPath}, starting fresh.`, err);
    }
  }

  const newFeatures = [];

  // Parse Cluster 1 (B1) and Cluster 5 (B5) CSV files
  [
    { buildingId: 'cluster-1', folder: 'B1', filePrefix: 'B1-', coeffs: b1Coeffs },
    { buildingId: 'cluster-5', folder: 'B5', filePrefix: 'B5-', coeffs: b5Coeffs }
  ].forEach(target => {
    const csvPath = path.join(csvBaseDir, target.folder, `${target.filePrefix}${suffix}.csv`);
    if (!fs.existsSync(csvPath)) return;

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split(/\r?\n/);
    
    // Group segments by Room_Number and Loop_Index
    const roomSegments = {};

    lines.forEach((line, index) => {
      if (index === 0 || !line.trim()) return; // skip header
      const cols = line.split(';');
      if (cols.length < 7) return;

      const roomNumber = cols[0].trim();
      const loopIndex = parseInt(cols[1].trim());
      const startX = parseFloat(cols[3].trim());
      const startY = parseFloat(cols[4].trim());
      const endX = parseFloat(cols[5].trim());
      const endY = parseFloat(cols[6].trim());

      const key = `${roomNumber}_${loopIndex}`;
      if (!roomSegments[key]) {
        roomSegments[key] = [];
      }
      roomSegments[key].push({ startX, startY, endX, endY });
    });

    // Solve and reconstruct polygons for each room/loop
    Object.keys(roomSegments).forEach(key => {
      const segments = roomSegments[key];
      if (segments.length === 0) return;

      const [roomNumber, loopIndex] = key.split('_');

      // Chaining segments into a closed loop
      const points = [];
      const unvisited = [...segments];

      // Start with the first segment
      const first = unvisited.shift();
      points.push([first.startX, first.startY]);
      let currentEnd = [first.endX, first.endY];

      while (unvisited.length > 0) {
        let found = false;
        for (let i = 0; i < unvisited.length; i++) {
          const seg = unvisited[i];
          const distStart = Math.hypot(seg.startX - currentEnd[0], seg.startY - currentEnd[1]);
          const distEnd = Math.hypot(seg.endX - currentEnd[0], seg.endY - currentEnd[1]);

          if (distStart < 10.0) { // CAD tolerance (e.g. 10mm)
            points.push([seg.startX, seg.startY]);
            currentEnd = [seg.endX, seg.endY];
            unvisited.splice(i, 1);
            found = true;
            break;
          } else if (distEnd < 10.0) {
            points.push([seg.endX, seg.endY]);
            currentEnd = [seg.startX, seg.startY];
            unvisited.splice(i, 1);
            found = true;
            break;
          }
        }
        if (!found) {
          // Fallback: push the next start point to prevent infinite loops if CAD loops are broken
          const fallback = unvisited.shift();
          points.push([fallback.startX, fallback.startY]);
          currentEnd = [fallback.endX, fallback.endY];
        }
      }
      // Close the ring
      points.push(points[0]);

      // Transform CAD coordinate points to Lat/Lon using Affine parameters
      const latLonCoordinates = points.map(pt => {
        const x = pt[0];
        const y = pt[1];
        const lon = target.coeffs.a * x + target.coeffs.b * y + target.coeffs.c;
        const lat = target.coeffs.d * x + target.coeffs.e * y + target.coeffs.f;
        return [lon, lat];
      });

      const normalizedRoomId = roomNumber.toLowerCase();
      const metadata = labsMetadata[normalizedRoomId];

      let name = `Academic Cell ${roomNumber}`;
      let type = 'laboratory';
      let department = 'General Education';

      if (metadata) {
        name = metadata.name || name;
        type = 'laboratory';
        department = metadata.departments ? metadata.departments[0] : department;
      } else {
        if (/wc|toilet/i.test(normalizedRoomId)) {
          name = 'Restroom';
          type = 'service';
        } else if (/jc|janitor/i.test(normalizedRoomId)) {
          name = 'Janitor Closet';
          type = 'service';
        } else if (/cr|corridor/i.test(normalizedRoomId)) {
          name = 'Corridor';
          type = 'corridor';
        } else if (/lobby|hall/i.test(normalizedRoomId)) {
          name = 'Lobby';
          type = 'lobby';
        } else if (/office/i.test(normalizedRoomId)) {
          name = 'Office';
          type = 'office';
        } else if (/room|class/i.test(normalizedRoomId)) {
          name = `Room ${roomNumber}`;
          type = 'classroom';
        }
      }

      newFeatures.push({
        type: 'Feature',
        id: `room-${normalizedRoomId}`,
        geometry: {
          type: 'Polygon',
          coordinates: [latLonCoordinates]
        },
        properties: {
          room_id: normalizedRoomId,
          name,
          type,
          department,
          building_id: target.buildingId,
          level: floor
        }
      });
    });
  });

  const finalGeojson = {
    type: 'FeatureCollection',
    features: [...keptFeatures, ...newFeatures]
  };

  fs.writeFileSync(floorJsonPath, JSON.stringify(finalGeojson, null, 2), 'utf-8');
  console.log(`Successfully parsed and saved ${finalGeojson.features.length} features to ${floorJsonPath}`);
}
