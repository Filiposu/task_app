import { BranchResponse, BuildResponse } from "../models/interfaces";
import { http } from "./http";

export type UserCredentials = {
  owner: string;
  app: string;
  token: string;
  interval?: number;
};

export const postBuilds = async (
  branch: string,
  commit: string,
  creds: UserCredentials
): Promise<BuildResponse> => {
  let url = `https://api.appcenter.ms/v0.1/apps/${creds.owner}/${creds.app}/branches/${branch}/builds`;
  let response = await http.post(url, null, {
    headers: { "X-API-Token": creds.token },
    params: { sourceVersion: commit, debug: true },
  });
  return response.data as BuildResponse;
};

export const getBranches = async (
  creds: UserCredentials
): Promise<BranchResponse[]> => {
  let url = `https://api.appcenter.ms/v0.1/apps/${creds.owner}/${creds.app}/branches`;
  let response = await http.get(url, {
    headers: { "X-API-Token": creds.token },
  });
  return response.data as BranchResponse[];
};

export const buildStatus = async (
  branch: string,
  buildNumber: number,
  creds: UserCredentials
): Promise<BuildResponse> => {
  let url = `https://api.appcenter.ms/v0.1/apps/${creds.owner}/${creds.app}/builds/${buildNumber}`;
  let response = await http.get(url, {
    headers: { "X-API-Token": creds.token },
  });
  return response.data as BuildResponse;
};
