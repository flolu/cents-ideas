import { EntityError } from '@cents-ideas/utils';
import { HttpStatusCodes } from '@cents-ideas/enums';

export class IdeaIdRequiredError extends EntityError {
  static validate = (ideaId: string): void => {
    if (!ideaId) {
      throw new IdeaIdRequiredError();
    }
  };

  constructor() {
    super(`Idea id required`, HttpStatusCodes.BadRequest);
  }
}
