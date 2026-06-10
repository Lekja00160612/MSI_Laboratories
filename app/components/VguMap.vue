<template>
  <div class="relative w-full h-full">
    <!-- Map Container -->
    <div ref="mapContainer" class="w-full h-full rounded-lg overflow-hidden border border-[#EF5A24]/10 shadow-2xl"></div>

    <!-- Unified Top Context HUD Bar -->
    <div class="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-xl pointer-events-none">
      <div class="vgu-panel px-5 py-2.5 rounded-lg text-xs font-technical flex items-center justify-between border border-[#EF5A24]/30 shadow-lg bg-[#0F1E36]/90 backdrop-blur-md">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#EF5A24] animate-pulse"></span>
          <span class="text-[#EF5A24] font-bold uppercase tracking-wider">
            {{ hudContextTitle }}
          </span>
        </div>
        <div class="text-[#06B6D4] font-semibold text-[9px] uppercase tracking-widest hidden sm:block">
          {{ hudContextGuidance }}
        </div>
      </div>
    </div>

    <!-- Map Overlay Controls -->
    <div class="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
      <div class="vgu-panel px-4 py-2 rounded-lg text-xs font-technical flex flex-col gap-1">
        <div class="text-[#EF5A24] font-bold">VGU MSI HOLOGRAPHIC MAP</div>
        <div class="text-white/60">LAT: {{ mapCenter[1].toFixed(4) }} | LON: {{ mapCenter[0].toFixed(4) }}</div>
        <div class="text-white/60">ZOOM: {{ zoomLevel.toFixed(1) }} | PITCH: {{ pitchLevel }}°</div>
      </div>
    </div>

    <!-- Right Hand Elevator UI (Floors) -->
    <div v-if="selectedBuilding" class="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 bg-[#0F1E36]/90 backdrop-blur-md border border-[#EF5A24]/30 p-2 rounded-full shadow-lg">
      <button 
        v-for="floorNum in floors" 
        :key="floorNum" 
        @click="selectFloor(floorNum)"
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center text-xs font-technical font-bold border transition-all duration-300',
          selectedFloor === floorNum 
            ? 'bg-[#EF5A24] border-[#EF5A24] text-white shadow-[0_0_10px_#EF5A24]' 
            : 'border-white/10 hover:border-[#EF5A24]/60 text-white/70 hover:text-white'
        ]"
      >
        L{{ floorNum }}
      </button>
      <button 
        @click="resetMap" 
        class="w-10 h-10 rounded-full flex items-center justify-center text-xs border border-[#EF5A24]/20 text-[#EF5A24] hover:bg-[#EF5A24]/10 transition-all duration-300"
        title="Exit Building"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const hudContextTitle = computed(() => {
  if (!props.selectedBuilding) {
    return 'FOCUS: VGU CAMPUS OVERVIEW'
  }
  const nameMap = {
    'cluster-1': 'Academic Cluster 1',
    'cluster-2': 'Academic Cluster 2',
    'cluster-3': 'Academic Cluster 3',
    'cluster-5': 'Academic Cluster 5',
    'cluster-6': 'Academic Cluster 6'
  }
  const buildingName = nameMap[props.selectedBuilding] || props.selectedBuilding.replace('-', ' ').toUpperCase()
  if (props.selectedFloor) {
    return `FOCUS: ${buildingName} // FLOOR ${props.selectedFloor}`
  }
  return `FOCUS: ${buildingName}`
})

const hudContextGuidance = computed(() => {
  if (!props.selectedBuilding) {
    return 'CLICK A CLUSTER TO ENTER INTERNAL LAB CELLS'
  }
  return 'USE ELEVATOR HUD ON THE RIGHT TO CHANGE LEVELS'
})

