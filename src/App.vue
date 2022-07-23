<template>
  <div class="text-center mt-8">
    <h2 class="text-2xl text-blue-500">Test your focus!</h2>
    <div class="inline-grid grid-cols-5 mt-6">
      <div
        v-for="item in all"
        :key="item.value"
        class="p-2 h-16 w-16 border hover:bg-blue-100"
      >
        <button
          class="rounded-full bg-blue-300 w-full h-full grid place-items-center"
          @click="item.checked = true"
        >
          <svg-icon
            v-if="item.checked || !started"
            :name="item.correct ? 'check' : 'x-icon'"
            :class="item.correct ? 'text-green-600' : 'text-red-600'"
          />
        </button>
      </div>
    </div>
    <div class="mt-6 w-80 mx-auto flex flex-wrap">
      <div
        v-for="i in correctRemaining"
        :key="i"
        class="w-4 h-4 rounded-full bg-green-600"
      ></div>
      <div
        v-for="i in incorrectRemaining"
        :key="i"
        class="w-4 h-4 rounded-full bg-red-600"
      ></div>
      <div
        v-for="i in all.length - incorrectRemaining - correctRemaining"
        :key="i"
        class="w-4 h-4 rounded-full bg-gray-300"
      ></div>
    </div>
    <button @click="startTimer">Start</button>
    <span class="px-4 font-mono">{{ time }}</span>
    <button @click="stopTimer">End</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, watch } from 'vue'
import { useTimer } from '@/useTimer'
import { useRandomNumbers } from '@/useRandomNumbers'

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    const all = ref(
      Array.from({ length: 20 }, (_, i) => i + 1).map((i) => ({
        value: i,
        checked: false,
        correct: useRandomNumbers().includes(i),
      }))
    )
    const correctRemaining = computed(
      () => all.value.filter((val) => !val.checked && val.correct).length
    )
    const incorrectRemaining = computed(
      () => all.value.filter((val) => !val.checked && !val.correct).length
    )

    const { time, startTimer, stopTimer } = useTimer()

    const started = ref(false)
    onMounted(() => {
      setTimeout(() => {
        started.value = true
        startTimer()
      }, 5000)
    })

    watch(correctRemaining, (val) => {
      if (val === 0) stopTimer()
    })

    return {
      correctRemaining,
      incorrectRemaining,
      all,
      time,
      startTimer,
      stopTimer,
      started,
    }
  },
})
</script>
