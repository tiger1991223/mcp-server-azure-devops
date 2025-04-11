export interface GetBranchOptions {
  project: string; // The name or ID of the Azure DevOps project
  repositoryId: string; // The ID of the repository to get a branch from
  branchName: string; // The name of the branch to retrieve
}

export interface GetBranchesOptions {
  project: string; // The name or ID of the Azure DevOps project
  repositoryId: string; // The ID of the repository to list branches from
  branchName?: string; // Optional: Filter by branch name
}
