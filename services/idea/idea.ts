import {Aggregate} from '@centsideas/event-sourcing2';
import {IdeaId, UserId, ISODate} from '@centsideas/types';

import {NoPermissionToAccessIdea} from './no-permission-to-access-idea';
import {IdeaDescriptionEdited} from './idea-description-edited';
import {IdeaTitleRequiredError} from './idea-title-required';
import {IdeaTagsRemoved} from './idea-tags-removed';
import {IdeaDescription} from './idea-description';
import {IdeaTagsAdded} from './idea-tags-added';
import {IdeaPublished} from './idea-published';
import {IdeaCreated} from './idea-created';
import {IdeaRenamed} from './idea-renamed';
import {IdeaDeleted} from './idea-deleted';
import {IdeaTitle} from './idea-title';
import {IdeaTags} from './idea-tags';

export class Idea extends Aggregate {
  protected id!: IdeaId;
  private userId!: UserId;
  private title!: IdeaTitle;
  private tags = IdeaTags.empty();

  static buildFrom(events: any[]) {
    const idea = new Idea();
    idea.replay(events);
    return idea;
  }

  static create(id: IdeaId, user: UserId, createdAt: ISODate) {
    const idea = new Idea();
    idea.raise(new IdeaCreated(id, user, createdAt));
    return idea;
  }

  // TODO decide whether to pass userId to all methods or validate it before calling methods?!
  // -> ask shawn
  rename(title: IdeaTitle, user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    this.raise(new IdeaRenamed(this.id, title));
  }

  editDescription(description: IdeaDescription, user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    this.raise(new IdeaDescriptionEdited(this.id, description));
  }

  updateTags(tags: IdeaTags, user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    const {added, removed} = tags.findDifference(this.tags);
    if (added.toArray().length) this.raise(new IdeaTagsAdded(this.id, added));
    if (removed.toArray().length) this.raise(new IdeaTagsRemoved(this.id, removed));
  }

  publish(publishedAt: ISODate, user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    if (!this.title) throw new IdeaTitleRequiredError(this.id, user);
    this.raise(new IdeaPublished(this.id, publishedAt));
  }

  delete(user: UserId) {
    if (this.userId !== user) throw new NoPermissionToAccessIdea(this.id, user);
    this.raise(new IdeaDeleted(this.id));
  }

  // TODO maybe implementation that doesn't need this helper method? (maybe with dectorators + reflection)
  // https://github.com/nestjs/cqrs/blob/master/src/decorators/command-handler.decorator.ts
  // TODO type
  invokeApplyMethod(someEvent: any) {
    switch (someEvent.name) {
      case IdeaCreated.eventName: {
        const event: IdeaCreated = someEvent;
        this.id = event.id;
        this.userId = event.userId;
        this.title = IdeaTitle.fromString('My Awesome Idea');
        break;
      }
      case IdeaRenamed.eventName: {
        const event: IdeaRenamed = someEvent;
        this.title = event.title;
        break;
      }
      case IdeaDescriptionEdited.eventName:
        break;
      case IdeaTagsAdded.eventName: {
        const event: IdeaTagsAdded = someEvent;
        this.tags.add(event.tags);
        break;
      }
      case IdeaTagsRemoved.eventName: {
        const event: IdeaTagsRemoved = someEvent;
        this.tags.remove(event.tags);
        break;
      }
      case IdeaPublished.eventName:
        break;
      case IdeaDeleted.eventName:
        break;
      default:
        throw new Error(`No apply method for event with name: ${someEvent.name}`);
    }
  }
}