const props = defineProps({
  selectedBuilding: {
    type: String,
    default: null
  },
  selectedFloor: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['select-building', 'select-floor', 'select-room', 'reset'])

const mapContainer = ref(null)
let map = null

const zoomLevel = ref(16.5)
const pitchLevel = ref(45)
const mapCenter = ref([106.6155, 11.1083])
const floors = [2, 1] // Available floors in Block B

// Initialize Map
onMounted(() => {
  if (!mapContainer.value) return

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
          maxzoom: 19
        }
      },
      layers: [
        {
          id: 'osm-raster',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 22
        }
      ]
    },
    center: [106.6155, 11.1083],
    zoom: 16.5,
    pitch: 45,
    bearing: -20
  })

  // Listen to camera events for UI display
  map.on('zoom', () => {
    zoomLevel.value = map.getZoom()
  })
  map.on('pitch', () => {
    pitchLevel.value = Math.round(map.getPitch())
  })
  map.on('move', () => {
    const center = map.getCenter()
    mapCenter.value = [center.lng, center.lat]
  })

  map.on('load', () => {
    // Add VGU Buildings Shell Data
    map.addSource('vgu-buildings', {
      type: 'geojson',
      data: '/data/floorplans/campus-buildings.json'
    })

    // Add 3D building extrusions
    map.addLayer({
      id: 'vgu-buildings-extrusion',
      type: 'fill-extrusion',
      source: 'vgu-buildings',
      paint: {
        'fill-extrusion-color': '#0C2B5C',
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'base_height'],
        'fill-extrusion-opacity': 0.75
      }
    })

    // Glowing outline for buildings
    map.addLayer({
      id: 'vgu-buildings-outline',
      type: 'line',
      source: 'vgu-buildings',
      paint: {
        'line-color': '#EF5A24',
        'line-width': 1.5,
        'line-opacity': 0.6
      }
    })

    // Add empty source for Floorplans to be loaded dynamically
    map.addSource('vgu-floorplan', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    // Add room layers
    map.addLayer({
      id: 'vgu-rooms-fill',
      type: 'fill',
      source: 'vgu-floorplan',
      paint: {
        'fill-color': [
          'match',
          ['get', 'department'],
          'Materials Science', '#EF5A24',
          'Chemical Engineering', '#06B6D4',
          'Applied Physics', '#8B5CF6',
          'Chemistry', '#EC4899',
          'Electrical Engineering', '#3B82F6',
          'Computer Science', '#10B981',
          'Mechanical Engineering', '#34D399',
          'Mechatronics', '#14B8A6',
          'Civil Engineering', '#6B7280',
          'Finance', '#F59E0B',
          'Business Administration', '#F59E0B',
          'General Education', '#4B5563',
          '#1E293B'
        ],
        'fill-opacity': 0.4
      },
      layout: {
        visibility: 'none'
      }
    })

    // Add room outlines
    map.addLayer({
      id: 'vgu-rooms-outline',
      type: 'line',
      source: 'vgu-floorplan',
      paint: {
        'line-color': '#EF5A24',
        'line-width': 2,
        'line-opacity': 0.8
      },
      layout: {
        visibility: 'none'
      }
    })

    // Interaction handlers
    map.on('click', 'vgu-buildings-extrusion', (e) => {
      if (!e.features || !e.features[0]) return
      const bProps = e.features[0].properties
      emit('select-building', bProps.building_id)
    })

    map.on('click', 'vgu-rooms-fill', (e) => {
      if (!e.features || !e.features[0]) return
      const rProps = e.features[0].properties
      emit('select-room', rProps.room_id)
    })

    // Pointer feedback
    map.on('mouseenter', 'vgu-buildings-extrusion', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'vgu-buildings-extrusion', () => {
      map.getCanvas().style.cursor = ''
    })

    map.on('mouseenter', 'vgu-rooms-fill', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'vgu-rooms-fill', () => {
      map.getCanvas().style.cursor = ''
    })

    // If a building is already selected on load, apply initial filters
    if (props.selectedBuilding) {
      map.setFilter('vgu-buildings-extrusion', ['!=', ['get', 'building_id'], props.selectedBuilding])
      map.setFilter('vgu-buildings-outline', ['!=', ['get', 'building_id'], props.selectedBuilding])
      map.setFilter('vgu-rooms-fill', ['==', ['get', 'building_id'], props.selectedBuilding])
      map.setFilter('vgu-rooms-outline', ['==', ['get', 'building_id'], props.selectedBuilding])
      
      if (props.selectedFloor) {
        loadFloorplan(props.selectedFloor)
      }
    } else {
      renderClusterLabels()
    }
  })
})

