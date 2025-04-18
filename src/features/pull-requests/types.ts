import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';

export type PullRequest = GitPullRequest;

/**
 * Options for creating a pull request
 */
export interface CreatePullRequestOptions {
  projectId: string;
  title: string;
  description?: string;
  sourceBranch: string;
  targetBranch: string;
  repositoryId: string;
  reviewers?: string[];
  isDraft?: boolean;
  workItemRefs?: number[];
  additionalProperties?: Record<string, any>;
}

/**
 * Options for listing pull requests
 */
export interface ListPullRequestsOptions {
  projectId: string;
  repositoryId: string;
  status?: 'all' | 'active' | 'completed' | 'abandoned';
  creatorId?: string;
  reviewerId?: string;
  sourceBranch?: string;
  targetBranch?: string;
  top?: number;
  skip?: number;
}

/**
 * Options for updating a pull request
 */
export interface UpdatePullRequestOptions {
  projectId: string;
  repositoryId: string;
  title?: string;
  description?: string;
  status?: 'active' | 'completed' | 'abandoned';
  reviewers?: string[];
  isDraft?: boolean;
  additionalProperties?: Record<string, any>;
}
