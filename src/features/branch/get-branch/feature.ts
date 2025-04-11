import { WebApi } from 'azure-devops-node-api';
import { AzureDevOpsError } from '../../../shared/errors';
import { GetBranchOptions } from '../types';

/**
 * Get branch
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for getting a branch
 * @returns The branch name
 */
export async function getBranch(
  connection: WebApi,
  options: GetBranchOptions,
): Promise<string> {
  try {
    const { project, repositoryId, branchName } = options;

    if (!repositoryId || !project || !branchName) {
      throw new Error('Repository ID, Project, and Branch Name are required');
    }

    const gitApi = await connection.getGitApi();

    // Get the branches
    const branches = await gitApi.getBranches(repositoryId, project);

    if (!branches || branches.length === 0) {
      throw new Error('No branches found');
    }

    const branch = branches.find((b) => b.name === branchName);

    if (!branch) {
      throw new Error(`Branch ${branchName} not found`);
    }

    return branch.name || '';
  } catch (error) {
    if (error instanceof AzureDevOpsError) {
      throw error;
    }
    throw new Error(
      `Failed to get branch: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
