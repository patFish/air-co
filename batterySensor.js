import { filter } from 'rxjs/operators'
import { sensorData$ } from './sensorManagement'

const battery$ = sensorData$.pipe(filter((msg) => msg.payload.type === 2))

battery$.subscribe(({ deviceId, payload }) => {
  const { value: mV } = payload
  const batteryStatus = mV / 1000
  console.log(`Sensor ${deviceId} battery status: ${batteryStatus}V`)
})
