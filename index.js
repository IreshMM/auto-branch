/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {

  app.on('repository.created', async context => {
    if(!(await branchExists(context, 'master'))) return;
    await createBranches(context);
    await updateBranchProtections(context);
  })

  async function updateBranchProtections(context) {
    await protectBranch(context, 'master');
    await protectBranch(context, 'dev_protected');
    await protectBranch(context, 'sit_protected');
  }

  async function protectBranch(context, branch) {
    if(!(await branchExists(context, branch))) return;
    const owner = await repoOwnerOf(context);
    const repo = await repoNameOf(context);
    const required_status_checks = null;
    const enforce_admins = null;
    const required_pull_request_reviews = {
      required_approving_review_count: 1
    };
    const restrictions = {
      teams: [],
      users: [
        "ireshmm"
      ]
    }

    const params = {
      owner,
      repo,
      branch,
      required_status_checks,
      enforce_admins,
      required_pull_request_reviews,
      restrictions,
      mediaType : {
        previews: ["luke-cage-preview"]
      }
    };

    await context.github.repos.updateBranchProtection(params);
  }

  async function getMasterBranchSha(context) {
    return (await getRef(context, 'master')).object.sha;
  }

  async function getRef(context, refName) {
    const owner = await repoOwnerOf(context);
    const repo =  await repoNameOf(context);
    const ref = `heads/${refName}`

    const params = {
      owner,
      repo,
      ref
    };

    try {
      return (await context.github.git.getRef(params)).data;
    } catch (e) {
      return false;
    }
  }

  async function createBranches(context) {
    masterSha = await getMasterBranchSha(context);

    await createBranch(context, masterSha, 'dev_protected');
    await createBranch(context, masterSha, 'sit_protected');
  }

  async function createBranch(context, masterSha, branchName) {
    if (await branchExists(context, branchName)) return;

    const params = {
      owner: await repoOwnerOf(context),
      repo: await repoNameOf(context),
      ref: `refs/heads/${branchName}`,
      sha: masterSha
    };

    await context.github.git.createRef(params);

  }

  // Helper functions
  async function branchExists(context, branchName) {
    return (await getRef(context, branchName)) ? true : false;
  }

  async function repoNameOf(context) {
    return context.payload.repository.name;
  }

  async function repoOwnerOf(context) {
    return context.payload.repository.owner.login;
  }
}