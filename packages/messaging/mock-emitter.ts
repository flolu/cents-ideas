import {EventEmitter} from 'events'
import {decorate, injectable} from 'inversify'

decorate(injectable(), EventEmitter)

@injectable()
export class MockEmitter extends EventEmitter {}
