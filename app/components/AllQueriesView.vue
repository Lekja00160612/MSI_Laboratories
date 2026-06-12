<template>
  <div class="h-full flex flex-col gap-6 p-6 overflow-hidden">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4 shrink-0">
      <div>
        <h2 class="text-xl md:text-3xl font-extrabold text-white tracking-tight">MSI Scientific Equipment Repository</h2>
        <p class="text-xs md:text-sm text-white/50 mt-1">Search and filter across all VGU Materials Science laboratories</p>
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <!-- Mobile Filters Toggle Button -->
        <button 
          @click="showMobileFilters = true" 
          class="flex md:hidden items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1E36] hover:bg-[#EF5A24]/10 border border-[#EF5A24]/30 hover:border-[#EF5A24] text-xs text-[#EF5A24] hover:text-white transition-all duration-300 font-technical flex-1"
        >
          <UIcon name="i-lucide-sliders-horizontal" class="w-3.5 h-3.5" />
          FILTERS
        </button>

        <!-- Back to Map Button -->
        <button 
          @click="emit('back-to-map')" 
          class="flex items-center justify-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-[#0F1E36] hover:bg-[#EF5A24]/10 border border-[#EF5A24]/30 hover:border-[#EF5A24] text-xs md:text-sm text-[#EF5A24] hover:text-white transition-all duration-300 font-technical flex-1 md:flex-initial"
        >
          <span class="md:hidden">← MAP</span>
          <span class="hidden md:inline">← INTERACTIVE CAMPUS MAP</span>
        </button>
      </div>
    </div>

    <!-- Main Content Area: Split into Left Sidebar and Right Grid -->
    <div class="flex-grow flex gap-6 overflow-hidden relative">
      <!-- Backdrop for mobile filter drawer -->
      <div 
        v-if="showMobileFilters" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        @click="showMobileFilters = false"
      ></div>

      <!-- Left-hand vertical filter sidebar -->
      <aside 
        :class="[
          'fixed inset-y-0 left-0 z-50 w-80 max-w-[80vw] flex flex-col gap-6 bg-[#0F1E36] p-5 overflow-y-auto shadow-2xl transition-transform duration-300 ease-out',
          'md:static md:z-auto md:w-80 md:max-w-none md:translate-x-0 md:border md:border-white/10 md:rounded-xl md:shadow-none',
          showMobileFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]"
      >
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <span class="font-technical font-bold text-xs text-[#EF5A24] tracking-widest uppercase">FILTER CONTROLS</span>
          <div class="flex items-center gap-2">
            <UButton 
              v-if="hasActiveFilters" 
              color="neutral" 
              variant="ghost" 
              size="xs" 
              @click="clearFilters"
              class="text-[10px] font-technical uppercase font-bold text-white/40 hover:text-white hover:bg-white/5"
            >
              Clear All
            </UButton>
            <!-- Mobile Close Button -->
            <button 
              @click="showMobileFilters = false" 
              class="md:hidden text-white/60 hover:text-white p-1 hover:bg-white/5 rounded transition-colors flex items-center justify-center"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Search Input -->
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-technical uppercase font-bold text-white/40 tracking-wider">Search Equipment</label>
          <UInput 
            v-model="searchQuery" 
            type="text" 
            placeholder="Type name, category, physics..." 
            icon="i-lucide-search"
            color="neutral"
            variant="outline"
            size="md"
            :ui="{ base: 'ps-8', leading: 'pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2.5', leadingIcon: 'w-4 h-4 text-white/40' }"
            class="w-full"
          />
        </div>

        <!-- Collapsible Departments Filter -->
        <div class="flex flex-col gap-3">
          <UCollapsible v-model:open="collapseDept" class="w-full">
            <template #default="{ open }">
              <UButton 
                color="neutral"
                variant="ghost"
                class="w-full justify-between px-0 font-technical text-[10px] uppercase font-bold text-white/50 hover:text-white hover:bg-transparent"
                :trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                label="Filter Departments"
              />
            </template>
            <template #content>
              <div class="flex flex-col gap-2.5 pl-1 max-h-48 overflow-y-auto pr-1 py-2">
                <UCheckbox
                  v-for="dept in departments"
                  :key="dept"
                  :label="dept"
                  :model-value="selectedDepartments.includes(dept)"
                  @update:model-value="(checked) => toggleDepartment(dept, checked)"
                  class="text-xs text-white/80"
                  color="primary"
                />
              </div>
            </template>
          </UCollapsible>
        </div>

        <!-- Collapsible Categories Filter -->
        <div class="flex flex-col gap-3 border-t border-white/5 pt-4">
          <UCollapsible v-model:open="collapseCat" class="w-full">
            <template #default="{ open }">
              <UButton 
                color="neutral"
                variant="ghost"
                class="w-full justify-between px-0 font-technical text-[10px] uppercase font-bold text-white/50 hover:text-white hover:bg-transparent"
                :trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                label="Filter Categories"
              />
            </template>
            <template #content>
              <div class="flex flex-col gap-2.5 pl-1 max-h-48 overflow-y-auto pr-1 py-2">
                <UCheckbox
                  v-for="cat in categories"
                  :key="cat"
                  :label="cat"
                  :model-value="selectedCategories.includes(cat)"
                  @update:model-value="(checked) => toggleCategory(cat, checked)"
                  class="text-xs text-white/80"
                  color="primary"
                />
              </div>
            </template>
          </UCollapsible>
        </div>

        <!-- Collapsible Rooms Filter -->
        <div class="flex flex-col gap-3 border-t border-white/5 pt-4">
          <UCollapsible v-model:open="collapseRoom" class="w-full">
            <template #default="{ open }">
              <UButton 
                color="neutral"
                variant="ghost"
                class="w-full justify-between px-0 font-technical text-[10px] uppercase font-bold text-white/50 hover:text-white hover:bg-transparent"
                :trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                label="Filter Rooms"
              />
            </template>
            <template #content>
              <div class="flex flex-col gap-2.5 pl-1 py-2">
                <UInput 
                  v-model="roomSearchQuery" 
                  placeholder="Search room..." 
                  size="xs"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-search"
                  :ui="{ base: 'ps-7', leading: 'pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2', leadingIcon: 'w-3.5 h-3.5 text-white/40' }"
                  class="mb-2 w-full"
                />
                <div class="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                  <UCheckbox
                    v-for="room in filteredRoomOptions"
                    :key="room.value"
                    :label="room.label"
                    :model-value="selectedRooms.includes(room.value)"
                    @update:model-value="(checked) => toggleRoom(room.value, checked)"
                    class="text-xs text-white/80"
                    color="primary"
                  />
                </div>
              </div>
            </template>
          </UCollapsible>
        </div>
      </aside>

      <!-- Right-side Cards Grid (Scrollable) -->
      <div class="flex-grow flex flex-col gap-4 overflow-hidden">
        <!-- Results Count -->
        <div class="text-xs font-technical text-white/40 shrink-0">
          FOUND {{ filteredEquipment.length }} / {{ items.length }} INSTRUMENTS
        </div>

        <!-- Cards Container -->
        <div 
          @scroll="handleGridScroll" 
          class="flex-grow overflow-y-auto pr-1"
        >
          <div v-if="filteredEquipment.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            <div 
              v-for="item in paginatedEquipment" 
              :key="item.id"
              class="vgu-panel rounded-xl overflow-hidden hover:vgu-panel-active border border-white/5 hover:border-[#EF5A24]/40 flex flex-col h-[380px] group transition-all duration-300"
            >
              <!-- Card Hero Image -->
              <div class="relative w-full h-40 overflow-hidden bg-slate-950">
                <NuxtImg 
                  v-if="item.media?.images?.length" 
                  :src="item.media.images[0]" 
                  format="avif"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  :alt="item.title"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-white/20 text-xs font-technical">IMAGE NOT FOUND</div>
                <div class="absolute top-3 right-3 bg-[#0C2B5C] border border-[#06B6D4]/30 px-2 py-0.5 rounded text-[9px] font-technical text-[#06B6D4]">
                  {{ item.category || 'Instrument' }}
                </div>
              </div>

              <!-- Card Content -->
              <div class="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <div class="text-[10px] font-technical text-[#EF5A24] font-bold">{{ item.manufacturer }} // {{ item.model }}</div>
                  <h3 class="text-base font-bold text-white mt-1 group-hover:text-[#EF5A24] transition-colors line-clamp-1">{{ item.title }}</h3>
                  
                  <div class="text-xs text-white/50 line-clamp-2 mt-2 leading-relaxed">
                    {{ item.physics?.primary_mechanism }}
                  </div>
                  
                  <!-- Quick Info specs -->
                  <div class="flex flex-wrap gap-1 mt-3">
                    <span 
                      v-for="dept in item.departments" 
                      :key="dept"
                      class="text-[9px] px-2 py-0.5 bg-white/5 text-white/60 border border-white/10 rounded"
                    >
                      {{ dept }}
                    </span>
                  </div>
                </div>

                <!-- Footer button -->
                <div class="flex justify-between items-center border-t border-white/10 pt-3 mt-4">
                  <span class="flex items-center gap-1.5">
                    <span 
                      class="w-2 h-2 rounded-full" 
                      :class="item.status === 'operational' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'"
                    ></span>
                    <span class="text-[9px] font-technical text-white/50 uppercase">{{ item.status }}</span>
                  </span>
                  
                  <button 
                    @click="emit('select-item', item)" 
                    class="text-xs font-technical text-[#EF5A24] hover:underline animate-pulse"
                  >
                    PROFILE CODE_ACCESS →
                  </button>
                </div>
              </div>
            </div>

            <!-- Infinite Scroll indicator -->
            <div 
              v-if="displayLimit < filteredEquipment.length" 
              class="col-span-full py-6 flex flex-col items-center justify-center gap-2 text-white/40"
            >
              <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin text-[#EF5A24]" />
              <span class="text-[10px] font-technical uppercase tracking-wider">LOADING MORE INSTRUMENTS...</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center gap-2 py-20 text-white/30 border border-dashed border-white/10 rounded-xl">
            <div class="text-lg font-technical">NO EQUIPMENT MATCHES FILTERS</div>
            <div class="text-xs">Try clearing checkboxes or searching for other keywords</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-item', 'back-to-map'])

const searchQuery = ref('')
const selectedDepartments = ref([])
const selectedCategories = ref([])
const selectedRooms = ref([])

const roomSearchQuery = ref('')

const collapseDept = ref(true)
const collapseCat = ref(true)
const collapseRoom = ref(true)

const showMobileFilters = ref(false)
const displayLimit = ref(6)

// Reset display limit when filters change
watch([searchQuery, selectedDepartments, selectedCategories, selectedRooms], () => {
  displayLimit.value = 6
})

function handleGridScroll(e) {
  const container = e.target
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
    if (displayLimit.value < filteredEquipment.value.length) {
      displayLimit.value += 6
    }
  }
}

// Active filter state check
const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || 
         selectedDepartments.value.length > 0 || 
         selectedCategories.value.length > 0 || 
         selectedRooms.value.length > 0
})

