import { WebApi } from 'azure-devops-node-api';
import { AzureDevOpsError } from '../../../shared/errors';
import { GetBranchesOptions } from '../types';

/**
 * Get branches
 *
 * @param connection The Azure DevOps WebApi connection
 * @param options Options for listing branches
 * @returns The list of branch names
 */
export async function getBranches(
  connection: WebApi,
  options: GetBranchesOptions,
): Promise<string[]> {
  try {
    const { project, repositoryId } = options;

    if (!repositoryId || !project) {
      throw new Error('Repository ID and Project are required');
    }

    const gitApi = await connection.getGitApi();

    // Get the branches
    const branches = await gitApi.getBranches(repositoryId, project);

    if (!branches || branches.length === 0) {
      throw new Error('No branches found');
    }

    return branches.map((branch) => branch.name || '');
  } catch (error) {
    if (error instanceof AzureDevOpsError) {
      throw error;
    }
    throw new Error(
      `Failed to get branches: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
