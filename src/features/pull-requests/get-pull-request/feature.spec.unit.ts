import { getPullRequest } from './feature';
import { WebApi } from 'azure-devops-node-api';
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';

jest.mock('azure-devops-node-api');

describe('getPullRequest', () => {
  let mockConnection: WebApi;
  let mockGetPullRequest: jest.Mock;

  beforeEach(() => {
    mockConnection = new WebApi('', jest.fn() as any);
    mockGetPullRequest = jest.fn();
    (mockConnection.getGitApi as jest.Mock).mockResolvedValue({
      getPullRequests: mockGetPullRequest,
    });
  });

  it('should fetch pull request details successfully', async () => {
    const mockResponse: GitPullRequest = {
      pullRequestId: 1,
      title: 'Test PR',
      status: 1, // Assuming '1' corresponds to 'active' in PullRequestStatus enum
    } as GitPullRequest;

    mockGetPullRequest.mockResolvedValue(mockResponse);

    const result = await getPullRequest(mockConnection, {
      projectId: 'test-project',
      repositoryId: 'test-repo',
      status: 'active',
    });

    expect(mockGetPullRequest).toHaveBeenCalledWith(
      'test-repo',
      1,
      'test-project',
    );
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if fetching pull request fails', async () => {
    mockGetPullRequest.mockRejectedValue(new Error('Failed to fetch PR'));

    await expect(
      getPullRequest(mockConnection, {
        projectId: 'test-project',
        repositoryId: 'test-repo',
        status: 'active',
      }),
    ).rejects.toThrow('Failed to fetch PR');
  });
});
