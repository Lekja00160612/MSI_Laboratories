<template>
  <div v-if="item" class="fixed inset-0 z-[60] bg-[#070A12] text-white flex flex-col font-sans scanline laser-scan select-none">
    <!-- Cyber Navbar Header -->
    <header class="h-16 border-b border-[#EF5A24]/20 bg-[#0F1E36]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <!-- Back Button -->
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          @click="emit('close')"
          class="text-white/60 hover:text-white font-technical text-xs font-bold uppercase tracking-wider hover:bg-white/5"
        >
          ← Back to Map
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

    <!-- Main Container split into left and right -->
    <div class="flex-grow overflow-hidden flex flex-col lg:flex-row">
      <!-- Left side: Interactive Mask Schematic & Gallery Carousel -->
      <div class="lg:w-1/2 p-6 md:p-8 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto shrink-0 lg:shrink">
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

        <!-- Interactive Visualizer Screen -->
        <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 group shadow-2xl bg-black">
          <!-- 3D Model View -->
          <div v-if="viewMode === '3d' && item.media?.model_3d" class="absolute inset-0 z-20 bg-[#070A12]">
            <model-viewer
              :src="item.media.model_3d"
              alt="Interactive 3D model of scientific equipment"
              auto-rotate
              camera-controls
              ar
              class="w-full h-full"
              style="width: 100%; height: 100%; border: none;"
            ></model-viewer>
          </div>

          <!-- 2D Scan View -->
          <div v-else class="absolute inset-0">
            <!-- Image A / Video: Exterior -->
            <div class="absolute inset-0 bg-[#070A12] flex items-center justify-center">
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
                alt="Equipment Exterior"
              />
              <div v-else class="text-white/30 text-xs font-technical">PHOTO DATA PENDING</div>
            </div>

            <!-- Image B: Internal Blueprint (Revealed via Clip Path) -->
            <div 
              v-if="item.media?.internal_blueprint"
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

            <!-- Interaction Overlay -->
            <div 
              ref="revealContainer"
              class="absolute inset-0 z-30 cursor-crosshair pointer-events-auto"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
            ></div>
          </div>

          <!-- High-tech 2D/3D Toggle buttons overlay (if 3D model exists) -->
          <div v-if="item.media?.model_3d" class="absolute top-3 left-3 z-40 flex bg-[#0F1E36]/90 border border-white/10 rounded-lg p-0.5 pointer-events-auto">
            <button 
              @click="viewMode = '2d'" 
              class="px-2.5 py-1 text-[9px] font-technical rounded font-bold uppercase transition-all duration-300"
              :class="viewMode === '2d' ? 'bg-[#EF5A24] text-white shadow' : 'text-white/60 hover:text-white'"
            >
              2D SCAN
            </button>
            <button 
              @click="viewMode = '3d'" 
              class="px-2.5 py-1 text-[9px] font-technical rounded font-bold uppercase transition-all duration-300"
              :class="viewMode === '3d' ? 'bg-[#EF5A24] text-white shadow' : 'text-white/60 hover:text-white'"
            >
              3D MODEL
            </button>
          </div>

          <!-- Tooltip Hint -->
          <div class="absolute bottom-3 right-3 z-40 bg-black/85 px-3 py-1 rounded text-[9px] font-technical text-[#06B6D4] border border-[#06B6D4]/30 backdrop-blur-sm pointer-events-none">
            {{ viewMode === '3d' ? 'DRAG TO ROTATE 3D MODEL' : (isMobile ? 'TILT DEVICE TO X-RAY INSIDE' : 'HOVER CURSOR TO SCAN INSIDE') }}
          </div>
        </div>

        <!-- Thumbnail Carousel -->
        <div v-if="item.media?.images?.length > 1" class="flex gap-2 overflow-x-auto pb-2 shrink-0">
          <button 
            v-for="(imgSrc, idx) in item.media.images" 
            :key="imgSrc"
            @click="activeImageIndex = idx"
            :class="[
              'relative w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0',
              activeImageIndex === idx ? 'border-[#EF5A24] shadow-[0_0_8px_#EF5A24]' : 'border-white/10 hover:border-white/30'
            ]"
          >
            <NuxtImg :src="imgSrc" format="avif" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Right side: Content Tabs & Specs (Scrollable) -->
      <div class="lg:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col gap-6 bg-[#0F1E36]/10">
        <UTabs :items="tabItems" class="w-full" color="primary" variant="pill">
          <template #overview>
            <!-- Tab A: Overview -->
            <div class="flex flex-col gap-6 py-4">
              <!-- Physical mechanism panel -->
              <UCard class="bg-[#0F1E36]/40 border border-[#06B6D4]/20">
                <template #header>
                  <div class="text-[#06B6D4] text-xs font-technical uppercase font-extrabold tracking-wider">
                    Physics & Primary Mechanism
                  </div>
                </template>
                <div class="text-sm font-semibold text-white/95">{{ item.physics?.primary_mechanism }}</div>
                <div class="text-xs text-white/60 mt-1">Mathematical Model: {{ item.physics?.mathematical_model }}</div>
                <div class="mt-4 text-center p-4 bg-black/40 rounded-lg border border-white/5">
                  <code class="text-[#EF5A24] font-technical text-lg font-bold">{{ item.physics?.equation }}</code>
                </div>
              </UCard>

              <!-- Markdown Story -->
              <div class="prose prose-invert max-w-none text-xs text-white/80 leading-relaxed bg-[#0F1E36]/20 p-5 rounded-lg border border-white/5">
                <ContentRenderer :value="item" />
              </div>
            </div>
          </template>

          <template #specs>
            <!-- Tab B: Specifications -->
            <div class="py-4 flex flex-col gap-4">
              <UCard class="bg-[#0F1E36]/30 border border-white/10">
                <template #header>
                  <div class="text-white/40 text-xs font-technical uppercase font-bold tracking-wider">
                    Technical Specifications
                  </div>
                </template>
                <div class="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                  <template v-for="(val, key) in item.specifications" :key="key">
                    <div class="text-white/50 font-technical py-1 border-b border-white/5 capitalize">{{ key.replace('_', ' ') }}</div>
                    <div class="text-white font-semibold py-1 border-b border-white/5 text-right">{{ val }}</div>
                  </template>
                </div>
              </UCard>

              <!-- Location Reference Box -->
              <UCard class="bg-[#0F1E36]/20 border border-white/15 text-xs flex flex-col gap-1.5">
                <template #header>
                  <div class="text-[#06B6D4] font-technical uppercase font-bold text-[10px] tracking-wider">
                    Location Reference
                  </div>
                </template>
                <div class="flex justify-between py-1 border-b border-white/5">
                  <span class="text-white/50">Building Location</span>
                  <span class="text-white font-semibold uppercase">{{ item.location.building_id.replace('-', ' ') }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-white/5">
                  <span class="text-white/50">Level / Floor</span>
                  <span class="text-white font-semibold">Floor {{ item.location.floor }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-white/5">
                  <span class="text-white/50">Room Identifier</span>
                  <span class="text-white font-semibold uppercase">{{ item.location.room_id.replace('lab-', '').replace('room-', '') }}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-white/50">Station / Bench ID</span>
                  <span class="text-white font-technical font-semibold">{{ item.location.station_id }}</span>
                </div>
              </UCard>
            </div>
          </template>

          <template #safety>
            <!-- Tab C: Safety & Resources -->
            <div class="flex flex-col gap-6 py-4">
              <!-- Safety Instructions -->
              <UCard class="bg-[#0F1E36]/30 border border-white/10" title="Operational Safety Checklist">
                <div class="flex flex-col gap-3 text-xs text-white/80">
                  <div class="flex items-start gap-2.5 py-1 border-b border-white/5">
                    <span class="text-[#EF5A24] font-extrabold">1.</span>
                    <span>Operators must receive authorization and supervisor guidance before operating.</span>
                  </div>
                  <div class="flex items-start gap-2.5 py-1 border-b border-white/5">
                    <span class="text-[#EF5A24] font-extrabold">2.</span>
                    <span>Verify coolant, gas supply, and electrical connections before firing runs.</span>
                  </div>
                  <div class="flex items-start gap-2.5 py-1">
                    <span class="text-[#EF5A24] font-extrabold">3.</span>
                    <span>Clean samples, verify vacuum seals, and enter run hours in logging ledger.</span>
                  </div>
                </div>
              </UCard>

              <!-- External Links -->
              <div v-if="item.links?.length" class="flex flex-col gap-2">
                <div class="text-white/40 text-xs font-technical uppercase font-bold tracking-wider">Related Resources</div>
                <a 
                  v-for="link in item.links" 
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center justify-between p-3 rounded-lg bg-[#0F1E36]/50 border border-white/10 hover:border-[#EF5A24]/40 hover:bg-[#EF5A24]/5 text-xs text-white/80 hover:text-white transition-all duration-300 pointer-events-auto"
                >
                  <span>{{ link.title }}</span>
                  <span class="text-[#EF5A24]">→</span>
                </a>
              </div>
            </div>
          </template>
        </UTabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
const viewMode = ref('2d')

function isVideo(path) {
  if (!path) return false
  return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.ogg')
}

const tabItems = [
  { label: 'Overview', icon: 'i-lucide-book-open', slot: 'overview' },
  { label: 'Specifications', icon: 'i-lucide-settings', slot: 'specs' },
  { label: 'Safety & Procedures', icon: 'i-lucide-shield-alert', slot: 'safety' }
]

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

// Compute dynamic CSS clip-path mask
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
