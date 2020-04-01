import { injectable } from 'inversify';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Logger, ExpressAdapter } from '@cents-ideas/utils';
import { UsersApiRoutes } from '@cents-ideas/enums';

import env from './environment';
import { UsersService } from './users.service';

@injectable()
export class UsersServer {
  private app = express();

  constructor(
    private logger: Logger,
    private usersService: UsersService,
    private expressAdapter: ExpressAdapter,
  ) {}

  start = () => {
    this.logger.debug('initialized with env: ', env);

    this.app.use(bodyParser.json());

    this.app.post(`/${UsersApiRoutes.Login}`, this.expressAdapter.json(this.usersService.login));
    this.app.post(
      `/${UsersApiRoutes.Authenticate}`,
      this.expressAdapter.json(this.usersService.authenticate),
    );

    this.app.post(
      `/${UsersApiRoutes.Update}`,
      this.expressAdapter.json(this.usersService.updateUser),
    );

    this.app.get(`/${UsersApiRoutes.Alive}`, (_req, res) => {
      return res.status(200).send();
    });

    this.app.listen(env.port, () =>
      this.logger.debug('users service listening on internal port', env.port),
    );
  };
}
