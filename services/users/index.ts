import 'module-alias/register';
import 'reflect-metadata';

import { registerProviders, Logger, getProvider, ExpressAdapter } from '@cents-ideas/utils';
import { MessageBroker } from '@cents-ideas/event-sourcing';

import { UsersServer } from './users.server';
import { UserCommandHandler } from './user.command-handler';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';

process.env.LOGGER_PREFIX = '👥';

registerProviders(Logger, UsersServer, UsersService, UserCommandHandler, UserRepository, MessageBroker, ExpressAdapter);

const server: UsersServer = getProvider(UsersServer);
server.start();
