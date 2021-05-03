import { webSocket } from 'rxjs/webSocket'
import { map, filter } from 'rxjs/operators'

global.WebSocket = require('ws') // <-- FIX ALL ERRORS
const source = webSocket('wss://totally-fake-sensor-data.herokuapp.com')

const sensorData$ = source.pipe(
  map((msg) => {
    const { deviceId, payload: rawPayload } = msg
    const type = parseInt(rawPayload.slice(0, 2), 10)
    const value = parseInt(rawPayload.slice(2), 16)
    return { deviceId, payload: { type, value } }
  })
)

const battery$ = sensorData$.pipe(filter((msg) => msg.payload.type === 2))

battery$.subscribe((obj) => {
  const { deviceId, payload } = obj
  const { value } = payload
  const batteryStatus = value / 1000
  console.log(`Sensor ${deviceId} battery status: ${batteryStatus}V`)
})

const co2$ = sensorData$.pipe(filter((msg) => msg.payload.type === 1))

let roomLowLevel = new Map()

const roomLevel = co2$.subscribe((obj) => {
  const { deviceId, payload } = obj
  const { value: co2 } = payload
  let newCo2Level = co2 > 1200 ? 'high' : 'low'
  if (roomLowLevel.get(deviceId) === undefined) {
    roomLowLevel.set(deviceId, newCo2Level)
    console.log(`Sensor ${deviceId} level: ${newCo2Level}`)
  }
  const roomLevel = roomLowLevel.get(deviceId)

  if (co2 > 1200 && roomLevel === 'low') {
    newCo2Level = 'high'
  }
  if (co2 <= 1200 && roomLevel === 'high') {
    newCo2Level = 'low'
  }
  if (roomLevel != newCo2Level) {
    roomLowLevel.set(deviceId, newCo2Level)
    console.log(`Sensor ${deviceId} level: ${newCo2Level}`)
  }
})
