import { WebApi } from 'azure-devops-node-api';
import { getPullRequest } from './feature';
import {
  getTestConnection,
  shouldSkipIntegrationTest,
} from '@/shared/test/test-helpers';

describe('getPullRequest integration', () => {
  let connection: WebApi | null = null;

  beforeAll(async () => {
    // Get a real connection using environment variables
    connection = await getTestConnection();
  });

  test('should retrieve an existing pull request in Azure DevOps', async () => {
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

    // For a true integration test, use a real project, repository, and pull request ID
    const projectName =
      process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'DefaultProject';
    const repositoryId =
      process.env.AZURE_DEVOPS_DEFAULT_REPOSITORY || 'DefaultRepo';
    const options = {
      projectId: projectName,
      repositoryId: repositoryId,
      status: 'active' as const,
      creatorId: 'user-id',
      sourceBranch: 'refs/heads/feature-branch',
      targetBranch: 'refs/heads/main',
      top: 1,
      skip: 0,
    };

    // Retrieve the pull requests
    const result = await getPullRequest(connection, options);

    // Assert on the actual response
    expect(result).toBeDefined();
    expect(result).toBeDefined();
    if (Array.isArray(result)) {
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]?.repository).toBeDefined();
      expect(result[0]?.repository.id).toBe(repositoryId);
    } else {
      throw new Error('Expected result to be an array of GitPullRequest');
    }
  });
});
