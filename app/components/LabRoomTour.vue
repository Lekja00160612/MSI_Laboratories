<template>
  <div v-if="room" class="fixed inset-0 z-50 bg-[#070A12] text-white flex flex-col font-sans select-none">
    <!-- Visual Cyber Scan Overlays -->
    <div class="absolute inset-0 pointer-events-none z-45 scanline laser-scan"></div>

    <!-- Fixed Cyber Header -->
    <header class="fixed top-0 left-0 right-0 h-16 border-b border-[#EF5A24]/20 bg-[#0F1E36]/90 backdrop-blur-md px-6 flex items-center justify-between z-50">
      <div class="flex items-center gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          @click="emit('close')"
          class="text-white/60 hover:text-white font-technical text-xs font-bold uppercase tracking-wider hover:bg-white/5"
        >
          Back to Map
        </UButton>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-xs font-technical text-[#EF5A24] uppercase font-bold tracking-widest hidden sm:block">
          {{ room.building_id.toUpperCase() }} // FLOOR {{ room.floor }} // CELL {{ room.room_id.replace('lab-', '').replace('room-', '').toUpperCase() }}
        </span>
        <UBadge color="warning" variant="subtle" class="font-technical uppercase text-[9px] tracking-widest px-2.5 py-1">
          CELL STATE: {{ room.status }}
        </UBadge>
      </div>
    </header>

    <!-- Visual Scroll Progress Tracker -->
    <div class="fixed top-16 left-0 right-0 h-[3px] bg-white/5 z-50">
      <div 
        class="h-full bg-gradient-to-r from-[#EF5A24] to-[#06B6D4] transition-all duration-75 shadow-[0_0_8px_#06B6D4]"
        :style="{ width: `${scrollPercent}%` }"
      ></div>
    </div>

    <!-- Snap Scrollable Fullscreen Presentation Container -->
    <div 
      ref="scrollContainer"
      @scroll="handleScroll"
      class="flex-grow snap-y snap-mandatory scroll-smooth overflow-y-auto w-full h-full"
    >
      <!-- Slide 0: Lab Overview / Introduction -->
      <section class="h-screen w-full snap-start shrink-0 relative flex flex-col lg:flex-row pt-16 overflow-hidden">
        <!-- Left Column: Intimidating Widescreen Lab Image & Reticle HUD -->
        <div class="lg:w-3/5 relative h-1/2 lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 bg-black flex items-center justify-center">
          <NuxtImg 
            :src="labImages[0]" 
            format="avif"
            class="w-full h-full object-cover filter brightness-[0.85] contrast-[1.10]" 
            alt="Laboratory Widescreen Interior"
          />

          <!-- Scanning Crosshair overlay -->
          <div 
            ref="reticleContainer"
            class="absolute inset-0 z-30 cursor-crosshair pointer-events-auto"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
          >
            <div 
              v-if="isHovering" 
              class="absolute w-24 h-24 border border-[#06B6D4]/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
              :style="{ left: `${mouseX}%`, top: `${mouseY}%` }"
            >
              <div class="w-1.5 h-1.5 bg-[#EF5A24] rounded-full"></div>
              <span class="absolute w-3 h-[1px] bg-[#06B6D4] -top-1"></span>
              <span class="absolute w-3 h-[1px] bg-[#06B6D4] -bottom-1"></span>
              <span class="absolute w-[1px] h-3 bg-[#06B6D4] -left-1"></span>
              <span class="absolute w-[1px] h-3 bg-[#06B6D4] -right-1"></span>
              <span class="absolute -bottom-6 font-technical text-[8px] text-[#06B6D4] font-bold bg-[#070A12]/80 px-1 rounded whitespace-nowrap uppercase tracking-widest">
                HUD LOCK: EXPLORE_CELL
              </span>
            </div>
          </div>

          <!-- Bottom HUD Panel -->
          <div class="absolute bottom-4 left-4 right-4 z-45 bg-[#0F1E36]/90 border border-[#06B6D4]/20 p-3.5 rounded-lg backdrop-blur-sm pointer-events-none flex justify-between items-center text-[10px] font-technical text-white/80">
            <div class="flex items-center gap-4">
              <div><span class="text-[#EF5A24] font-bold">ATMOSPHERE:</span> NOMINAL</div>
              <div class="hidden sm:block"><span class="text-[#06B6D4] font-bold">TEMP:</span> 21.8°C</div>
              <div class="hidden sm:block"><span class="text-[#06B6D4] font-bold">HUMIDITY:</span> 42%</div>
            </div>
            <div>
              <span class="text-[#EF5A24] font-bold">GRID CALIBRATION:</span> ACTIVE
            </div>
          </div>
        </div>

        <!-- Right Column: Lab Profile Specs & Safe Instructions -->
        <div class="lg:w-2/5 relative h-1/2 lg:h-full overflow-y-auto p-6 md:p-8 flex flex-col gap-6 bg-[#0F1E36]/10">
          <div class="flex flex-col gap-1">
            <span class="text-[#EF5A24] text-xs font-technical uppercase font-extrabold tracking-widest">LAB MANDATE</span>
            <h2 class="text-xl md:text-2xl font-extrabold text-white leading-snug">{{ room.name }}</h2>
            <div class="flex gap-2 flex-wrap mt-2">
              <UBadge v-for="dept in room.departments" :key="dept" variant="outline" color="info" class="font-technical text-[9px] uppercase tracking-wider">
                {{ dept }}
              </UBadge>
            </div>
          </div>

          <!-- Leadership Card -->
          <UCard class="bg-[#0F1E36]/40 border border-[#06B6D4]/20">
            <template #header>
              <div class="text-[#06B6D4] text-[10px] font-technical uppercase font-bold tracking-wider">Laboratory Leadership</div>
            </template>
            <div class="flex items-center gap-4 text-xs">
              <div class="w-10 h-10 rounded-lg bg-[#0C2B5C] border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] font-bold text-base">
                {{ room.head_of_lab?.name?.split(' ').pop().charAt(0) || '?' }}
              </div>
              <div>
                <div class="font-bold text-white leading-tight">{{ room.head_of_lab?.name }}</div>
                <div class="text-white/50 text-[11px] mt-0.5">Coordinator // Office: {{ room.head_of_lab?.office }}</div>
                <div class="text-[#06B6D4] font-technical text-[10px] mt-0.5">{{ room.head_of_lab?.email }}</div>
              </div>
            </div>
          </UCard>

          <!-- Narrative Overview -->
          <div class="text-xs text-white/80 leading-relaxed bg-[#0F1E36]/20 p-5 rounded-lg border border-white/5 select-text">
            <h3 class="text-xs font-technical uppercase font-bold text-[#EF5A24] tracking-widest mb-2">Research Spectrum</h3>
            <ContentRenderer :value="room" />
          </div>

          <!-- Safety checklist -->
          <UCard class="bg-[#0F1E36]/20 border border-white/10 text-xs">
            <template #header>
              <div class="text-white/40 font-technical uppercase font-bold text-[9px] tracking-wider">Personal Protective Equipment Rules</div>
            </template>
            <ul class="flex flex-col gap-2.5 list-disc pl-4 text-white/70">
              <li>Safety shields and heat protective mitts mandatory when running high-temperature furnaces.</li>
              <li>Fume suction cabinets must remain fully operational for compound evaporation.</li>
              <li>Keep log ledger populated with correct entry/exit parameters.</li>
            </ul>
          </UCard>

          <!-- Scroll Prompter Button at bottom of intro -->
          <div class="mt-auto pt-6 flex justify-center">
            <UButton 
              v-if="equipment.length"
              @click="scrollToNext(1)"
              icon="i-lucide-arrow-down"
              color="primary"
              variant="outline"
              class="font-technical text-xs uppercase tracking-widest border-[#EF5A24]/40 text-[#EF5A24] hover:bg-[#EF5A24]/10 hover:text-white"
            >
              SCROLL TO INSTRUMENTS ({{ equipment.length }})
            </UButton>
          </div>
        </div>
      </section>

      <!-- Slide 1+: Fullscreen Equipment Tour Sheets -->
      <section 
        v-for="(mach, idx) in equipment" 
        :key="mach.id"
        class="h-screen w-full snap-start shrink-0 relative flex flex-col justify-center items-center lg:items-start p-6 lg:p-16 pt-20 bg-black overflow-hidden"
      >
        <!-- Widescreen Background Equipment Image -->
        <div class="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <NuxtImg 
            v-if="mach.media?.images?.length"
            :src="mach.media.images[0]" 
            format="avif"
            class="w-full h-full object-cover filter brightness-[0.35] contrast-[1.15]" 
            :alt="mach.title"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
          <div class="absolute inset-0 opacity-15 cyber-grid pointer-events-none"></div>
        </div>

        <!-- Float Holographic Detail Card with dynamic tabs -->
        <div class="z-30 max-w-xl w-full lg:w-auto mx-auto lg:mx-0 lg:ml-16 overflow-y-auto max-h-[85vh] shrink-0 my-auto">
          <div class="vgu-panel p-5 border border-[#EF5A24]/30 shadow-2xl rounded-xl bg-[#0F1E36]/90 backdrop-blur-md flex flex-col gap-3.5 w-full">
            <div>
              <div class="text-[#EF5A24] text-[10px] font-technical uppercase font-bold tracking-widest leading-none">
                INSTRUMENT PROFILE // {{ idx + 1 }} OF {{ equipment.length }}
              </div>
              <h3 class="text-xl md:text-2xl font-extrabold text-white mt-2 leading-tight tracking-tight">{{ mach.title }}</h3>
              <div class="text-[10px] font-technical text-[#06B6D4] uppercase font-bold tracking-wider mt-1">
                {{ mach.manufacturer }} // {{ mach.model }}
              </div>
            </div>

            <!-- Custom Cyber Tab Switcher -->
            <div class="flex flex-wrap gap-1.5 border-b border-white/10 pb-2">
              <button
                v-for="tab in getDynamicTabsForMachine(mach)"
                :key="tab.key"
                @click="setActiveTab(mach.id, tab.key)"
                class="px-2.5 py-1 rounded-md text-[9px] font-technical uppercase font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 border cursor-pointer select-none"
                :class="getActiveTab(mach.id) === tab.key 
                  ? 'bg-[#EF5A24]/10 border-[#EF5A24] text-white shadow-[0_0_8px_rgba(239,90,36,0.25)]' 
                  : 'bg-[#0F1E36]/40 border-white/5 text-white/50 hover:text-white hover:bg-[#0F1E36]/70 hover:border-white/10'"
              >
                <span 
                  class="w-1 h-1 rounded-full"
                  :class="getActiveTab(mach.id) === tab.key ? 'bg-[#EF5A24] shadow-[0_0_4px_#EF5A24]' : 'bg-white/20'"
                ></span>
                <UIcon :name="tab.icon" class="w-3 h-3" />
                <span>{{ tab.label }}</span>
              </button>
            </div>

            <!-- Tab Content Area (Scrollable height-constrained) -->
            <div class="flex-grow flex flex-col justify-start min-h-[140px] max-h-[220px] overflow-y-auto pr-1">
              <Transition name="fade" mode="out-in">
                <div :key="getActiveTab(mach.id)">
                  <!-- 1. Overview Tab -->
                  <div v-if="getActiveTab(mach.id) === 'overview'" class="text-xs text-white/80 leading-relaxed prose prose-invert select-text">
                    <ContentRenderer :value="mach" />
                  </div>

                  <!-- 2. Dynamic Frontmatter Tabs -->
                  <div v-else-if="mach[getActiveTab(mach.id)]" class="text-xs text-white/80 select-text">
                    <!-- Case A: Links -->
                    <div v-if="getActiveTab(mach.id) === 'links' || (Array.isArray(mach[getActiveTab(mach.id)]) && mach[getActiveTab(mach.id)].length && typeof mach[getActiveTab(mach.id)][0] === 'object' && mach[getActiveTab(mach.id)][0].url)" class="flex flex-col gap-2">
                      <a 
                        v-for="link in mach[getActiveTab(mach.id)]" 
                        :key="link.url"
                        :href="link.url"
                        target="_blank"
                        rel="noopener"
                        class="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-[#EF5A24]/40 hover:bg-[#EF5A24]/5 text-xs text-white/80 hover:text-white transition-all duration-300 pointer-events-auto"
                      >
                        <span class="truncate font-sans font-medium">{{ link.title }}</span>
                        <span class="text-[#EF5A24] font-technical font-bold text-[9px] shrink-0">LAUNCH →</span>
                      </a>
                    </div>

                    <!-- Case B: Physics -->
                    <div v-else-if="getActiveTab(mach.id) === 'physics'" class="flex flex-col gap-3">
                      <div class="bg-black/50 p-2.5 rounded-lg border border-white/5 flex flex-col gap-1.5">
                        <div class="flex flex-col">
                          <span class="text-white/40 text-[8px] font-technical uppercase leading-none">PRIMARY MECHANISM</span>
                          <span class="text-white font-medium text-xs mt-1">{{ mach.physics?.primary_mechanism }}</span>
                        </div>
                        <span class="text-white/50 text-[9px] mt-0.5">Model: {{ mach.physics?.mathematical_model }}</span>
                        <div v-if="mach.physics?.equation" class="mt-2 text-center p-2.5 bg-black/70 rounded border border-white/5">
                          <code class="text-[#EF5A24] font-technical text-sm font-bold">{{ mach.physics?.equation }}</code>
                        </div>
                      </div>
                    </div>

                    <!-- Case C: Flat Record / Specifications -->
                    <div v-else-if="typeof mach[getActiveTab(mach.id)] === 'object' && !Array.isArray(mach[getActiveTab(mach.id)])" class="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/5 pt-1.5 text-[10px]">
                      <template v-for="(val, key) in Object.entries(mach[getActiveTab(mach.id)])" :key="key">
                        <span class="text-white/40 font-technical uppercase truncate py-0.5 border-b border-white/5">{{ key.replace(/_/g, ' ') }}</span>
                        <span class="text-white font-semibold text-right truncate py-0.5 border-b border-white/5">{{ val }}</span>
                      </template>
                    </div>

                    <!-- Case D: Array of Strings -->
                    <div v-else-if="Array.isArray(mach[getActiveTab(mach.id)]) && typeof mach[getActiveTab(mach.id)][0] === 'string'" class="flex flex-col gap-2">
                      <div 
                        v-for="(step, sIdx) in mach[getActiveTab(mach.id)]" 
                        :key="sIdx"
                        class="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-b-0 text-[11px] leading-relaxed"
                      >
                        <span class="text-[#EF5A24] font-technical font-bold">[{{ sIdx + 1 }}]</span>
                        <span>{{ step }}</span>
                      </div>
                    </div>

                    <!-- Case E: Fallback -->
                    <div v-else class="leading-relaxed bg-black/20 p-3.5 rounded border border-white/5 select-text">
                      {{ mach[getActiveTab(mach.id)] }}
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Bottom controls inside the HUD panel -->
            <div class="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
              <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span class="text-[8px] font-technical text-white/50 uppercase tracking-widest">{{ mach.status }}</span>
              </span>

              <UButton
                @click="emit('select-equipment', mach)"
                color="primary"
                variant="solid"
                size="sm"
                class="font-technical text-[10px] uppercase font-bold tracking-wider px-3.5 bg-[#EF5A24] hover:bg-[#EF5A24]/90 text-white cursor-pointer select-none"
              >
                OPEN PROFILE CODES →
              </UButton>
            </div>
          </div>
        </div>

        <!-- Slide bottom navigation controller links -->
        <div class="absolute bottom-8 right-8 z-30 flex items-center gap-3">
          <UButton 
            v-if="idx < equipment.length - 1"
            @click="scrollToNext(idx + 2)"
            icon="i-lucide-arrow-down"
            color="neutral"
            variant="ghost"
            class="font-technical text-[10px] uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5"
          >
            NEXT MACHINE ↓
          </UButton>
          <UButton 
            v-else
            @click="scrollToTop"
            icon="i-lucide-arrow-up"
            color="neutral"
            variant="ghost"
            class="font-technical text-[10px] uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5"
          >
            BACK TO TOP ↑
          </UButton>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  room: {
    type: Object,
    required: true
  },
  equipment: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select-equipment'])

const scrollContainer = ref(null)
const scrollPercent = ref(0)

const activeImageIndex = ref(0)
const isHovering = ref(false)
const mouseX = ref(50)
const mouseY = ref(50)

// Keep track of active tabs for each equipment machine locally
const activeTabsMap = ref({})

function getActiveTab(machId) {
  if (!activeTabsMap.value[machId]) {
    activeTabsMap.value[machId] = 'overview'
  }
  return activeTabsMap.value[machId]
}

function setActiveTab(machId, tabKey) {
  activeTabsMap.value[machId] = tabKey
}

const systemKeys = [
  'id', 'title', 'model', 'manufacturer', 'departments', 
  'location', 'media', 'status', 'body', 'meta', 'excerpt', 
  'type', 'source', 'stem', 'extension', '_id', '_path', 
  '_dir', '_draft', '_type', '_locale'
]

// Generate dynamic tabs list per machine
function getDynamicTabsForMachine(mach) {
  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'i-lucide-book-open' }
  ]
  if (!mach) return tabs
  
  const itemKeys = Object.keys(mach).filter(key => {
    return !systemKeys.includes(key) && !key.startsWith('_')
  })
  
  const iconMap = {
    physics: 'i-lucide-atom',
    specifications: 'i-lucide-settings',
    links: 'i-lucide-link',
    safety: 'i-lucide-shield-alert',
    procedures: 'i-lucide-list-todo',
    maintenance: 'i-lucide-wrench',
    calibration: 'i-lucide-gauge'
  }
  
  itemKeys.forEach(key => {
    const label = key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      
    tabs.push({
      key,
      label,
      icon: iconMap[key.toLowerCase()] || 'i-lucide-info'
    })
  })
  
  return tabs
}

