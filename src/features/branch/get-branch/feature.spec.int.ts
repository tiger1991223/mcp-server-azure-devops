import { WebApi } from 'azure-devops-node-api';
import { getBranch } from './feature';
import {
  getTestConnection,
  shouldSkipIntegrationTest,
} from '@/shared/test/test-helpers';

describe('getBranch integration', () => {
  let connection: WebApi | null = null;

  beforeAll(async () => {
    // Get a real connection using environment variables
    connection = await getTestConnection();
  });

  test('should retrieve an existing branch in Azure DevOps', async () => {
    // Skip if no connection is available
    if (shouldSkipIntegrationTest()) {
      return;
    }

    // This connection must be available if we didn't skip
    if (!connection) {
      throw new Error(
        'Connection should be available when test is not skipped',
      );
    }

    // For a true integration test, use a real project, repository, and branch name
    const projectName =
      process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'DefaultProject';
    const repositoryId =
      process.env.AZURE_DEVOPS_DEFAULT_REPOSITORY || 'DefaultRepo';
    const branchName = 'refs/heads/main';

    // Retrieve the branch
    const result = await getBranch(connection, {
      project: projectName,
      repositoryId: repositoryId,
      branchName: branchName,
    });

    // Assert on the actual response
    expect(result).toBeDefined();
    expect(result).toBe(branchName);
  });
});
