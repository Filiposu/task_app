export interface Commit {
  sha: string;
  url: string;
}

export interface Branch {
  name: string;
  commit: Commit;
}

export interface BranchResponse {
  branch: Branch;
}

export interface BuildParams {
  sourceVersion: String;
  debug: boolean;
}

export interface BuildResponse {
  id: number;
  buildNumber: number;
  startTime: Date;
  finishTime: Date;
  status: String;
  sourceBranch: String;
  result: String;
}
