<template>
  <div v-if="item" class="fixed inset-0 z-[60] bg-[#070A12] text-white flex flex-col font-sans select-none">
    <!-- Visual Cyber Scan Overlays -->
    <div class="absolute inset-0 pointer-events-none z-45 scanline laser-scan"></div>

    <!-- Cyber Navbar Header -->
    <header class="h-16 border-b border-[#EF5A24]/20 bg-[#0F1E36]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-50">
      <div class="flex items-center gap-3">
        <!-- Back Button -->
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
          {{ item.manufacturer }} // {{ item.model }}
        </span>
        <UBadge color="warning" variant="subtle" class="font-technical uppercase text-[9px] tracking-widest px-2.5 py-1">
          {{ item.status }}
        </UBadge>
      </div>
    </header>

    <!-- Main Container split into left (media 2/5) and right (content 3/5) -->
    <div class="flex-grow overflow-hidden flex flex-col lg:flex-row">
      <!-- Left side: Stacked Media Panels (3D Model, 2D X-Ray Scanner, Photo Gallery) -->
      <div class="lg:w-2/5 p-6 md:p-8 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto shrink-0 lg:shrink">
        <div class="flex flex-col gap-1">
          <div class="text-[#EF5A24] text-xs font-technical uppercase font-extrabold tracking-widest">
            {{ item.manufacturer }}
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {{ item.title }}
          </h2>
          <div class="flex gap-2 flex-wrap mt-2">
            <UBadge 
              v-for="dept in item.departments" 
              :key="dept" 
              variant="outline"
              color="info"
              class="font-technical text-[9px] uppercase tracking-wider"
            >
              {{ dept }}
            </UBadge>
          </div>
        </div>

        <!-- Stacked Diagnostics media items -->
        <div class="flex flex-col gap-6 flex-grow">
          <!-- A. 3D Model Viewer Card -->
          <div v-if="item.media?.model_3d" class="flex flex-col gap-2">
            <span class="text-[9px] font-technical text-[#06B6D4] uppercase font-bold tracking-widest leading-none">Diagnostic: 3D Hull Projection</span>
            <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-[#06B6D4]/30 shadow-2xl bg-black flex items-center justify-center">
              <model-viewer
                :src="item.media.model_3d"
                alt="Interactive 3D model of scientific equipment"
                auto-rotate
                camera-controls
                ar
                class="w-full h-full"
                style="width: 100%; height: 100%; border: none;"
              ></model-viewer>
              <div class="absolute bottom-3 right-3 z-40 bg-black/85 px-3 py-1 rounded text-[9px] font-technical text-[#06B6D4] border border-[#06B6D4]/30 backdrop-blur-sm pointer-events-none">
                DRAG TO ROTATE 3D MODEL
              </div>
            </div>
          </div>

          <!-- B. 2D X-Ray Flashlight Scanner Card -->
          <div v-if="item.media?.internal_blueprint" class="flex flex-col gap-2">
            <span class="text-[9px] font-technical text-[#EF5A24] uppercase font-bold tracking-widest leading-none">Diagnostic: Depth Scan & Blueprint</span>
            <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-[#EF5A24]/30 shadow-2xl bg-black group">
              <!-- Image A: Exterior -->
              <div class="absolute inset-0 bg-[#070A12] flex items-center justify-center">
                <NuxtImg 
                  v-if="item.media?.images?.length"
                  :src="item.media.images[0]" 
                  format="avif"
                  class="w-full h-full object-cover" 
                  alt="Equipment Exterior"
                />
                <div v-else class="text-white/30 text-xs font-technical">PHOTO DATA PENDING</div>
              </div>

              <!-- Image B: Internal Blueprint (Revealed via Clip Path) -->
              <div 
                class="absolute inset-0 bg-gradient-to-br from-[#0F1E36] to-[#070A12] pointer-events-none transition-all duration-75 z-20"
                :style="maskStyle"
              >
                <!-- Blueprint Content -->
                <div class="w-full h-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#06B6D4]/30 bg-[#070A12]/92">
                  <div class="absolute inset-0 opacity-10 cyber-grid"></div>
                  <!-- Hologram graphics -->
                  <svg class="w-4/5 h-4/5 text-[#06B6D4]/60 drop-shadow-[0_0_10px_#06B6D4]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2,2" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="0.75" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" stroke-width="0.5" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="0.5" />
                    <path d="M 30,50 L 50,30 L 70,50 L 50,70 Z" fill="none" stroke="#EF5A24" stroke-width="1" />
                    <text x="52" y="24" class="text-[4px] font-technical font-bold fill-[#06B6D4]">VACUUM CHAMBER</text>
                    <text x="52" y="78" class="text-[4px] font-technical font-bold fill-[#EF5A24]">LASER BEAM PATH</text>
                  </svg>
                </div>
              </div>

              <!-- Interactive Visualizer HUD Frame Overlay -->
              <div class="absolute inset-0 pointer-events-none z-25 border border-[#06B6D4]/20">
                <span class="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#06B6D4]/40"></span>
                <span class="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#06B6D4]/40"></span>
                <span class="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#06B6D4]/40"></span>
                <span class="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#06B6D4]/40"></span>
                
                <div class="absolute top-3 right-3 flex flex-col items-end gap-0.5 text-[8px] font-technical text-[#06B6D4]/70 bg-black/45 px-1.5 py-1 rounded border border-white/5 backdrop-blur-xs">
                  <div>SYS_LINK: ONLINE</div>
                  <div>X-RAY SCAN: ACTIVE</div>
                  <div>RESOL: 0.12 NM</div>
                  <div>WAVELENGTH: 532 NM</div>
                </div>
              </div>

              <!-- Interaction Overlay -->
              <div 
                ref="revealContainer"
                class="absolute inset-0 z-30 cursor-crosshair pointer-events-auto"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"
              ></div>

              <!-- Hint -->
              <div class="absolute bottom-3 right-3 z-40 bg-black/85 px-3 py-1 rounded text-[9px] font-technical text-[#06B6D4] border border-[#06B6D4]/30 backdrop-blur-sm pointer-events-none">
                {{ isMobile ? 'TILT DEVICE TO X-RAY' : 'HOVER CURSOR TO X-RAY' }}
              </div>
            </div>
          </div>

          <!-- C. Image & Video Gallery -->
          <div class="flex flex-col gap-2">
            <span class="text-[9px] font-technical text-white/40 uppercase font-bold tracking-widest leading-none">Diagnostic: Photographic Data</span>
            <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#070A12] flex items-center justify-center">
              <video 
                v-if="item.media?.video || isVideo(item.media?.images?.[activeImageIndex])"
                :src="item.media.video || item.media.images[activeImageIndex]" 
                class="w-full h-full object-cover" 
                autoplay
                loop
                muted
                playsinline
                controls
              ></video>
              <NuxtImg 
                v-else-if="item.media?.images?.length"
                :src="item.media.images[activeImageIndex]" 
                format="avif"
                class="w-full h-full object-cover" 
                alt="Equipment Gallery Photo"
              />
              <div v-else class="text-white/30 text-xs font-technical">PHOTO DATA PENDING</div>
            </div>
            
            <!-- Gallery Thumbnails -->
            <div v-if="item.media?.images?.length > 1" class="flex gap-2 overflow-x-auto pb-1 mt-1">
              <button 
                v-for="(imgSrc, idx) in item.media.images" 
                :key="imgSrc"
                @click="activeImageIndex = idx"
                :class="[
                  'relative w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0',
                  activeImageIndex === idx ? 'border-[#EF5A24] shadow-[0_0_8px_#EF5A24]' : 'border-white/10 hover:border-white/30'
                ]"
              >
                <NuxtImg :src="imgSrc" format="avif" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Dynamic Content Tabs (Scrollable, Wider lg:w-3/5 layout) -->
      <div class="lg:w-3/5 p-6 md:p-8 overflow-y-auto flex flex-col gap-6 bg-[#0F1E36]/10 select-text">
        <!-- Interactive Cyber Switcher tabs -->
        <div class="flex flex-wrap gap-2.5 border-b border-white/10 pb-4">
          <button
            v-for="tab in dynamicTabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="relative px-4 py-2 rounded-lg text-[10px] font-technical uppercase font-bold tracking-widest transition-all duration-300 flex items-center gap-2 border cursor-pointer select-none"
            :class="activeTab === tab.key 
              ? 'bg-[#EF5A24]/10 border-[#EF5A24] text-white shadow-[0_0_15px_rgba(239,90,36,0.3)]' 
              : 'bg-[#0F1E36]/40 border-white/5 text-white/50 hover:text-white hover:bg-[#0F1E36]/70 hover:border-white/15'"
          >
            <!-- Glowing LED indicator dot -->
            <span 
              class="w-1.5 h-1.5 rounded-full transition-all duration-300"
              :class="activeTab === tab.key 
                ? 'bg-[#EF5A24] shadow-[0_0_8px_#EF5A24] animate-pulse' 
                : 'bg-white/20'"
            ></span>
            <UIcon :name="tab.icon" class="w-4 h-4" />
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Dynamic Tab Panel Render Area -->
        <div class="flex-grow flex flex-col justify-start">
          <Transition name="fade" mode="out-in">
            <div :key="activeTab" class="w-full">
              <!-- A. Overview / Markdown Body Tab -->
              <div v-if="activeTab === 'overview'" class="prose prose-invert max-w-none text-xs text-white/80 leading-relaxed bg-[#0F1E36]/20 p-6 rounded-xl border border-white/5">
                <ContentRenderer :value="item" />
              </div>

              <!-- B. Dynamic Frontmatter Field Tabs -->
              <div v-else-if="item[activeTab]" class="flex flex-col gap-6">
                <!-- Case 1: Physics Tab -->
                <div v-if="activeTab === 'physics'" class="flex flex-col gap-5">
                  <UCard class="bg-[#0F1E36]/40 border border-[#06B6D4]/30 shadow-lg">
                    <template #header>
                      <div class="text-[#06B6D4] text-xs font-technical uppercase font-extrabold tracking-wider">
                        Physics & Primary Mechanism
                      </div>
                    </template>
                    <div class="text-sm font-semibold text-white/95">{{ item.physics?.primary_mechanism }}</div>
                    <div class="text-xs text-white/60 mt-1">Mathematical Model: {{ item.physics?.mathematical_model }}</div>
                    <div v-if="item.physics?.equation" class="mt-4 text-center p-4 bg-black/50 rounded-lg border border-white/10">
                      <code class="text-[#EF5A24] font-technical text-lg font-bold">{{ item.physics?.equation }}</code>
                    </div>
                  </UCard>
                  
                  <UCard v-if="item.physics?.target_materials?.length" class="bg-[#0F1E36]/20 border border-white/10 shadow-sm">
                    <template #header>
                      <div class="text-white/40 text-xs font-technical uppercase font-bold tracking-wider">Target Materials & Systems</div>
                    </template>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="mat in item.physics.target_materials" 
                        :key="mat" 
                        class="text-[10px] bg-[#EF5A24]/10 text-[#EF5A24] px-2.5 py-1 rounded font-technical font-bold border border-[#EF5A24]/20 shadow-xs"
                      >
                        {{ mat }}
                      </span>
                    </div>
                  </UCard>
                </div>

                <!-- Case 2: Link Resources Tab -->
                <div v-else-if="activeTab === 'links' || (Array.isArray(item[activeTab]) && item[activeTab].length && typeof item[activeTab][0] === 'object' && item[activeTab][0].url)" class="flex flex-col gap-3">
                  <span class="text-white/40 text-[10px] font-technical uppercase font-bold tracking-wider mb-1">Interactive Diagnostic Portals</span>
                  <a 
                    v-for="link in item[activeTab]" 
                    :key="link.url"
                    :href="link.url"
                    target="_blank"
                    rel="noopener"
                    class="flex items-center justify-between p-4 rounded-xl bg-[#0F1E36]/50 border border-white/5 hover:border-[#EF5A24]/40 hover:bg-[#EF5A24]/5 text-xs text-white/80 hover:text-white transition-all duration-300 pointer-events-auto shadow-sm group"
                  >
                    <span class="font-sans font-medium">{{ link.title }}</span>
                    <span class="text-[#EF5A24] font-technical font-bold text-[10px] flex items-center gap-1 group-hover:underline">
                      LAUNCH_URI <UIcon name="i-lucide-external-link" class="w-3.5 h-3.5" />
                    </span>
                  </a>
                </div>

                <!-- Case 3: Flat Record / Specifications Tab -->
                <div v-else-if="typeof item[activeTab] === 'object' && !Array.isArray(item[activeTab])" class="flex flex-col gap-4">
                  <UCard class="bg-[#0F1E36]/30 border border-white/10 shadow-md">
                    <template #header>
                      <div class="text-white/40 text-xs font-technical uppercase font-bold tracking-wider">
                        Technical specifications
                      </div>
                    </template>
                    <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-xs">
                      <template v-for="(val, key) in item[activeTab]" :key="key">
                        <div class="text-white/50 font-technical py-1.5 border-b border-white/5 capitalize">{{ key.replace(/_/g, ' ') }}</div>
                        <div class="text-white font-semibold py-1.5 border-b border-white/5 text-right">{{ val }}</div>
                      </template>
                    </div>
                  </UCard>
                </div>

                <!-- Case 4: Array of Strings / Checklist Tab -->
                <div v-else-if="Array.isArray(item[activeTab]) && typeof item[activeTab][0] === 'string'" class="flex flex-col gap-4">
                  <UCard class="bg-[#0F1E36]/30 border border-white/10 shadow-md">
                    <template #header>
                      <div class="text-white/40 text-xs font-technical uppercase font-bold tracking-wider">
                        Operational Checklist / Instructions
                      </div>
                    </template>
                    <div class="flex flex-col gap-3.5 text-xs text-white/80">
                      <div 
                        v-for="(step, sIdx) in item[activeTab]" 
                        :key="sIdx" 
                        class="flex items-start gap-3.5 py-2.5 border-b border-white/5 last:border-b-0"
                      >
                        <span class="text-[#EF5A24] font-technical font-bold text-[11px] bg-[#EF5A24]/10 px-2 py-0.5 rounded border border-[#EF5A24]/20 shadow-xs">
                          {{ String(sIdx + 1).padStart(2, '0') }}
                        </span>
                        <span class="mt-0.5">{{ step }}</span>
                      </div>
                    </div>
                  </UCard>
                </div>

                <!-- Case 5: Fallback Single String/Text Tab -->
                <div v-else class="text-xs text-white/80 leading-relaxed bg-[#0F1E36]/20 p-6 rounded-xl border border-white/5 select-text shadow-sm">
                  {{ item[activeTab] }}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDeviceOrientation } from '@vueuse/core'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const activeImageIndex = ref(0)
