type GitHubClientOptions = {
  token?: string;
  owner: string;
  repo: string;
};

type GitHubIssueResponse = {
  number: number;
  html_url: string;
};

type GitHubRefResponse = {
  ref: string;
  object: {
    sha: string;
  };
};

type GitHubPullRequestResponse = {
  number: number;
  html_url: string;
};

export type CreateIssueInput = {
  title: string;
  body: string;
  labels: string[];
};

export type CreatePullRequestInput = {
  title: string;
  body: string;
  head: string;
  base: string;
  draft: boolean;
};

export class GitHubClient {
  private readonly token: string;
  private readonly owner: string;
  private readonly repo: string;
  private readonly apiBaseUrl = 'https://api.github.com';

  constructor(options: GitHubClientOptions) {
    const token = options.token ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

    if (!token) {
      throw new Error('Missing GITHUB_TOKEN or GH_TOKEN environment variable.');
    }

    this.token = token;
    this.owner = options.owner;
    this.repo = options.repo;
  }

  async createIssue(input: CreateIssueInput) {
    return this.request<GitHubIssueResponse>(`/repos/${this.owner}/${this.repo}/issues`, {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        body: input.body,
        labels: input.labels,
      }),
    });
  }

  async getBranchRef(branchName: string) {
    return this.request<GitHubRefResponse>(
      `/repos/${this.owner}/${this.repo}/git/ref/heads/${encodeURIComponent(branchName)}`
    );
  }

  async createBranch(branchName: string, sha: string) {
    return this.request<GitHubRefResponse>(`/repos/${this.owner}/${this.repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha,
      }),
    });
  }

  async createPullRequest(input: CreatePullRequestInput) {
    return this.request<GitHubPullRequestResponse>(`/repos/${this.owner}/${this.repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        body: input.body,
        head: input.head,
        base: input.base,
        draft: input.draft,
      }),
    });
  }

  private async request<T>(path: string, init: RequestInit = {}) {
    const response = await fetch(`${this.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...init.headers,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub API ${response.status} ${response.statusText}: ${body}`);
    }

    return response.json() as Promise<T>;
  }
}

