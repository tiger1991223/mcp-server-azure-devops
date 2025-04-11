import { getBranch } from './feature';
import { WebApi } from 'azure-devops-node-api';

jest.mock('azure-devops-node-api');

describe('getBranch', () => {
  let mockConnection: WebApi;
  let mockGetBranches: jest.Mock;

  beforeEach(() => {
    mockConnection = new WebApi('', jest.fn() as any);
    mockGetBranches = jest.fn();
    (mockConnection.getGitApi as jest.Mock).mockResolvedValue({
      getBranches: mockGetBranches,
    });
  });

  it('should fetch branch details successfully', async () => {
    const mockResponse = [
      { name: 'refs/heads/main' },
      { name: 'refs/heads/feature-branch' },
    ];

    mockGetBranches.mockResolvedValue(mockResponse);

    const result = await getBranch(mockConnection, {
      project: 'test-project',
      repositoryId: 'test-repo',
      branchName: 'refs/heads/main',
    });

    expect(mockGetBranches).toHaveBeenCalledWith('test-repo', 'test-project');
    expect(result).toBe('refs/heads/main');
  });

  it('should throw an error if branch is not found', async () => {
    const mockResponse = [{ name: 'refs/heads/feature-branch' }];

    mockGetBranches.mockResolvedValue(mockResponse);

    await expect(
      getBranch(mockConnection, {
        project: 'test-project',
        repositoryId: 'test-repo',
        branchName: 'refs/heads/main',
      }),
    ).rejects.toThrow('Branch refs/heads/main not found');
  });

  it('should throw an error if fetching branches fails', async () => {
    mockGetBranches.mockRejectedValue(new Error('Failed to fetch branches'));

    await expect(
      getBranch(mockConnection, {
        project: 'test-project',
        repositoryId: 'test-repo',
        branchName: 'refs/heads/main',
      }),
    ).rejects.toThrow('Failed to fetch branches');
  });
});
