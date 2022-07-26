<template>
  <div
    class="h-screen grid place-items-center dark:bg-slate-800 text-2xl px-4 overflow-hidden"
  >
    <div class="text-center mt-8 font-inter">
      <h2 class="text-4xl text-secondary-500">Test your focus!</h2>
      <p class="mt-4 dark:text-white text-lg">
        How fast can you spot the the
        <svg-icon name="check" class="inline" />
        s?
      </p>
      <div class="h-[448px] relative">
        <custom-transition mode="scale" speed="fast">
          <div
            v-if="['initialized', 'completed', 'abandoned'].includes(state)"
            class="w-80 pt-64 grid place-items-center mx-auto"
          >
            <button
              v-if="state === 'initialized'"
              class="w-full h-16 rounded-full bg-secondary-500 text-white flex items-center justify-around"
              @click="startCountdown"
            >
              Start
              <svg-icon name="play" />
            </button>
            <div v-else class="w-full">
              <div v-show="state === 'completed'" class="mb-6 dark:text-white">
                <p class="mb-4">
                  You finished in
                  <span class="text-secondary-500 font-bold">{{
                    time.pretty
                  }}</span>
                </p>
                <p>
                  Your best time is
                  <span class="text-primary-500 font-bold">{{
                    bestTime.pretty
                  }}</span>
                </p>
                <p class="font-light text-base block">
                  Care to beat this time?
                </p>
              </div>
              <p v-show="state === 'abandoned'" class="dark:text-white mb-2">
                Try again?
              </p>
              <button
                class="w-full h-16 rounded-full bg-secondary-500 text-white flex items-center justify-around"
                @click="restart"
              >
                Restart
                <svg-icon name="refresh" />
              </button>
            </div>
          </div>
        </custom-transition>
        <custom-transition>
          <div
            v-show="['started', 'countdown'].includes(state)"
            class="flex justify-between items-center pt-8 mb-8"
          >
            <p class="font-mono text-6xl dark:text-white h-16">
              {{ time.pretty }}
            </p>
            <custom-transition horizontal>
              <button
                v-show="state === 'started'"
                class="dark:text-secondary-500"
                @click="stopTimer"
              >
                Give up
              </button>
            </custom-transition>
          </div>
        </custom-transition>
        <custom-transition multiple>
          <template v-if="['countdown', 'started'].includes(state)">
            <div
              v-if="state === 'started' && stopped"
              class="grid place-items-center h-80 dark:text-white"
            >
              <p>You took too long.</p>
              <button
                class="w-full h-16 rounded-full bg-secondary-500 text-white flex items-center justify-around"
                @click="restart"
              >
                Try again
                <svg-icon name="refresh" />
              </button>
            </div>
            <div v-show="!stopped" class="grid grid-cols-5 mt-6">
              <div
                v-for="item in all"
                :key="item.value"
                class="p-2 h-16 w-16 border hover:bg-primary-light"
              >
                <button
                  class="rounded-full bg-primary w-full h-full grid place-items-center"
                  @click="
                    state === 'started' && !stopped
                      ? (item.checked = true)
                      : null
                  "
                >
                  <svg-icon
                    v-if="item.checked || state === 'countdown'"
                    :name="item.correct ? 'check' : 'x-icon'"
                    class="transition-opacity opacity-100"
                    :class="item.correct ? 'text-green-600' : 'text-red-600'"
                  />
                </button>
              </div>
            </div>
          </template>
        </custom-transition>
        <custom-transition>
          <progress
            v-if="state === 'started' && !stopped"
            :max="totalCorrect"
            :value="totalCorrect - correctRemaining"
            class="w-full mt-6"
          />
        </custom-transition>
      </div>
    </div>
    <button @click="fireworks()">Confetti</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useTimer } from '@/useTimer'
import CustomTransition from '@/components/CustomTransition.vue'
import { fireworks, randomNumbers } from '@/helpers'

const values = ref(randomNumbers())
const all = ref(
  Array.from({ length: 20 }, (_, i) => i + 1).map((i) => ({
    value: i,
    checked: false,
    correct: values.value.includes(i),
  }))
)
const correctRemaining = computed(
  () => all.value.filter((val) => !val.checked && val.correct).length
)
const totalCorrect = computed(() => values.value.length)

const {
  time,
  startTimer,
  stopTimer: stopTimer_,
  countdown,
  reset,
  stopped,
  bestTime,
  newRecord,
} = useTimer()

const restart = () => {
  reset()
  values.value = randomNumbers()
  all.value = Array.from({ length: 20 }, (_, i) => i + 1).map((i) => ({
    value: i,
    checked: false,
    correct: values.value.includes(i),
  }))

  startCountdown()
}

const stopTimer = (isAbandoned = false) => {
  stopTimer_(correctRemaining.value === 0)
  state.value = isAbandoned ? 'abandoned' : 'completed'
}

watch(correctRemaining, (val) => {
  if (val === 0) {
    stopTimer()
    if (newRecord.value) {
      fireworks()
    }
  }
})

const startCountdown = () => {
  state.value = 'countdown'
  countdown(5, () => {
    showCountdown.value = false
    state.value = 'started'
    startTimer()
  })
}

const showCountdown = ref<boolean | null>(null)
type AppState =
  | 'initialized'
  | 'countdown'
  | 'started'
  | 'completed'
  | 'abandoned'
const state = ref<AppState>('initialized')
</script>

<style scoped>
progress::-webkit-progress-bar {
  @apply bg-secondary-300 rounded-full;
}
progress::-webkit-progress-value {
  transition: width ease 150ms;
  @apply bg-secondary-500 rounded-full;
}
</style>