const revealContainer = ref(null)
const activeTab = ref('overview')

// System properties that do not map to dynamic tabs
const systemKeys = [
  'id', 'title', 'model', 'manufacturer', 'departments', 
  'location', 'media', 'status', 'body', 'meta', 'excerpt', 
  'type', 'source', 'stem', 'extension', '_id', '_path', 
  '_dir', '_draft', '_type', '_locale'
]

// Dynamic computed tabs generator
const dynamicTabs = computed(() => {
  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'i-lucide-book-open' }
  ]
  
  if (!props.item) return tabs
  
  // Extract custom or optional keys
  const itemKeys = Object.keys(props.item).filter(key => {
    return !systemKeys.includes(key) && !key.startsWith('_')
  })
  
  // Specialized icon mappings
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
})

// Reset tab selection to 'overview' on equipment change
watch(() => props.item?.id, () => {
  activeTab.value = 'overview'
  activeImageIndex.value = 0
})

function isVideo(path) {
  if (!path) return false
  return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.ogg')
}

// Mouse coordinates relative to the container
const mouseX = ref(50)
const mouseY = ref(50)
const isHovering = ref(false)

// Use VueUse for device gyroscopic orientation (Mobile Tilt Reveal)
const { gamma, isSupported: isOrientationSupported } = useDeviceOrientation()
const isMobile = ref(false)

if (import.meta.client) {
  isMobile.value = ('ontouchstart' in window) || navigator.maxTouchPoints > 0
}

function handleMouseMove(e) {
  if (!revealContainer.value) return
  const rect = revealContainer.value.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100
  mouseY.value = ((e.clientY - rect.top) / rect.height) * 100
  isHovering.value = true
}

function handleMouseLeave() {
  isHovering.value = false
}

// Compute dynamic CSS clip-path mask for X-Ray
const maskStyle = computed(() => {
  if (isMobile.value && isOrientationSupported.value && gamma.value !== null) {
    const tiltOffset = Math.max(10, Math.min(90, 50 + (gamma.value * 1.5)))
    return {
      clipPath: `polygon(0 0, ${tiltOffset}% 0, ${tiltOffset - 10}% 100%, 0 100%)`
    }
  } else {
    const radius = isHovering.value ? 100 : 0
    return {
      clipPath: `circle(${radius}px at ${mouseX.value}% ${mouseY.value}%)`,
      webkitClipPath: `circle(${radius}px at ${mouseX.value}% ${mouseY.value}%)`
    }
  }
})
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
