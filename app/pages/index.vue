<template>
  <div class="relative w-screen h-screen bg-[#070A12] text-white flex flex-col overflow-hidden font-sans">
    <!-- Navbar / Cyber HUD Bar -->
    <header class="h-16 border-b border-[#EF5A24]/20 bg-[#0F1E36]/80 backdrop-blur-md px-6 flex items-center justify-between z-30 shrink-0">
      <div class="flex items-center gap-3">
        <!-- VGU Branded Badge -->
        <div class="bg-[#EF5A24] text-white px-3 py-1 rounded-md text-sm font-technical font-extrabold uppercase tracking-wider shadow-[0_0_10px_#EF5A24]">
          VGU
        </div>
        <div class="hidden sm:block">
          <h1 class="text-sm font-bold text-white uppercase tracking-wider">LABORATORIES GALLERY</h1>
          <span class="text-[10px] text-[#06B6D4] font-technical tracking-widest uppercase">MSI DIGITAL TWIN v1.0</span>
        </div>
      </div>
      
      <!-- Top Nav controls -->
      <div class="flex items-center gap-2 sm:gap-4">
        <button 
          @click="toggleView('map')" 
          :class="[
            'px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-technical border transition-all duration-300',
            activeView === 'map' 
              ? 'bg-[#EF5A24]/10 border-[#EF5A24] text-[#EF5A24]' 
              : 'border-white/15 text-white/60 hover:text-white'
          ]"
        >
          INTERACTIVE MAP
        </button>
        <button 
          @click="toggleView('queries')" 
          :class="[
            'px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-technical border transition-all duration-300',
            activeView === 'queries' 
              ? 'bg-[#EF5A24]/10 border-[#EF5A24] text-[#EF5A24]' 
              : 'border-white/15 text-white/60 hover:text-white'
          ]"
        >
          ALL INSTRUMENTS
        </button>
      </div>
    </header>

    <!-- Main View Switcher -->
    <main class="flex-grow relative overflow-hidden">
      <!-- 1. Interactive Spatial Map View -->
      <div v-show="activeView === 'map'" class="w-full h-full flex flex-col md:flex-row relative">
        <!-- Sidebar Navigation (Desktop) -->
        <aside 
          :class="[
            'w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-[#070A12]/95 z-20 shrink-0 flex flex-col transition-all duration-300',
            isMapFullscreen ? 'h-12 overflow-hidden' : 'h-1/3 md:h-full'
          ]"
        >
          <!-- Single Line Header Mode (Fullscreen mobile map) -->
          <div v-if="isMapFullscreen" class="md:hidden flex items-center justify-between px-5 h-12 shrink-0 bg-[#0F1E36]/30 border-b border-white/10">
            <div v-if="selectedBuilding" class="flex items-center gap-2">
              <button @click="resetToCampus" class="text-[#EF5A24] text-xs hover:underline flex items-center gap-1 font-technical">
                ← CAMPUS
              </button>
              <span class="text-white/30 text-xs">/</span>
              <span class="text-xs text-white/60 uppercase font-bold truncate max-w-[160px]">{{ selectedBuilding.replace('-', ' ') }}</span>
            </div>
            <div v-else class="flex items-center">
              <span class="text-xs font-technical font-bold text-[#EF5A24] tracking-widest uppercase">VGU CAMPUS OVERVIEW</span>
            </div>
            <span class="text-[9px] font-technical text-[#06B6D4]/80 font-bold uppercase tracking-wider animate-pulse">MAP EXPANDED</span>
          </div>

          <!-- Standard Sidebar Content -->
          <div :class="['flex-grow flex flex-col overflow-hidden', { 'hidden md:flex': isMapFullscreen }]">
            <div class="p-5 flex flex-col gap-4 overflow-y-auto h-full">
              <!-- State A: Campus Map overview -->
              <div v-if="!selectedBuilding" class="flex flex-col gap-4">
                <h2 class="text-lg font-bold text-[#EF5A24]">VGU Campus Blocks</h2>
                <p class="text-xs text-white/50 leading-relaxed">
                  Click on the highlighted academic blocks on the interactive map or select below to explore laboratories.
                </p>
                <div class="flex flex-col gap-2.5 mt-2">
                  <button 
                    v-for="(tele, bId) in clusterTelemetry"
                    :key="bId"
                    @click="selectedBuilding = bId; selectedFloor = 1"
                    class="relative flex items-center justify-between p-4 rounded-xl bg-[#0F1E36]/30 border border-white/10 hover:border-[#EF5A24] hover:bg-[#EF5A24]/5 hover:shadow-[0_0_15px_rgba(239,90,36,0.15)] text-left transition-all duration-300 group overflow-hidden"
                  >
                    <!-- Cyber corner decorations -->
                    <span class="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#EF5A24]/30 group-hover:border-[#EF5A24] transition-colors"></span>
                    <span class="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#EF5A24]/30 group-hover:border-[#EF5A24] transition-colors"></span>
                    <span class="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#EF5A24]/30 group-hover:border-[#EF5A24] transition-colors"></span>
                    <span class="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#EF5A24]/30 group-hover:border-[#EF5A24] transition-colors"></span>

                    <div class="flex items-center gap-3">
                      <div 
                        class="w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300"
                        :class="[
                          bId === 'cluster-1' || bId === 'cluster-5' 
                            ? 'border-[#EF5A24]/20 group-hover:border-[#EF5A24] text-[#EF5A24] bg-[#EF5A24]/5' 
                            : 'border-[#06B6D4]/20 group-hover:border-[#06B6D4] text-[#06B6D4] bg-[#06B6D4]/5'
                        ]"
                      >
                        <UIcon :name="tele.icon" class="w-5 h-5" />
                      </div>
                      <div>
                        <div class="font-technical text-[10px] font-bold text-white/50 tracking-wider flex items-center gap-1.5">
                          <span>{{ tele.code }}</span>
                          <span class="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                          <span class="text-[8px] font-normal uppercase">ACTIVE</span>
                        </div>
                        <div class="font-extrabold text-sm text-white mt-0.5 group-hover:text-[#EF5A24] transition-colors">{{ tele.label }}</div>
                      </div>
                    </div>
                    
                    <div class="text-right flex flex-col items-end">
                      <span class="text-[10px] font-technical text-white/80 font-bold">LABS: {{ tele.labsCount }}</span>
                      <span class="text-[9px] font-technical text-white/40 mt-0.5">UNITS: {{ tele.equipCount }}</span>
                    </div>
                  </button>
                </div>
              </div>

              <!-- State B: Building Floor details view -->
              <div v-else class="flex flex-col gap-4">
                <div class="flex items-center gap-2">
                  <button @click="resetToCampus" class="text-[#EF5A24] text-xs hover:underline">← CAMPUS</button>
                  <span class="text-white/30 text-xs">/</span>
                  <span class="text-xs text-white/60 uppercase font-bold">{{ selectedBuilding.replace('-', ' ') }}</span>
                </div>

                <h2 class="text-lg font-bold text-white">Floor {{ selectedFloor }} Rooms</h2>
                <div class="flex flex-col gap-2 mt-2">
                  <button 
                    v-for="room in filteredRooms" 
                    :key="room.room_id"
                    @click="selectRoom(room.room_id)"
                    :class="[
                      'flex flex-col gap-1 p-3 rounded-lg border text-left text-xs transition-all duration-300',
                      selectedRoomId === room.room_id
                        ? 'bg-[#EF5A24]/10 border-[#EF5A24] text-[#EF5A24]'
                        : 'bg-[#0F1E36]/50 border-white/5 hover:border-white/20'
                    ]"
                  >
                    <div class="font-bold text-white flex justify-between">
                      <span>{{ room.room_id.toUpperCase() }}</span>
                      <span class="text-[9px] text-[#06B6D4] font-technical uppercase font-normal">{{ room.status }}</span>
                    </div>
                    <div class="text-[11px] text-white/60 line-clamp-1 mt-1">{{ room.name }}</div>
                  </button>
                  <div v-if="!filteredRooms.length" class="text-xs text-white/40 italic py-4">
                    No laboratories populated on this floor yet.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Interactive Map Canvas -->
        <div :class="['flex-grow relative z-10 transition-all duration-300', isMapFullscreen ? 'h-[calc(100%-3rem)]' : 'h-2/3 md:h-full']">
          <!-- Floating Fullscreen Toggle Button on Mobile -->
          <button 
            @click="isMapFullscreen = !isMapFullscreen" 
            class="md:hidden absolute top-16 sm:top-20 right-4 z-30 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F1E36]/90 hover:bg-[#EF5A24]/10 border border-[#EF5A24]/30 hover:border-[#EF5A24] text-[10px] text-[#EF5A24] hover:text-white transition-all duration-300 font-technical shadow-lg backdrop-blur-md"
          >
            <UIcon :name="isMapFullscreen ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'" class="w-3.5 h-3.5" />
            <span>{{ isMapFullscreen ? 'EXIT FULL' : 'FULL MAP' }}</span>
          </button>

          <VguMap 
            :selected-building="selectedBuilding"
            :selected-floor="selectedFloor"
            @select-building="selectBuilding"
            @select-floor="selectFloor"
            @select-room="selectRoom"
            @reset="resetToCampus"
          />
        </div>

        <!-- Room Detail Sidebar Drawer (Highlighted Machines Only) -->
        <Transition name="slide-in">
          <div 
            v-if="selectedRoomDetail" 
            class="absolute top-0 right-0 z-30 w-full md:w-[420px] h-full bg-[#070A12]/95 border-l border-[#EF5A24]/30 flex flex-col shadow-2xl"
          >
            <!-- Drawer Header -->
            <div class="p-5 border-b border-white/10 flex justify-between items-start">
              <div>
                <span class="text-[10px] font-technical text-[#EF5A24] uppercase font-bold tracking-wider">
                  {{ selectedRoomDetail.building_id.toUpperCase() }} // FLOOR {{ selectedRoomDetail.floor }}
                </span>
                <h3 class="text-xl font-bold text-white mt-1">{{ selectedRoomDetail.name }}</h3>
                <span class="text-xs text-white/50">{{ selectedRoomDetail.departments[0] }}</span>
              </div>
              <button 
                @click="closeRoomDrawer" 
                class="text-white/40 hover:text-white transition-colors border border-white/10 hover:border-white/30 p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <!-- Drawer Content -->
            <div class="flex-grow overflow-y-auto p-5 flex flex-col gap-6">
              <!-- Lab Lead info -->
              <div class="vgu-panel p-3.5 rounded-lg border border-white/5 text-xs flex flex-col gap-1 bg-white/5">
                <div class="text-white/40 font-technical uppercase tracking-wider font-semibold">Laboratory Coordinator</div>
                <div class="text-white font-bold text-sm mt-0.5">{{ selectedRoomDetail.head_of_lab.name }}</div>
                <div class="text-white/60">Office: {{ selectedRoomDetail.head_of_lab.office }}</div>
                <div class="text-[#06B6D4] font-technical">{{ selectedRoomDetail.head_of_lab.email }}</div>
              </div>

              <!-- MDC Content overview rendering -->
              <div class="text-xs leading-relaxed text-white/80 border-b border-white/10 pb-4 select-text">
                <ContentRenderer v-if="selectedRoomDetail.body" :value="selectedRoomDetail" />
                <p v-else>{{ selectedRoomDetail.description }}</p>
              </div>

              <!-- Highlighted Machinery Section -->
              <div class="flex flex-col gap-3">
                <div class="text-[#EF5A24] text-xs font-technical uppercase font-bold tracking-widest">
                  Featured Instruments ({{ highlightedMachines.length }})
                </div>

                <div v-if="highlightedMachines.length" class="flex flex-col gap-3">
                  <div 
                    v-for="mach in highlightedMachines" 
                    :key="mach.id"
                    @click="openEquipmentDetail(mach)"
                    class="vgu-panel p-3.5 rounded-lg border border-white/5 hover:border-[#EF5A24]/50 cursor-pointer flex gap-3 group transition-all duration-300"
                  >
                    <!-- Thumb image -->
                    <div class="w-16 h-12 bg-slate-950 rounded overflow-hidden shrink-0 border border-white/10">
                      <NuxtImg v-if="mach.media?.images?.length" :src="mach.media.images[0]" format="avif" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-grow min-w-0">
                      <div class="text-[9px] font-technical text-white/40">{{ mach.manufacturer }} // {{ mach.model }}</div>
                      <div class="text-xs font-bold text-white group-hover:text-[#EF5A24] transition-colors truncate mt-0.5">{{ mach.title }}</div>
                      <div class="text-[9px] text-[#06B6D4] font-technical mt-1 uppercase">{{ mach.status }}</div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-xs text-white/30 italic py-4 bg-white/5 border border-dashed border-white/10 rounded-lg text-center">
                  No highlighted instruments available.
                </div>
              </div>
            </div>

            <!-- View All / Redirect Button -->
            <div class="p-4 border-t border-white/10 bg-[#0F1E36]/40 flex flex-col gap-2 shrink-0">
              <button 
                @click="openRoomTour(selectedRoomDetail)" 
                class="w-full bg-[#EF5A24] hover:bg-[#EF5A24]/90 text-white font-technical font-bold text-xs py-3 rounded-lg text-center shadow-[0_0_15px_rgba(239,90,36,0.3)] transition-all duration-300"
              >
                VIEW ALL MACHINES IN THIS ROOM
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 2. Map-Free All Queries Search View -->
      <div v-show="activeView === 'queries'" class="w-full h-full bg-[#070A12]">
        <AllQueriesView 
          :items="equipment" 
          @back-to-map="toggleView('map')" 
          @select-item="openEquipmentDetail"
        />
      </div>

      <!-- Overlapping Immersive Equipment Profile Drawer -->
      <Transition name="slide-in">
        <div 
          v-if="selectedEquipment" 
          class="fixed inset-0 z-[60] w-full h-full bg-[#070A12] shadow-2xl"
        >
          <EquipmentDetail 
            :item="selectedEquipment" 
            @close="closeEquipmentDetail" 
          />
        </div>
      </Transition>

      <!-- Fullscreen Immersive Lab Room Tour View -->
      <Transition name="slide-in">
        <div 
          v-if="selectedRoomTour" 
          class="fixed inset-0 z-50 w-full h-full bg-[#070A12] shadow-2xl"
        >
          <LabRoomTour 
            :room="selectedRoomTour" 
            :equipment="roomTourEquipment" 
            @close="closeRoomTour" 
            @select-equipment="openEquipmentDetailFromTour"
          />
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const activeView = ref('map')
const selectedBuilding = ref(null)
const selectedFloor = ref(null)
const selectedRoomId = ref(null)
const selectedEquipment = ref(null)
const selectedRoomTour = ref(null)
const isMapFullscreen = ref(false)

