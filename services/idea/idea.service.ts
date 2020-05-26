import {injectable, inject} from 'inversify';

import {MONGO_EVENT_STORE_FACTORY, MongoEventStoreFactory} from '@centsideas/event-sourcing2';
import {UserId, IdeaId, ISODate} from '@centsideas/types';
import {serializeEvent} from '@centsideas/rpc';
import {EventTopics} from '@centsideas/enums';

import {Idea} from './idea';
import {IdeaTitle} from './idea-title';
import {IdeaDescription} from './idea-description';
import {IdeaTags} from './idea-tags';
import {IdeaEnvironment} from './idea.environment';

/**
 * TODO maybe return event version, so that frontend can send this version to
 * projectors for better querying (probably something for read model)
 */
@injectable()
export class IdeaService {
  private eventStore = this.eventStoreFactory({
    url: this.env.ideaEventStoreDatabaseUrl,
    name: 'idea_event_store', // TODO hardcode or into env vars?
    topic: EventTopics.Idea,
  });

  constructor(
    private env: IdeaEnvironment,
    @inject(MONGO_EVENT_STORE_FACTORY) private eventStoreFactory: MongoEventStoreFactory,
  ) {}

  async create(id: IdeaId, userId: string) {
    const idea = Idea.create(id, UserId.fromString(userId), ISODate.now());
    await this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async rename(id: string, userId: string, title: string) {
    const events = await this.eventStore.getStream(IdeaId.fromString(id));
    const idea = Idea.buildFrom(events);
    idea.rename(IdeaTitle.fromString(title), UserId.fromString(userId));
    await this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async editDescription(id: string, userId: string, description: string) {
    const events = await this.eventStore.getStream(IdeaId.fromString(id));
    const idea = Idea.buildFrom(events);
    idea.editDescription(IdeaDescription.fromString(description), UserId.fromString(userId));
    await this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async updateTags(id: string, userId: string, tags: string[]) {
    const events = await this.eventStore.getStream(IdeaId.fromString(id));
    const idea = Idea.buildFrom(events);
    idea.updateTags(IdeaTags.fromArray(tags), UserId.fromString(userId));
    await this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async publish(id: string, userId: string) {
    const events = await this.eventStore.getStream(IdeaId.fromString(id));
    const idea = Idea.buildFrom(events);
    idea.publish(ISODate.now(), UserId.fromString(userId));
    await this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async delete(id: string, userId: string) {
    const events = await this.eventStore.getStream(IdeaId.fromString(id));
    const idea = Idea.buildFrom(events);
    idea.delete(ISODate.now(), UserId.fromString(userId));
    await this.eventStore.store(idea.flushEvents(), idea.persistedAggregateVersion);
  }

  async getEvents(from?: number) {
    const events = await this.eventStore.getEvents(from || -1);
    return events.map(serializeEvent);
  }
}
