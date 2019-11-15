export interface IIdeaViewModel {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  published: boolean;
  publishedAt: string | null;
  unpublishedAt: string | null;
  updatedAt: string | null;
  deleted: boolean;
  deletedAt: string | null;
  draft: null | { title: string; description: string };
  reviews: any[];
  user: any;
  scores: any;
  lastEventId: string;
}
