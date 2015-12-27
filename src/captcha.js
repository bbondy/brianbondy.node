var Canvas = require('canvas')

export function getRandomString (len = 5) {
  return Math.random().toString(36).substring(2, 2 + len)
}

export function newCaptcha () {
  let margin = 0
  let height = 60
  let canvas = new Canvas(120, height)
  let ctx = canvas.getContext('2d')
  let text = getRandomString()
  ctx.font = '30px Impact'
  ctx.rotate(0.2)
  ctx.fillText(text, 10, 30)
  var te = ctx.measureText(text)
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  ctx.beginPath()
  ctx.moveTo(margin, 0)
  ctx.lineTo(te.width, Math.random() * height)
  ctx.lineTo(margin, Math.random() * height)
  ctx.lineTo(te.width, Math.random() * height)
  ctx.lineTo(margin, Math.random() * height)
  ctx.stroke()

  let dataUrl = canvas.toDataURL()
  return {
    text,
    dataUrl
  }
}