// Lab Images selection based on room department
const labImages = computed(() => {
  if (!props.room || !props.room.departments) {
    return ['/images/labs/materials_science_lab.png', '/images/labs/electrical_engineering_lab.png']
  }
  const isEE = props.room.departments.some(d => 
    d.toLowerCase().includes('electrical') || 
    d.toLowerCase().includes('computer') || 
    d.toLowerCase().includes('it')
  )
  if (isEE) {
    return [
      '/images/labs/electrical_engineering_lab.png',
      '/images/labs/materials_science_lab.png'
    ]
  } else {
    return [
      '/images/labs/materials_science_lab.png',
      '/images/labs/electrical_engineering_lab.png'
    ]
  }
})

// Scroll position listener
function handleScroll() {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  const maxScroll = el.scrollHeight - el.clientHeight
  if (maxScroll <= 0) {
    scrollPercent.value = 0
    return
  }
  scrollPercent.value = (el.scrollTop / maxScroll) * 100
}

// Next slide scroller
function scrollToNext(idx) {
  if (!scrollContainer.value) return
  const slides = scrollContainer.value.querySelectorAll('section')
  if (slides[idx]) {
    slides[idx].scrollIntoView({ behavior: 'smooth' })
  }
}

function scrollToTop() {
  if (!scrollContainer.value) return
  scrollContainer.value.scrollTo({ top: 0, behavior: 'smooth' })
}

// Targeting crosshair coordinate calculations
function handleMouseMove(e) {
  const container = e.currentTarget
  const rect = container.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100
  mouseY.value = ((e.clientY - rect.top) / rect.height) * 100
  isHovering.value = true
}

function handleMouseLeave() {
  isHovering.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
