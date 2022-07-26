<template>
  <transition-group
    :enter-active-class="enterActive"
    :enter-from-class="hiding"
    :enter-to-class="showing"
    :leave-to-class="hiding"
  >
    <slot />
  </transition-group>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue'
const props = withDefaults(
  defineProps<{
    delay?: boolean
    horizontal?: boolean
    mode?: 'scale' | 'translate'
    speed?: 'fast' | 'normal' | 'slow'
    multiple?: boolean
  }>(),
  { mode: 'translate', speed: 'normal', multiple: false }
)

const translationHiding = computed(() =>
  props.horizontal ? 'translate-x-full' : 'translate-y-full'
)
const showing = computed(() => {
  if (props.mode === 'scale') return 'scale-100'
  return props.horizontal ? 'translate-x-0' : 'translate-y-0'
})
const speed = computed(() => {
  switch (props.speed) {
    case 'fast':
      return 'duration-150'
    default:
    case 'normal':
      return 'duration-300'
    case 'slow':
      return 'duration-450'
  }
})
const enterActive = computed(() => {
  let mode = ''
  if (props.mode === 'translate') mode = translationHiding.value
  const res = [speed.value, 'ease-in', mode]
  if (props.delay) res.push('delay-150')
  return res.filter(Boolean).join(' ')
})
const hiding = computed(() => {
  const res = ['opacity-0']
  switch (props.mode) {
    case 'translate':
      res.push(translationHiding.value)
      break
    case 'scale':
      res.push('scale-75')
  }
  return res.join(' ')
})
</script>
