import {injectable, inject} from 'inversify';

import {EventListener, PersistedEvent} from '@centsideas/event-sourcing2';
import {EventTopics, IdeaEventNames} from '@centsideas/enums';
import {Logger} from '@centsideas/utils';
import {GlobalEnvironment} from '@centsideas/environment';
import {IdeaModels} from '@centsideas/models';
import {
  RPC_CLIENT_FACTORY,
  RpcClientFactory,
  RpcClient,
  IdeaEventStore,
  deserializeEvent,
} from '@centsideas/rpc';
import {IdeaDetailsEnvironment} from './idea-details.environment';

@injectable()
export class IdeaDetailsProjector {
  bookmark = 0;
  documents: Record<string, IdeaModels.IdeaDetailModel> = {};

  private ideaEventStoreRpc: RpcClient<IdeaEventStore> = this.rpcFactory(
    this.env.ideaRpcHost,
    'idea',
    'IdeaEventStore',
    this.env.ideaEventStoreRpcPort,
  );

  constructor(
    private eventListener: EventListener,
    private logger: Logger,
    private env: IdeaDetailsEnvironment,
    private globalEnv: GlobalEnvironment,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');

    this.listen();
    this.replay();
  }

  created({id, userId, createdAt}: IdeaModels.IdeaCreatedData) {
    this.documents[id] = {
      id,
      userId,
      createdAt,
      title: '',
      description: '',
      tags: [],
      publishedAt: '',
      deletedAt: '',
    };
  }

  deleted({id, deletedAt}: IdeaModels.IdeaDeletedData) {
    if (!this.documents[id]) return;
    this.documents[id].deletedAt = deletedAt;
  }

  descriptionEdited({id, description}: IdeaModels.IdeaDescriptionEditedData) {
    if (!this.documents[id]) return;
    this.documents[id].description = description;
  }

  published({id, publishedAt}: IdeaModels.IdeaPublishedData) {
    if (!this.documents[id]) return;
    this.documents[id].publishedAt = publishedAt;
  }

  renamed({id, title}: IdeaModels.IdeaRenamedData) {
    if (!this.documents[id]) return;
    this.documents[id].title = title;
  }

  tagsAdded({id, tags}: IdeaModels.IdeaTagsAddedData) {
    if (!this.documents[id]) return;
    this.documents[id].tags.push(...tags);
  }

  tagsRemoved({id, tags}: IdeaModels.IdeaTagsRemovedData) {
    if (!this.documents[id]) return;
    this.documents[id].tags = this.documents[id].tags.filter(t => !tags.includes(t));
  }

  private listen() {
    this.eventListener.listen(EventTopics.Idea, 'centsideas-idea-details').subscribe(message => {
      const eventName = message.headers?.eventName.toString();
      if (!eventName) return;

      const value: PersistedEvent = JSON.parse(message.value.toString());
      this.trigger(value);
    });
  }

  private trigger(event: PersistedEvent) {
    // TODO throw error or what to do here?
    if (event.sequence <= this.bookmark) return;

    const data = event.data as any;
    this.bookmark = event.sequence;

    switch (event.name) {
      case IdeaEventNames.Created:
        return this.created(data);
      case IdeaEventNames.Deleted:
        return this.deleted(data);
      case IdeaEventNames.DescriptionEdited:
        return this.descriptionEdited(data);
      case IdeaEventNames.Published:
        return this.published(data);
      case IdeaEventNames.Renamed:
        return this.renamed(data);
      case IdeaEventNames.TagsAdded:
        return this.tagsAdded(data);
      case IdeaEventNames.TagsRemoved:
        return this.tagsRemoved(data);
    }
  }

  // TODO read commments from ben
  private replay() {
    this.ideaEventStoreRpc.client.getEvents({from: this.bookmark}).then(({events}) => {
      if (!events) return;
      const start = Number(new Date());

      const unknownEvents = events.map(deserializeEvent);
      this.logger.info('replay', unknownEvents.length, 'events');
      this.logger.info('current bookmark is', this.bookmark);

      unknownEvents.forEach(event => this.trigger(event));

      const end = Number(new Date());
      this.logger.info('new bookmark is', this.bookmark);
      this.logger.info('finished replaying', unknownEvents.length, 'events in', end - start, 'ms');
    });
  }
}
