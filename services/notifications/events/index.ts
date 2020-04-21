import { composeCommitFunctions } from '@centsideas/event-sourcing';
import { INotificationSettingsState, INotificationState } from '@centsideas/models';

import { NotificationSettingsCreatedEvent } from './notification-settings-created.event';
import { NotificationSettingsUpdatedEvent } from './notification-settings-updated.event';
import { PushSubscriptionAddedEvent } from './push-subscription-added.event';
import { PushSubscriptionsRemovedEvent } from './push-subscriptions-removed.event';

export const NotificationSettingsEvents = {
  NotificationSettingsCreatedEvent,
  NotificationSettingsUpdatedEvent,
  PushSubscriptionAddedEvent,
  PushSubscriptionsRemovedEvent,
};
export const NotificationsEvents = {};

export const notificationSettingsCommitFunctions = composeCommitFunctions<
  INotificationSettingsState
>(NotificationSettingsEvents);
export const notificationsCommitFunctions = composeCommitFunctions<INotificationState>(
  NotificationsEvents,
);
