import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';

const ISSUE_NUMBER_REGEX = /[A-Z]{2,}-\d+/;

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
    console.log(commits.data.map(({ commit }) => ISSUE_NUMBER_REGEX.exec(commit.message)?.[0]));
  } catch (error: any) {
    console.table(error);
    setFailed(error?.errorMessages);
  }
})();
