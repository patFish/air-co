import { filter } from 'rxjs/operators'
import { sensorData$ } from './sensorManagement'

export const co2$ = sensorData$.pipe(filter((msg) => msg.payload.type === 1))
