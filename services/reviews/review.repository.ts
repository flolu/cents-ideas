import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Review } from './review.entity';
import { ReviewsEnvironment } from './reviews.environment';

@injectable()
export class ReviewRepository extends EventRepository<Review> {
  constructor(private env: ReviewsEnvironment, private messageBroker: MessageBroker) {
    super(
      messageBroker.dispatchEvents,
      Review,
      env.database.url,
      env.database.name,
      EventTopics.Reviews,
    );
  }
}
