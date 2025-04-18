import { createPullRequest } from './feature';
import { AzureDevOpsError } from '../../../shared/errors';

describe('createPullRequest unit', () => {
  // Test for required fields validation
  test('should throw error when title is not provided', async () => {
    // Arrange - mock connection, never used due to validation error
    const mockConnection: any = {
      getGitApi: jest.fn(),
    };

    // Act & Assert
    await expect(
      createPullRequest(mockConnection, {
        projectId: 'TestProject',
        repositoryId: 'TestRepo',
        title: '',
        sourceBranch: 'refs/heads/feature-branch',
        targetBranch: 'refs/heads/main',
      }),
    ).rejects.toThrow('Title is required');
  });

  test('should throw error when source branch is not provided', async () => {
    // Arrange - mock connection, never used due to validation error
    const mockConnection: any = {
      getGitApi: jest.fn(),
    };

    // Act & Assert
    await expect(
      createPullRequest(mockConnection, {
        projectId: 'TestProject',
        repositoryId: 'TestRepo',
        title: 'Test PR',
        sourceBranch: '',
        targetBranch: 'refs/heads/main',
      }),
    ).rejects.toThrow('Source branch is required');
  });

  test('should throw error when target branch is not provided', async () => {
    // Arrange - mock connection, never used due to validation error
    const mockConnection: any = {
      getGitApi: jest.fn(),
    };

    // Act & Assert
    await expect(
      createPullRequest(mockConnection, {
        projectId: 'TestProject',
        repositoryId: 'TestRepo',
        title: 'Test PR',
        sourceBranch: 'refs/heads/feature-branch',
        targetBranch: '',
      }),
    ).rejects.toThrow('Target branch is required');
  });

  // Test for error propagation
  test('should propagate custom errors when thrown internally', async () => {
    // Arrange
    const mockConnection: any = {
      getGitApi: jest.fn().mockImplementation(() => {
        throw new AzureDevOpsError('Custom error');
      }),
    };

    // Act & Assert
    await expect(
      createPullRequest(mockConnection, {
        projectId: 'TestProject',
        repositoryId: 'TestRepo',
        title: 'Test PR',
        sourceBranch: 'refs/heads/feature-branch',
        targetBranch: 'refs/heads/main',
      }),
    ).rejects.toThrow(AzureDevOpsError);

    await expect(
      createPullRequest(mockConnection, {
        projectId: 'TestProject',
        repositoryId: 'TestRepo',
        title: 'Test PR',
        sourceBranch: 'refs/heads/feature-branch',
        targetBranch: 'refs/heads/main',
      }),
    ).rejects.toThrow('Custom error');
  });

  test('should wrap unexpected errors in a friendly error message', async () => {
    // Arrange
    const mockConnection: any = {
      getGitApi: jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      }),
    };

    // Act & Assert
    await expect(
      createPullRequest(mockConnection, {
        projectId: 'TestProject',
        repositoryId: 'TestRepo',
        title: 'Test PR',
        sourceBranch: 'refs/heads/feature-branch',
        targetBranch: 'refs/heads/main',
      }),
    ).rejects.toThrow('Failed to create pull request: Unexpected error');
  });
});
