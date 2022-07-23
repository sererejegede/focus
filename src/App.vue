<template>
  <div class="text-center mt-8">
    <h2 class="text-2xl text-blue-500">Welcome {{ some }}</h2>
    <div class="inline-grid grid-cols-5 mt-6">
      <div v-for="i in 20" :key="i" class="p-2 h-16 w-16 border">
        <button
          class="hover:bg-blue-100 rounded-full bg-blue-300 w-full h-full"
        >
          {{ i }}
        </button>
      </div>
      <svg-icon name="check" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    let some = 'home!'
    return {
      some,
    }
  },
})
</script>
