import { webSocket } from 'rxjs/webSocket'
import { map } from 'rxjs/operators'

global.WebSocket = require('ws') // <-- FIX ALL ERRORS
const source = webSocket('wss://totally-fake-sensor-data.herokuapp.com')

// const sensorLevelLow = false
const subject = source.pipe(
  map((msg) => {
    const { deviceId, payload: rawPayload } = msg
    console.log(deviceId, rawPayload)
    const type = parseInt(rawPayload.slice(0, 2), 10)
    const value = rawPayload.slice(2)
    console.log(type, value)
    return msg
  })
)
// .multicast(() => new Rx.Subject())

const battery$ = subject.subscribe((obj) => {
  console.log(obj)
  // console.log(obj.deviceId)
  // console.log(obj.payload)
})
// .filter((tweet) => tweet.user == '@angularfirebase')

// .scan((totalScore, current) => totalScore + current)
