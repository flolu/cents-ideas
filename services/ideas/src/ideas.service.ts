import { HttpStatusCodes } from '@cents-ideas/enums';
import { HttpRequest, HttpResponse } from '@cents-ideas/models';
import { ICommitIdeaDraftDto, IQueryIdeaDto, ISaveIdeaDto, IUpdateIdeaDraftDto } from './dtos/ideas.dto';
import env from './environment';
import { handleHttpResponseError } from './errors/http-response-error-handler';
import { IdeaCommandHandler } from './idea.command-handler';

const { logger } = env;

export class IdeasService {
  constructor(private readonly commandHandler: IdeaCommandHandler) {}

  createEmptyIdea = (_req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'create';
      try {
        logger.info(_loggerName);
        const idea = await this.commandHandler.create();
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { created: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        logger.error(_loggerName, error);
        resolve(handleHttpResponseError(error));
      }
    });

  saveDraft = (req: HttpRequest<ISaveIdeaDto, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'save draft';
      try {
        logger.info(_loggerName);
        const idea = await this.commandHandler.saveDraft(req.params.id, req.body.title, req.body.description);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { saved: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        logger.error(_loggerName, error);
        resolve(handleHttpResponseError(error));
      }
    });

  discardDraft = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'discard draft';
      try {
        logger.info(_loggerName);
        const idea = await this.commandHandler.discardDraft(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { updated: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        logger.error(_loggerName, error);
        resolve(handleHttpResponseError(error));
      }
    });

  commitDraft = (req: HttpRequest<ICommitIdeaDraftDto, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'commit draft';
      try {
        logger.info(_loggerName);
        const idea = await this.commandHandler.commitDraft(req.params.id, req.body.title, req.body.description);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { updated: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        logger.error(_loggerName, error);
        resolve(handleHttpResponseError(error));
      }
    });

  publish = (req: HttpRequest<{}, IQueryIdeaDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'publish';
      try {
        logger.info(_loggerName);
        const idea = await this.commandHandler.publish(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { published: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        logger.error(_loggerName, error);
        resolve(handleHttpResponseError(error));
      }
    });

  update = (req: HttpRequest<IUpdateIdeaDraftDto>): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'update';
      try {
        logger.info(_loggerName);
        const idea = await this.commandHandler.update(req.params.id, req.body.title, req.body.description);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { unpublish: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        logger.error(_loggerName, error);
        resolve(handleHttpResponseError(error));
      }
    });

  unpublish = (req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'unpublish';
      try {
        logger.info(_loggerName);
        const idea = await this.commandHandler.unpublish(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { unpublish: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        logger.error(_loggerName, error);
        resolve(handleHttpResponseError(error));
      }
    });

  delete = (req: HttpRequest): Promise<HttpResponse> =>
    new Promise(async resolve => {
      const _loggerName = 'delete';
      try {
        logger.info(_loggerName);
        const idea = await this.commandHandler.delete(req.params.id);
        resolve({
          status: HttpStatusCodes.Accepted,
          body: { deleted: idea.persistedState },
          headers: {},
        });
      } catch (error) {
        logger.error(_loggerName, error);
        resolve(handleHttpResponseError(error));
      }
    });
}
