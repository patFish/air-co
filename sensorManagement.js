import { webSocket } from 'rxjs/webSocket'
import { map } from 'rxjs/operators'

global.WebSocket = require('ws') // <-- FIX ALL ERRORS
const source = webSocket('wss://totally-fake-sensor-data.herokuapp.com')

export const sensorData$ = source.pipe(
  map((msg) => {
    const { deviceId, payload: rawPayload } = msg
    const type = parseInt(rawPayload.slice(0, 2), 10)
    const value = parseInt(rawPayload.slice(2), 16)
    return { deviceId, payload: { type, value } }
  })
)