// 1. Fetch data collections from Nuxt Content v3
const { data: labs } = await useAsyncData('labs', () => queryCollection('labs').all())
const { data: equipment } = await useAsyncData('equipment', () => queryCollection('equipment').all())

const labsList = computed(() => labs.value || [])
const equipmentList = computed(() => equipment.value || [])

// 2. Fetch the floorplan GeoJSON dynamically in the parent to support comprehensive room listing
const currentFloorGeojson = ref(null)

watch([selectedBuilding, selectedFloor], async ([newB, newF]) => {
  if (!newB || !newF) {
    currentFloorGeojson.value = null
    return
  }
  try {
    const res = await fetch(`/data/floorplans/msi-floor${newF}.json`)
    currentFloorGeojson.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch floorplan json', err)
    currentFloorGeojson.value = null
  }
}, { immediate: true })

const config = useRuntimeConfig()
const displayOnlyRoomsWithMachines = computed(() => config.public.displayOnlyRoomsWithMachines)

// 3. Computed filtering operations
const filteredRooms = computed(() => {
  if (!selectedBuilding.value || !selectedFloor.value) return []
  
  // Get all rooms from labs collection on this floor
  const labRooms = labsList.value.filter(
    room => room.building_id === selectedBuilding.value && room.floor === selectedFloor.value
  )
  
  if (displayOnlyRoomsWithMachines.value) {
    return labRooms.map(lr => ({
      room_id: lr.room_id,
      name: lr.name,
      status: lr.status || 'active'
    }))
  }
  
  // Otherwise, get all rooms from floorplan JSON excluding structural items
  if (!currentFloorGeojson.value) return []
  
  return currentFloorGeojson.value.features
    .filter(f => 
      f.properties.building_id === selectedBuilding.value &&
      f.properties.type === 'laboratory'
    )
    .map(f => {
      const matchingLab = labRooms.find(lr => lr.room_id === f.properties.room_id)
      return {
        room_id: f.properties.room_id,
        name: matchingLab ? matchingLab.name : f.properties.name,
        status: matchingLab ? matchingLab.status : 'active'
      }
    })
})

