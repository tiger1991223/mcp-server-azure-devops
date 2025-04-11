import { getBranches } from './feature';
import { WebApi } from 'azure-devops-node-api';

jest.mock('azure-devops-node-api');

describe('getBranches', () => {
  let mockConnection: WebApi;
  let mockGetBranches: jest.Mock;

  beforeEach(() => {
    mockConnection = new WebApi('', jest.fn() as any);
    mockGetBranches = jest.fn();
    (mockConnection.getGitApi as jest.Mock).mockResolvedValue({
      getBranches: mockGetBranches,
    });
  });

  it('should fetch all branches successfully', async () => {
    const mockResponse = [
      { name: 'refs/heads/main' },
      { name: 'refs/heads/feature-branch' },
    ];

    mockGetBranches.mockResolvedValue(mockResponse);

    const result = await getBranches(mockConnection, {
      project: 'test-project',
      repositoryId: 'test-repo',
    });

    expect(mockGetBranches).toHaveBeenCalledWith('test-repo', 'test-project');
    expect(result).toEqual(['refs/heads/main', 'refs/heads/feature-branch']);
  });

  it('should throw an error if no branches are found', async () => {
    mockGetBranches.mockResolvedValue([]);

    await expect(
      getBranches(mockConnection, {
        project: 'test-project',
        repositoryId: 'test-repo',
      }),
    ).rejects.toThrow('No branches found');
  });

  it('should throw an error if fetching branches fails', async () => {
    mockGetBranches.mockRejectedValue(new Error('Failed to fetch branches'));

    await expect(
      getBranches(mockConnection, {
        project: 'test-project',
        repositoryId: 'test-repo',
      }),
    ).rejects.toThrow('Failed to fetch branches');
  });
});
