import { co2$ } from './co2Sensor'

let roomLowLevel = new Map()

const CO2THRESHOLD = 1200

const roomLevel = co2$.subscribe(({ deviceId, payload }) => {
  const { value: co2 } = payload
  let newCo2Level = co2 > CO2THRESHOLD ? 'high' : 'low'

  if (roomLowLevel.get(deviceId) === undefined) {
    roomLowLevel.set(deviceId, newCo2Level)
    console.log(`Sensor ${deviceId} level: ${newCo2Level}`)
  }

  const roomLevel = roomLowLevel.get(deviceId)

  if (roomLevel != newCo2Level) {
    roomLowLevel.set(deviceId, newCo2Level)
    console.log(`Sensor ${deviceId} level: ${newCo2Level}`)
  }
})
