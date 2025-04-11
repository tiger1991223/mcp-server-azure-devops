import { WebApi } from 'azure-devops-node-api';
import { AzureDevOpsError } from '../../../shared/errors';
import { PullRequest, ListPullRequestsOptions } from '../types';

/**
 * Get a pull request
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for listing pull requests
 * @returns The pull request details
 */
export async function getPullRequest(
  connection: WebApi,
  options: ListPullRequestsOptions,
): Promise<PullRequest> {
  try {
    if (!options.repositoryId || !options.projectId) {
      throw new Error('Repository ID and Project ID are required');
    }

    const gitApi = await connection.getGitApi();

    // Get the pull request
    const pullRequests = await gitApi.getPullRequests(
      options.repositoryId,
      {
        status: options.status === 'all' ? undefined : (options.status as any),
        creatorId: options.creatorId,
        reviewerId: options.reviewerId,
        sourceRefName: options.sourceBranch,
        targetRefName: options.targetBranch,
      },
      options.projectId,
    );

    if (!pullRequests || pullRequests.length === 0) {
      throw new Error('No pull requests found');
    }

    return pullRequests[0];
  } catch (error) {
    if (error instanceof AzureDevOpsError) {
      throw error;
    }
    throw new Error(
      `Failed to get pull request: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
