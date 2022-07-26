export function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export const randomNumbers = (max = 20) => {
  function random() {
    return Math.floor(randomInRange(1, max))
  }
  const numArray: Array<number> = []
  while (numArray.length < 10) {
    const rand = random()
    if (!numArray.includes(rand)) {
      numArray.push(rand)
    }
  }
  return numArray
}

export async function fireworks() {
  const { default: confetti } = await import('canvas-confetti')
  const duration = 5 * 1000
  const end = Date.now() + duration
  const defaults = {
    startVelocity: 30,
    spread: 160,
    zIndex: 0,
    gravity: 1,
    colors: ['#e4ad91', '#c34d10', '#5F6EDD', '#d7dbf6'],
  }

  const interval = setInterval(() => {
    const timeLeft = end - Date.now()
    if (timeLeft <= 0) {
      return clearInterval(interval)
    }
    const particleCount = 50 * (timeLeft / duration)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.1 },
      drift: -0.1,
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.5 },
      drift: 0.1,
    })
  }, 250)
}
