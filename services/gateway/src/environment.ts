import { IServerEnvironment } from '@cents-ideas/models';

export interface IGatewayEnvironment extends IServerEnvironment {
  port: number;
  hosts: {
    ideas: string;
    consumer: string;
    reviews: string;
  };
}

const env: IGatewayEnvironment = {
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  hosts: {
    ideas: `http://${process.env.IDEAS_SERVICE_HOST || 'ideas:3000'}`,
    consumer: `http://${process.env.CONSUMER_SERVICE_HOST || 'consumer:3000'}`,
    reviews: `http://${process.env.REVIEWS_SERVICE_HOST || 'reviews:3000'}`,
  },
};

export default env;
