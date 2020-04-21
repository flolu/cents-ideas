import 'reflect-metadata';

import { registerProviders, getProvider, overrideProvider } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';
import { makeFakeHttpRequest } from '@centsideas/models';

import { IdeasService } from './ideas.service';
import {
  IdeaCommandHandlerMock,
  fakeIdeaId,
  fakeUserId,
  fakeIdeaTitle,
  fakeIdeaDescription,
} from './test';
import { Idea } from './idea.entity';
import { IdeaCommandHandler } from './idea.command-handler';
import { IdeaRepository } from './idea.repository';
import { IdeaRepositoryMock } from './test/idea.repository.mock';

describe('Ideas Service', () => {
  registerProviders(IdeasService, IdeaCommandHandler, IdeaRepository);
  overrideProvider(IdeaCommandHandler, IdeaCommandHandlerMock);
  overrideProvider(IdeaRepository, IdeaRepositoryMock);

  const service: IdeasService = getProvider(IdeasService);

  it('should create an idea', async () => {
    const request = makeFakeHttpRequest({ locals: { userId: fakeUserId } });
    const response = await service.create(request);

    // FIXME find a better way! (maybe I need to mock whole idea entity with all events?!)
    const createdAt = new Date().toISOString();
    response.body.createdAt = createdAt;
    response.body.lastEventId = '';

    expect(response).toEqual({
      status: HttpStatusCodes.Accepted,
      body: {
        ...Idea.initialState,
        id: fakeIdeaId,
        userId: fakeUserId,
        createdAt,
        title: fakeIdeaTitle,
        description: fakeIdeaDescription,
        lastEventNumber: 1,
      },
    });
  });
});