onUnmounted(() => {
  if (map) map.remove()
  clearRoomMarkers()
  clearClusterMarkers()
})

const buildingCenters = {
  'cluster-1': [106.6150547, 11.1086567],
  'cluster-2': [106.6152379, 11.1081542],
  'cluster-3': [106.6154201, 11.1077056],
  'cluster-5': [106.6160420, 11.1088469],
  'cluster-6': [106.6162763, 11.1081780]
}

let clusterMarkers = []

function clearClusterMarkers() {
  clusterMarkers.forEach(m => m.remove())
  clusterMarkers = []
}

function renderClusterLabels() {
  clearClusterMarkers()
  if (props.selectedBuilding) return // Hide when a building is selected
  
  const clusters = [
    { id: 'cluster-1', label: 'Cluster 1', name: 'Materials Science / Physics', coords: [106.6150547, 11.1086567] },
    { id: 'cluster-2', label: 'Cluster 2', name: 'Electrical Engineering / IT / CS', coords: [106.6152379, 11.1081542] },
    { id: 'cluster-3', label: 'Cluster 3', name: 'Mechanical Eng. / Mechatronics', coords: [106.6154201, 11.1077056] },
    { id: 'cluster-5', label: 'Cluster 5', name: 'Chemical & Civil Engineering', coords: [106.6160420, 11.1088469] },
    { id: 'cluster-6', label: 'Cluster 6', name: 'Business / Finance', coords: [106.6162763, 11.1081780] }
  ]

  clusters.forEach(c => {
    const el = document.createElement('div')
    el.className = 'absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer transition-all duration-300'
    el.innerHTML = `
      <div class="flex flex-col items-center group">
        <!-- Cluster Node Tag -->
        <div class="px-3.5 py-2 rounded bg-[#0F1E36]/95 border border-[#06B6D4]/30 hover:border-[#EF5A24] text-white shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 text-center min-w-[130px]">
          <div class="text-[10px] font-technical font-extrabold text-[#EF5A24] uppercase tracking-wider">${c.label}</div>
          <div class="text-[8px] text-white/60 font-sans mt-0.5 leading-tight">${c.name}</div>
          <div class="text-[8px] font-technical text-[#06B6D4] mt-1.5 uppercase font-bold tracking-widest animate-pulse">ENTER BLOCK →</div>
        </div>
      </div>
    `

    el.addEventListener('click', (e) => {
      e.stopPropagation()
      emit('select-building', c.id)
    })

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat(c.coords)
      .addTo(map)

    clusterMarkers.push(marker)
  })
}

let roomMarkers = []

function clearRoomMarkers() {
  roomMarkers.forEach(marker => marker.remove())
  roomMarkers = []
}

function getPolygonCentroid(coordinates) {
  const pts = coordinates[0]
  let sumLon = 0
  let sumLat = 0
  const count = pts.length - 1
  for (let i = 0; i < count; i++) {
    sumLon += pts[i][0]
    sumLat += pts[i][1]
  }
  return [sumLon / count, sumLat / count]
}

async function loadFloorplan(floorNum) {
  if (!map || !map.isStyleLoaded()) return
  try {
    const res = await fetch(`/data/floorplans/msi-floor${floorNum}.json`)
    const data = await res.json()
    const source = map.getSource('vgu-floorplan')
    if (source) {
      source.setData(data)
      map.setLayoutProperty('vgu-rooms-fill', 'visibility', 'visible')
      map.setLayoutProperty('vgu-rooms-outline', 'visibility', 'visible')
    }

    // Clear previous room markers
    clearRoomMarkers()

    // Add HTML markers for rooms inside the selected building
    if (props.selectedBuilding) {
      const bRooms = data.features.filter(f => f.properties.building_id === props.selectedBuilding)
      bRooms.forEach(room => {
        const centroid = getPolygonCentroid(room.geometry.coordinates)
        const roomId = room.properties.room_id.replace('lab-', '').replace('room-', '').toUpperCase()
        const roomName = room.properties.name

        // Create HTML element for the marker
        const el = document.createElement('div')
        el.className = 'absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto transition-all duration-300'
        el.innerHTML = `
          <div class="flex flex-col items-center group cursor-pointer">
            <!-- Pulsing Dot -->
            <div class="relative w-3.5 h-3.5 flex items-center justify-center">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF5A24] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#EF5A24]"></span>
            </div>
            <!-- Label Tag -->
            <div class="mt-2 px-3 py-1.5 rounded bg-[#0F1E36]/95 border border-[#EF5A24]/30 hover:border-[#EF5A24] text-white shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-105 text-center max-w-[140px] pointer-events-auto">
              <div class="text-[10px] font-technical font-extrabold text-[#EF5A24] uppercase tracking-wider">${roomId}</div>
              <div class="text-[9px] text-white/80 font-sans leading-tight mt-0.5 line-clamp-2">${roomName}</div>
            </div>
          </div>
        `

        // Bind click handler
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          emit('select-room', room.properties.room_id)
        })

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(centroid)
          .addTo(map)

        roomMarkers.push(marker)
      })
    }
  } catch (err) {
    console.error('Failed to load floorplan data', err)
  }
}

