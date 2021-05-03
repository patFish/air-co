import { co2$ } from './co2Sensor'

let roomLowLevel = new Map()

const roomLevel = co2$.subscribe(({ deviceId, payload }) => {
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
