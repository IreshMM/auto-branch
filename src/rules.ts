import { Octokit } from "@octokit/rest";
import { branches, protection } from "./config/data";
import { Repository } from "./interfaces/repository";

export async function setProtections(context: Octokit, repo: Repository) {
  let success: boolean = true;
  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    if (!(await setProtectionForBranch(context, repo, branch))) success = false;
  }
  return success;
}

async function setProtectionForBranch(
  context: Octokit,
  repo: Repository,
  branch: string
) {
  try {
    const response = await context.repos.updateBranchProtection({
      headers: {
        accept: 'application/vnd.github.luke-cage-preview+json'
      },
      ...{
        owner: repo.owner,
        repo: repo.name,
        branch,
      },
      ...protection,
    });

    if (response.status == 200) {
      console.log(
        `Branch protection for branch ${branch} on Repo ${repo.name} created!`
      );
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    console.log(
      `Couldn't create the protection for branch ${branch} on Repo ${repo.name}`
    );
    return false;
  }
}