const selectedRoomDetail = computed(() => {
  if (!selectedRoomId.value) return null
  
  // Find in labs collection first
  const lab = labsList.value.find(room => room.room_id === selectedRoomId.value)
  if (lab) return lab
  
  // Fallback to GeoJSON properties
  if (!currentFloorGeojson.value) return null
  const feature = currentFloorGeojson.value.features.find(f => f.properties.room_id === selectedRoomId.value)
  if (!feature) return null
  
  return {
    room_id: feature.properties.room_id,
    name: feature.properties.name,
    building_id: feature.properties.building_id,
    floor: feature.properties.level,
    departments: [feature.properties.department || 'General Academic'],
    head_of_lab: {
      name: "TBD",
      email: "facilities@vgu.edu.vn",
      office: "Facilities Office"
    },
    status: "active",
    highlighted_equipment: [],
    description: "This laboratory cell is designated for research and study. Full instrumentation and staffing inventories are pending the next phase of the digital twin projection."
  }
})

const highlightedMachines = computed(() => {
  if (!selectedRoomDetail.value || !selectedRoomDetail.value.highlighted_equipment) return []
  const hlIds = selectedRoomDetail.value.highlighted_equipment
  return equipmentList.value.filter(mach => {
    const baseId = mach.id.split('/').pop().replace(/\.md$/, '')
    return hlIds.includes(baseId) || hlIds.includes(mach.id)
  })
})

