import {DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

import {IdeaTags} from '../idea-tags';

export class IdeaTagsRemoved implements DomainEvent {
  readonly eventName = IdeaEventNames.TagsRemoved;

  constructor(public readonly id: IdeaId, public readonly tags: IdeaTags) {}

  // TODO would be awesome to do this with protobuf
  serialize(): IdeaModels.IdeaTagsRemovedData {
    return {
      id: this.id.toString(),
      tags: this.tags.toArray(),
    };
  }

  static deserialize({id, tags}: IdeaModels.IdeaTagsRemovedData) {
    return new IdeaTagsRemoved(IdeaId.fromString(id), IdeaTags.fromArray(tags));
  }
}
