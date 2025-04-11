export interface ListBranchOptions {
  project: string; // The name or ID of the Azure DevOps project
  repositoryId: string; // The ID of the repository to list branches from
  branchName?: string; // Optional: Filter by branch name
}
