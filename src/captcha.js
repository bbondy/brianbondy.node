export function getRandomString (len = 5) {
  return Math.random().toString(36).substring(2, 2 + len)
}

// This is probably enough to protect my simple block from spam.
// If needed I will do 0-100.
// Originally this module uses canvas and generated images but
// it was a big pain to maintain with node updates because of
// the native dependenci on cairo.
const numbers = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fourty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90
}
const numberKeys = Object.keys(numbers)

export function newCaptcha () {
  const index = Math.floor((Math.random() * Object.keys(numbers).length))
  return {
    solution: numbers[numberKeys[index]],
    textToDisplay: numberKeys[index]
  }
}
