import { Octokit } from "@octokit/rest";
import { createBranches } from "./creation";
import { setProtections } from "./rules";
import { Repository } from "./interfaces/repository";

export async function processRepo(context: Octokit, repo: Repository) {
  try {
    const { data: masterCommit } = await context.repos.getCommit({
      owner: repo.owner,
      repo: repo.name,
      ref: "master",
    });
    return (
      (await createBranches(context, repo, masterCommit)) &&
      (await setProtections(context, repo))
    );
  } catch (error) {
    console.log(`Repo ${repo.name} is probably empty! skipping`);
    return false;
  }

  console.log(`Repo "${repo.name}" processed!\n`);
}