// Watch building selection to zoom and toggle layers
watch(() => props.selectedBuilding, async (newBuilding) => {
  if (!map || !map.isStyleLoaded()) return

  if (newBuilding) {
    // Clear cluster labels
    clearClusterMarkers()

    // Zoom into specific cluster
    const coords = buildingCenters[newBuilding] || [106.6155, 11.1083]
    map.flyTo({
      center: coords,
      zoom: 19.5,
      pitch: 0, // Top down to explore floorplans
      bearing: 0,
      duration: 1500
    })

    // Hide ONLY the selected building shell to reveal its interior (holographic/X-ray cutaway effect)
    map.setFilter('vgu-buildings-extrusion', ['!=', ['get', 'building_id'], newBuilding])
    map.setFilter('vgu-buildings-outline', ['!=', ['get', 'building_id'], newBuilding])
    
    // Set filters for room layers
    map.setFilter('vgu-rooms-fill', ['==', ['get', 'building_id'], newBuilding])
    map.setFilter('vgu-rooms-outline', ['==', ['get', 'building_id'], newBuilding])

    if (props.selectedFloor) {
      await loadFloorplan(props.selectedFloor)
    }
  } else {
    // Zoom out to campus view
    map.flyTo({
      center: [106.6155, 11.1083],
      zoom: 16.5,
      pitch: 45,
      bearing: -20,
      duration: 1500
    })

    // Restore all shells
    map.setFilter('vgu-buildings-extrusion', null)
    map.setFilter('vgu-buildings-outline', null)
    
    // Hide floorplan layers and reset filters
    map.setFilter('vgu-rooms-fill', null)
    map.setFilter('vgu-rooms-outline', null)
    map.setLayoutProperty('vgu-rooms-fill', 'visibility', 'none')
    map.setLayoutProperty('vgu-rooms-outline', 'visibility', 'none')

    // Clear room HTML markers
    clearRoomMarkers()

    // Restore cluster labels
    renderClusterLabels()
  }
})

// Watch floor changes to reload room GeoJSON
watch(() => props.selectedFloor, async (newFloor) => {
  if (!map || !map.isStyleLoaded() || !props.selectedBuilding) return

  if (newFloor) {
    await loadFloorplan(newFloor)
  } else {
    // Hide floorplan layers
    map.setLayoutProperty('vgu-rooms-fill', 'visibility', 'none')
    map.setLayoutProperty('vgu-rooms-outline', 'visibility', 'none')
  }
})

function selectFloor(floorNum) {
  emit('select-floor', floorNum)
}

function resetMap() {
  emit('reset')
}
</script>

<style scoped>
/* Ensure maplibre popups align correctly with theme */
:deep(.maplibregl-popup-content) {
  background: rgba(15, 30, 54, 0.9) !important;
  border: 1px solid rgba(239, 90, 36, 0.4) !important;
  color: white !important;
  font-family: 'Be Vietnam Pro', sans-serif;
  backdrop-filter: blur(8px);
}
:deep(.maplibregl-popup-tip) {
  border-top-color: rgba(15, 30, 54, 0.9) !important;
}
</style>
