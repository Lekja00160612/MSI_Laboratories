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
      <div class="flex items-center gap-4">
        <button 
          @click="toggleView('map')" 
          :class="[
            'px-4 py-1.5 rounded-lg text-xs font-technical border transition-all duration-300',
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
            'px-4 py-1.5 rounded-lg text-xs font-technical border transition-all duration-300',
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
        <aside class="w-full md:w-80 border-r border-white/10 bg-[#070A12]/95 z-20 shrink-0 flex flex-col h-1/3 md:h-full transition-all duration-300">
          <div class="p-5 flex flex-col gap-4 overflow-y-auto h-full">
            <!-- State A: Campus Map overview -->
            <div v-if="!selectedBuilding" class="flex flex-col gap-4">
              <h2 class="text-lg font-bold text-[#EF5A24]">VGU Campus Blocks</h2>
              <p class="text-xs text-white/50 leading-relaxed">
                Click on the highlighted academic blocks on the interactive map or select below to explore laboratories.
              </p>
              <div class="flex flex-col gap-2.5 mt-2">
                <button 
                  @click="selectedBuilding = 'cluster-1'; selectedFloor = 1"
                  class="flex items-center justify-between p-3 rounded-lg bg-[#0F1E36]/50 border border-white/5 hover:border-[#EF5A24]/40 hover:bg-[#EF5A24]/5 text-left text-xs transition-all duration-300"
                >
                  <div>
                    <div class="font-bold text-white">Academic Cluster 1</div>
                    <div class="text-[10px] text-white/50 mt-1">Materials Science, Physics, Chemistry</div>
                  </div>
                  <span class="text-[#EF5A24]">→</span>
                </button>
                <button 
                  @click="selectedBuilding = 'cluster-2'; selectedFloor = 1"
                  class="flex items-center justify-between p-3 rounded-lg bg-[#0F1E36]/50 border border-white/5 hover:border-[#EF5A24]/40 hover:bg-[#EF5A24]/5 text-left text-xs transition-all duration-300"
                >
                  <div>
                    <div class="font-bold text-white">Academic Cluster 2</div>
                    <div class="text-[10px] text-white/50 mt-1">Electrical Engineering, IT, CS</div>
                  </div>
                  <span class="text-[#EF5A24]">→</span>
                </button>
                <button 
                  @click="selectedBuilding = 'cluster-3'; selectedFloor = 1"
                  class="flex items-center justify-between p-3 rounded-lg bg-[#0F1E36]/50 border border-white/5 hover:border-[#EF5A24]/40 hover:bg-[#EF5A24]/5 text-left text-xs transition-all duration-300"
                >
                  <div>
                    <div class="font-bold text-white">Academic Cluster 3</div>
                    <div class="text-[10px] text-white/50 mt-1">Mechanical Eng., Mechatronics</div>
                  </div>
                  <span class="text-[#EF5A24]">→</span>
                </button>
                <button 
                  @click="selectedBuilding = 'cluster-5'; selectedFloor = 1"
                  class="flex items-center justify-between p-3 rounded-lg bg-[#0F1E36]/50 border border-white/5 hover:border-[#EF5A24]/40 hover:bg-[#EF5A24]/5 text-left text-xs transition-all duration-300"
                >
                  <div>
                    <div class="font-bold text-white">Academic Cluster 5</div>
                    <div class="text-[10px] text-white/50 mt-1">Chemical & Civil Engineering</div>
                  </div>
                  <span class="text-[#EF5A24]">→</span>
                </button>
                <button 
                  @click="selectedBuilding = 'cluster-6'; selectedFloor = 1"
                  class="flex items-center justify-between p-3 rounded-lg bg-[#0F1E36]/50 border border-white/5 hover:border-[#EF5A24]/40 hover:bg-[#EF5A24]/5 text-left text-xs transition-all duration-300"
                >
                  <div>
                    <div class="font-bold text-white">Academic Cluster 6</div>
                    <div class="text-[10px] text-white/50 mt-1">Business Administration, Finance</div>
                  </div>
                  <span class="text-[#EF5A24]">→</span>
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
        </aside>

        <!-- Interactive Map Canvas -->
        <div class="flex-grow h-2/3 md:h-full relative z-10">
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
              <div class="text-xs leading-relaxed text-white/80 border-b border-white/10 pb-4">
                <ContentRenderer :value="selectedRoomDetail" />
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
import { ref, computed } from 'vue'

const activeView = ref('map')
const selectedBuilding = ref(null)
const selectedFloor = ref(null)
const selectedRoomId = ref(null)
const selectedEquipment = ref(null)
const selectedRoomTour = ref(null)

// 1. Fetch data collections from Nuxt Content v3
const { data: labs } = await useAsyncData('labs', () => queryCollection('labs').all())
const { data: equipment } = await useAsyncData('equipment', () => queryCollection('equipment').all())

const labsList = computed(() => labs.value || [])
const equipmentList = computed(() => equipment.value || [])

// 2. Computed filtering operations
const filteredRooms = computed(() => {
  if (!selectedBuilding.value || !selectedFloor.value) return []
  return labsList.value.filter(
    room => room.building_id === selectedBuilding.value && room.floor === selectedFloor.value
  )
})

const selectedRoomDetail = computed(() => {
  if (!selectedRoomId.value) return null
  return labsList.value.find(room => room.room_id === selectedRoomId.value) || null
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
    mach => mach.location.room_id === selectedRoomTour.value.room_id
  )
})

// 3. Selection Handlers
function toggleView(viewName) {
  activeView.value = viewName
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
