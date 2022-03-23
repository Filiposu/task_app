export interface Commit {
  sha: String,
  url: String
}

export interface Branch {
  name : String,
  commit: Commit
}

export interface BranchResponse {
  branch: Branch;
}

export interface BuildParams {
  sourceVersion: String,
  debug:boolean
}

export interface BuildResponse {
  id:number,
  buildNumber:number,
  startTime:Date
  finishTime: Date
  status:String,
  sourceBranch:String,
  result:String
}