const roomTourEquipment = computed(() => {
  if (!selectedRoomTour.value) return []
  return equipmentList.value.filter(
    mach => mach.location?.room_id === selectedRoomTour.value.room_id
  )
})

// 4. Cluster dynamic stats telemetry
const clusterTelemetry = computed(() => {
  const data = {
    'cluster-1': { label: 'Cluster 1', code: 'SEC-A1', icon: 'i-lucide-atom' },
    'cluster-2': { label: 'Cluster 2', code: 'SEC-A2', icon: 'i-lucide-binary' },
    'cluster-3': { label: 'Cluster 3', code: 'SEC-A3', icon: 'i-lucide-settings' },
    'cluster-5': { label: 'Cluster 5', code: 'SEC-B5', icon: 'i-lucide-flask-conical' },
    'cluster-6': { label: 'Cluster 6', code: 'SEC-B6', icon: 'i-lucide-trending-up' }
  }
  
  const stats = {}
  Object.keys(data).forEach(c => {
    const cLabs = labsList.value.filter(l => l.building_id === c)
    const cEquip = equipmentList.value.filter(e => e.location?.building_id === c)
    stats[c] = {
      ...data[c],
      labsCount: cLabs.length,
      equipCount: cEquip.length
    }
  })
  return stats
})

// 3. Selection Handlers
function toggleView(viewName) {
  activeView.value = viewName
  if (viewName !== 'map') {
    isMapFullscreen.value = false
  }
}

function selectBuilding(buildingId) {
  selectedBuilding.value = buildingId
  selectedFloor.value = 1 // default to floor 1
  selectedRoomId.value = null
}

function selectFloor(floorNum) {
  selectedFloor.value = floorNum
  selectedRoomId.value = null
}

function selectRoom(roomId) {
  selectedRoomId.value = roomId
}

function resetToCampus() {
  selectedBuilding.value = null
  selectedFloor.value = null
  selectedRoomId.value = null
}

function closeRoomDrawer() {
  selectedRoomId.value = null
}

function openEquipmentDetail(mach) {
  selectedEquipment.value = mach
}

function closeEquipmentDetail() {
  selectedEquipment.value = null
}

function openAllQueriesForRoom() {
  activeView.value = 'queries'
}

function openRoomTour(room) {
  selectedRoomTour.value = room
}

function closeRoomTour() {
  selectedRoomTour.value = null
}

function openEquipmentDetailFromTour(mach) {
  selectedEquipment.value = mach
}
</script>

<style scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(100%);
}
</style>
