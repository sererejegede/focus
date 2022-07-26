import { computed, ref } from 'vue'

export const useTimer = (interval = 1000) => {
  let timer: number
  const startTime = ref(0)
  const stopped = ref(false)
  const newRecord = ref(false)
  const time = ref<{ val: number; pretty: string }>({ val: 0, pretty: '' })
  // Add a leading zero if needed
  const zero = (num: number) => (num < 10 ? `0${num}` : num + '')
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

  const MAX_TIME = 5 * 60 // In seconds
  const startTimer = () => {
    startTime.value = Date.now()
    const startDateTime = new Date(startTime.value)
    const maxDiff =
      startDateTime.setSeconds(startDateTime.getSeconds() + MAX_TIME) -
      startTime.value +
      100
    const startTimerInternal = () => {
      if (stopped.value) return
      const diff = Date.now() - startTime.value
      if (diff > maxDiff) {
        stopped.value = true
        return
      }
      time.value.val = diff
      time.value.pretty = formatTime(diff)
      timer = setTimeout(startTimerInternal, interval)
    }
    startTimerInternal()
  }

  const countdown = (duration: number, callback: () => void) => {
    time.value.pretty = duration.toString()
    timer = setInterval(() => {
      time.value.val = duration--
      time.value.pretty = time.value.val.toString()
      if (time.value.val < 1) {
        clearInterval(timer)
        callback()
        return
      }
    }, 1000)
  }

  const stopTimer = (isCompleted = false) => {
    stopped.value = true
    clearTimeout(timer)
    time.value.pretty = formatTime(time.value.val, true)
    if (isCompleted) addTime()
  }

  const reset = () => {
    stopped.value = false
    newRecord.value = false
    time.value.pretty = ''
    time.value.val = 0
  }

  const previousTimes = ref<Array<number>>([])
  try {
    const data = JSON.parse(
      localStorage.getItem('scores') ?? '[]'
    ) as Array<number>
    if (data?.length) previousTimes.value = data
  } catch (e) {
    console.error(e)
  }
  const addTime = () => {
    if (previousTimes.value[previousTimes.value.length - 1] < time.value.val)
      return
    if (previousTimes.value[0] > time.value.val) {
      newRecord.value = true
    }
    if (previousTimes.value.length === 5) previousTimes.value.pop()
    previousTimes.value.push(time.value.val)
    localStorage.setItem('scores', JSON.stringify(previousTimes.value))
  }
  const bestTime = computed(() => {
    const best = previousTimes.value.sort((a, b) => a - b)[0]
    return {
      pretty: best ? formatTime(best, true) : '',
      val: best,
    }
  })

  return {
    startTimer,
    stopTimer,
    time: computed(() => time.value),
    countdown,
    reset,
    stopped: computed(() => stopped.value),
    bestTime,
    newRecord: computed(() => newRecord.value),
  }
}
