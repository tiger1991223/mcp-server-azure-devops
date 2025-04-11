import { WebApi } from 'azure-devops-node-api';
import { createPullRequest } from './feature';
import {
  getTestConnection,
  shouldSkipIntegrationTest,
} from '@/shared/test/test-helpers';

describe('createPullRequest integration', () => {
  let connection: WebApi | null = null;

  beforeAll(async () => {
    // Get a real connection using environment variables
    connection = await getTestConnection();
  });

  test('should create a new pull request in Azure DevOps', async () => {
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

    // Create a unique title using timestamp to avoid conflicts
    const uniqueTitle = `Test Pull Request ${new Date().toISOString()}`;

    // For a true integration test, use a real project and repository
    const projectName =
      process.env.AZURE_DEVOPS_DEFAULT_PROJECT || 'DefaultProject';
    const repositoryId =
      process.env.AZURE_DEVOPS_DEFAULT_REPOSITORY || 'DefaultRepo';

    // Create a pull request
    const result = await createPullRequest(
      connection,
      projectName,
      repositoryId,
      {
        repositoryId: repositoryId,
        title: uniqueTitle,
        description:
          'This is a test pull request created by an integration test',
        sourceBranch: 'refs/heads/feature-branch',
        targetBranch: 'refs/heads/main',
        isDraft: true,
      },
    );

    // Assert on the actual response
    expect(result).toBeDefined();
    expect(result.pullRequestId).toBeDefined();
    expect(result.title).toBe(uniqueTitle);
    expect(result.description).toBe(
      'This is a test pull request created by an integration test',
    );
    expect(result.sourceRefName).toBe('refs/heads/feature-branch');
    expect(result.targetRefName).toBe('refs/heads/main');
    expect(result.isDraft).toBe(true);
  });
});
