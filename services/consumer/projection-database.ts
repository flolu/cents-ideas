import { injectable } from 'inversify';
import * as asyncRetry from 'async-retry';
import { MongoClient } from 'mongodb';

import { ConsumerEnvironment } from './consumer.environment';
import { IIdeaViewModel } from '@centsideas/models';

@injectable()
export class ProjectionDatabase {
  private client = new MongoClient(this.env.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  private readonly usersCollectionName = 'users';
  private readonly ideasCollectionName = 'ideas';
  private readonly reviewsCollectionName = 'reviews';

  constructor(private env: ConsumerEnvironment) {}

  ideas = async () => {
    const db = await this.database();
    return db.collection<IIdeaViewModel>(this.ideasCollectionName);
  };

  reviews = async () => {
    const db = await this.database();
    // TODOt type
    return db.collection(this.reviewsCollectionName);
  };

  users = async () => {
    const db = await this.database();
    // TODOt type
    return db.collection(this.usersCollectionName);
  };

  private database = async () => {
    if (!this.client.isConnected()) await asyncRetry(() => this.client.connect());
    return this.client.db(this.env.database.name);
  };
}
