import {inject, interfaces, injectable} from 'inversify';

import {Id, ISODate} from '@centsideas/types';

import {EventStore} from './event-store';
import {OptimisticConcurrencyIssue} from './optimistic-concurrency-issue';
import {StreamEvents} from './stream-event';
import {EventId} from './event-id';
import {PersistedEvent} from './persisted-event';
import {EventDispatcher} from './event-dispatcher';
import {EVENT_NAME_METADATA} from './domain-event';
import {EventStoreFactoryOptions} from './interfaces';

@injectable()
export class InMemoryEventStore implements EventStore {
  topic!: string;

  private events: PersistedEvent[] = [];
  private sequence: number = 0;

  @inject(EventDispatcher) private dispatcher!: EventDispatcher;

  async getStream(id: Id) {
    return this.events
      .filter(e => id.toString() === e.streamId)
      .sort((a, b) => a.version - b.version);
  }

  async store(events: StreamEvents, lastVersion: number) {
    if (!events.toArray().length) return;

    const lastStoredEvent = await this.getLastEvent(events.aggregateId);
    if (lastStoredEvent && lastStoredEvent.version !== lastVersion) {
      // TODO retry command (maybe orchestrated by command bus?!)
      throw new OptimisticConcurrencyIssue();
    }

    const toInsert = events.toArray().map(streamEvent => {
      this.sequence++;
      const insert: PersistedEvent = {
        id: EventId.generate().toString(),
        streamId: events.aggregateId.toString(),
        version: streamEvent.version.toNumber(),
        name: Reflect.getMetadata(EVENT_NAME_METADATA, streamEvent.event),
        data: streamEvent.event.serialize(),
        insertedAt: ISODate.now().toString(),
        sequence: this.sequence,
      };
      return insert;
    });

    toInsert.forEach(e => this.events.push(e));

    await this.dispatcher.dispatch(
      this.topic,
      toInsert.map(event => ({
        key: events.aggregateId.toString(),
        // TODO serializer for whole event
        value: JSON.stringify(event),
        headers: {eventName: event.name},
      })),
    );
  }

  async getEvents(from: number = 0) {
    return this.events
      .filter(event => event.sequence >= from)
      .sort((a, b) => a.version - b.version);
  }

  private async getLastEvent(streamId: Id) {
    return this.events
      .filter(e => streamId.toString() === e.streamId)
      .sort((a, b) => b.version - a.version)[0];
  }
}

export type InMemoryEventStoreFactory = (options: EventStoreFactoryOptions) => InMemoryEventStore;
export const inMemoryEventStoreFactory = (
  context: interfaces.Context,
): InMemoryEventStoreFactory => {
  return ({topic}) => {
    const store = context.container.get(InMemoryEventStore);
    store.topic = topic;
    return store;
  };
};
