import { Subject } from 'rxjs'
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
roomLowLevel.set(1, false)
roomLowLevel.set(2, false)

const roomLevel = co2$.subscribe((obj) => {
  const { deviceId, payload } = obj
  const { value: newCo2Level } = payload
  const isRoomLowLevel = roomLowLevel.get(deviceId)
  if (newCo2Level > 1200 && isRoomLowLevel) {
    roomLowLevel.set(deviceId, false)
    console.log(`Sensor ${deviceId} level: ${newCo2Level}`)
  }
  if (newCo2Level <= 1200 && !isRoomLowLevel) {
    roomLowLevel.set(deviceId, true)
    console.log(`Sensor ${deviceId} level: ${newCo2Level}`)
  }
})
