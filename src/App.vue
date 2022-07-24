<template>
  <div class="h-screen grid place-items-center dark:bg-slate-800 text-2xl px-4">
    <div class="text-center mt-8 font-inter">
      <h2 class="text-4xl text-primary-500">Test your focus!</h2>
      <p class="mt-4 dark:text-white text-lg">
        How fast can you spot the the
        <svg-icon name="check" class="inline" />
        s?
      </p>
      <div class="h-[448px] relative">
        <transition
          enter-active-class="duration-150 ease-in"
          enter-from-class="scale-75 opacity-0"
          leave-active-class="duration-150 ease-in"
          enter-to-class="scale-100 opacity-100"
          leave-from-class="scale-100"
          leave-to-class="scale-75 opacity-0"
        >
          <div
            v-if="['initialized', 'completed'].includes(state)"
            class="w-80 pt-64 grid place-items-center mx-auto"
          >
            <button
              v-if="state === 'initialized'"
              class="w-full h-16 rounded-full bg-secondary text-white flex items-center justify-around"
              @click="startCountdown"
            >
              Start
              <svg-icon name="play" />
            </button>
            <div v-else>
              <p class="mb-6 dark:text-white">
                You finished in
                <span class="text-secondary font-bold">{{ time }}</span> !
              </p>
              <button
                class="w-full h-16 rounded-full bg-secondary text-white flex items-center justify-around"
                @click="restart"
              >
                Restart
                <svg-icon name="refresh" />
              </button>
            </div>
          </div>
        </transition>
        <transition
          enter-active-class="duration-300 delay-150 translate-y-full ease-in"
          enter-from-class="translate-y-full opacity-0"
          leave-active-class="duration-300 translate-y-0 ease-in"
          enter-to-class="translate-y-0"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full opacity-0"
        >
          <p
            v-show="['started', 'countdown'].includes(state)"
            class="px-4 pt-8 mb-8 font-mono text-6xl dark:text-white h-16"
          >
            {{ time }}
          </p>
        </transition>
        <transition
          enter-active-class="duration-300 delay-300 ease-in"
          enter-from-class="translate-y-full opacity-0"
          enter-to-class="translate-y-0"
          leave-to-class="duration-300 ease-in translate-y-full opacity-0"
        >
          <div
            v-if="['countdown', 'started'].includes(state)"
            class="inline-grid grid-cols-5 mt-6"
          >
            <div
              v-for="item in all"
              :key="item.value"
              class="p-2 h-16 w-16 border hover:bg-primary-light"
            >
              <button
                class="rounded-full bg-primary w-full h-full grid place-items-center"
                @click="state === 'started' ? (item.checked = true) : null"
              >
                <svg-icon
                  v-if="item.checked || state === 'countdown'"
                  :name="item.correct ? 'check' : 'x-icon'"
                  class="transition-opacity opacity-100"
                  :class="item.correct ? 'text-green-600' : 'text-red-600'"
                />
              </button>
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
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useTimer } from '@/useTimer'
import { randomNumbers } from '@/useRandomNumbers'

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
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
    const incorrectRemaining = computed(
      () => all.value.filter((val) => !val.checked && !val.correct).length
    )

    const { time, startTimer, stopTimer, countdown, reset } = useTimer()

    const started = ref(false)

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

    watch(correctRemaining, (val) => {
      if (val === 0) {
        stopTimer()
        state.value = 'completed'
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
    type AppState = 'initialized' | 'countdown' | 'started' | 'completed'
    const state = ref<AppState>('initialized')

    return {
      correctRemaining,
      incorrectRemaining,
      all,
      time,
      startTimer,
      stopTimer,
      started,
      showCountdown,
      startCountdown,
      state,
      restart,
      values,
    }
  },
})
</script>
