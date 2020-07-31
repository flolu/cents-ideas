export interface ReviewModel {
  id: string;
  authorUserId: string;
  receiverUserId: string;
  content: string;
  score: SerializedReviewScore;
  publishedAt: string;
  updatedAt: string;
  lastEventVersion: number;
}

export interface ReviewCreatedData {
  id: string;
  authorUserId: string;
  receiverUserId: string;
  ideaId: string;
  createdAt: string;
}

export interface ReviewContentEditedData {
  content: string;
}

export interface ReviewScoreChangedData {
  score: SerializedReviewScore;
}

export interface ReviewPublishedData {
  publishedAt: string;
}

export interface SerializedReviewScore {
  control: number;
  entry: number;
  need: number;
  time: number;
  scale: number;
}