// Toggle selection helpers
function toggleDepartment(dept, checked) {
  if (checked) {
    if (!selectedDepartments.value.includes(dept)) {
      selectedDepartments.value.push(dept)
    }
  } else {
    selectedDepartments.value = selectedDepartments.value.filter(d => d !== dept)
  }
}

function toggleCategory(cat, checked) {
  if (checked) {
    if (!selectedCategories.value.includes(cat)) {
      selectedCategories.value.push(cat)
    }
  } else {
    selectedCategories.value = selectedCategories.value.filter(c => c !== cat)
  }
}

function toggleRoom(room, checked) {
  if (checked) {
    if (!selectedRooms.value.includes(room)) {
      selectedRooms.value.push(room)
    }
  } else {
    selectedRooms.value = selectedRooms.value.filter(r => r !== room)
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedDepartments.value = []
  selectedCategories.value = []
  selectedRooms.value = []
  roomSearchQuery.value = ''
}

// Compute available options dynamically
const departments = computed(() => {
  const depts = new Set()
  props.items.forEach(item => {
    if (item.departments) {
      item.departments.forEach(d => depts.add(d))
    }
  })
  return Array.from(depts).sort()
})

const categories = computed(() => {
  const cats = new Set()
  props.items.forEach(item => {
    if (item.category) {
      cats.add(item.category)
    }
  })
  return Array.from(cats).sort()
})

const roomsOptions = computed(() => {
  const rms = new Set()
  props.items.forEach(item => {
    if (item.location?.room_id) {
      rms.add(item.location.room_id)
    }
  })
  return Array.from(rms).map(r => ({
    label: r.replace('lab-', '').replace('room-', '').toUpperCase(),
    value: r
  })).sort((a, b) => a.label.localeCompare(b.label))
})

// Filter rooms locally in sidebar search
const filteredRoomOptions = computed(() => {
  if (!roomSearchQuery.value) return roomsOptions.value
  return roomsOptions.value.filter(r => 
    r.label.toLowerCase().includes(roomSearchQuery.value.toLowerCase())
  )
})

// Filter grid items
const filteredEquipment = computed(() => {
  return props.items.filter(item => {
    // Search query
    const matchSearch = searchQuery.value 
      ? (item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
         item.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
         (item.physics?.primary_mechanism?.toLowerCase() || '').includes(searchQuery.value.toLowerCase()) ||
         (item.physics?.mathematical_model?.toLowerCase() || '').includes(searchQuery.value.toLowerCase()))
      : true

    // Multi-Select Department matching (OR within filter)
    const matchDept = selectedDepartments.value.length
      ? (item.departments && item.departments.some(d => selectedDepartments.value.includes(d)))
      : true

    // Multi-Select Category matching (OR within filter)
    const matchCat = selectedCategories.value.length
      ? selectedCategories.value.includes(item.category)
      : true

    // Multi-Select Room matching (OR within filter)
    const matchRoom = selectedRooms.value.length
      ? selectedRooms.value.includes(item.location?.room_id)
      : true

    return matchSearch && matchDept && matchCat && matchRoom
  })
})

const paginatedEquipment = computed(() => {
  return filteredEquipment.value.slice(0, displayLimit.value)
})
</script>
