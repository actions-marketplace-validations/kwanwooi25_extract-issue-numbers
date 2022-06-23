import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';

(async () => {
  try {
    const githubToken = getInput('githubToken', { required: true });
    const octokit = getOctokit(githubToken);
    const payload = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: Number(context.payload.pull_request?.number),
    };
    const commits = await octokit.rest.pulls.listCommits({ ...payload, per_page: 100 });
    console.log(commits);
  } catch (error: any) {
    console.table(error);
    setFailed(error?.errorMessages);
  }
})();
