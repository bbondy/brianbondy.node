var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function padNum (num) {
  return num < 10 ? '0' + num : String(num)
}

export function formatDate (dt) {
  return `${monthNames[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`
}

export function formatTime (dt) {
  return `${dt.getHours()}:${padNum(dt.getMinutes())}:${padNum(dt.getSeconds())}`
}
