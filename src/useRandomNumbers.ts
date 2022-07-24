export const randomNumbers = (max = 20) => {
  function random() {
    return Math.floor(Math.random() * (max - 1) + 1)
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
