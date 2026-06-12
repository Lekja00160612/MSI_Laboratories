<template>
  <div v-if="room && equipment" class="w-full h-full bg-[#070A12]">
    <LabRoomTour 
      :room="room" 
      :equipment="equipment" 
      @close="goBack" 
      @select-equipment="viewEquipment"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAsyncData } from '#app'

const route = useRoute()
const router = useRouter()

const { data: room } = await useAsyncData(`room-details-${route.params.id}`, () => {
  return queryCollection('labs').all().then(items => {
    return items.find(item => {
      const baseId = item.room_id || item.id.split('/').pop().replace(/\.md$/, '')
      return baseId === route.params.id
    })
  })
})

const { data: rawEquipment } = await useAsyncData('room-all-equipment', () => {
  return queryCollection('equipment').all()
})

const equipment = computed(() => {
  if (!rawEquipment.value) return []
  return rawEquipment.value.filter(item => {
    if (!item.location || item.location.room_id !== route.params.id) {
      return false
    }
    const id = item.id || item._path || ''
    const baseId = id.split('/').pop().replace(/\.md$/, '')
    return baseId !== 'schema-guide' && !id.includes('schema-guide')
  })
})

useSeoMeta({
  title: () => room.value ? `${room.value.name} | VGU MSI Laboratories` : 'Laboratory Tour',
  description: () => room.value ? room.value.description || `Explore scientific instrumentation in room ${room.value.room_id.toUpperCase()} at VGU MSI.` : 'Explore VGU MSI Laboratories.',
  ogTitle: () => room.value ? `${room.value.name} | VGU MSI Laboratories` : 'Laboratory Tour',
  ogDescription: () => room.value ? room.value.description || `Explore scientific instrumentation in room ${room.value.room_id.toUpperCase()} at VGU MSI.` : 'Explore VGU MSI Laboratories.'
})

function goBack() {
  if (window.history.state && window.history.state.back) {
    router.back()
  } else if (room.value) {
    router.push(`/?building=${room.value.building_id}&floor=${room.value.floor}&room=${room.value.room_id}`)
  } else {
    router.push('/')
  }
}

function getCleanId(mach) {
  if (!mach || !mach.id) return ''
  return mach.id.split('/').pop().replace(/\.md$/, '')
}

function viewEquipment(mach) {
  router.push(`/equipment/${getCleanId(mach)}`)
}
</script>
