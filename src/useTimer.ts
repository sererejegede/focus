import { computed, ref } from 'vue'

export const useTimer = (interval = 1000) => {
  let timer: number
  let startTime: number
  const stopped = ref(false)
  const time = ref('')
  // Add a leading zero if needed
  const zero = (num: number) => (num < 10 ? `0${num}` : num)
  const formatTime = (dateTime: number, addMilliseconds = false): string => {
    const h = dateTime / 1000
    const m = Math.floor(h / 60)
    const s = Math.floor(h % 60)
    if (addMilliseconds) {
      const ms = h.toString().split('.')[1]
      return `${zero(m)}:${zero(s)}:${ms}`
    }
    return `${zero(m)}:${zero(s)}`
  }
  const startTimer = () => {
    startTime = Date.now()
    const startTimerInternal = () => {
      if (stopped.value) return
      const diff = Date.now() - startTime
      time.value = formatTime(diff)
      timer = setTimeout(startTimerInternal, interval)
    }
    startTimerInternal()
  }

  const stopTimer = () => {
    stopped.value = true
    clearTimeout(timer)
    time.value = formatTime(Date.now() - startTime, true)
  }

  return {
    startTimer,
    stopTimer,
    time: computed(() => time.value),
  }
}