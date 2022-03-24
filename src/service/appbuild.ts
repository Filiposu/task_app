import { BuildResponse } from "../models/interfaces";
import { buildStatus, postBuilds, UserCredentials } from "./appcenter";

export const build  = async (creds: UserCredentials,branchName:string,commit:string) : Promise<BuildResponse|undefined> => {
    try {
      const startBuild = await postBuilds(branchName,commit,creds);
      if(startBuild){
        return await new Promise(resolve => {
            const interval = setInterval(() => {   
              buildStatus(branchName,startBuild.buildNumber,creds).then(build=>{
                console.log(`Retrieving build status on ${build.sourceBranch}, status: ${build.status}`);
                if(build.status==="completed"){
                    let logTime : number = (new Date(build.finishTime).getTime() - new Date(build.startTime).getTime())/1000;
                    let logUrl = `https://api.appcenter.ms/v0.1/apps/${creds.owner}/${creds.app}/builds/${build.buildNumber}/logs`;
                    console.log(`${build.sourceBranch} build ${build.result} in ${logTime} seconds. Link to build logs: ${logUrl}`)
                    resolve(build);
                    clearInterval(interval);
                }
              }).catch((error)=>{
                  console.log(`Could not retrieve build info on ${startBuild.sourceBranch} buildNumer: ${startBuild.buildNumber} due to ${error.response}`);
                  return Promise.reject(error);
              });
            }, creds.interval);
          });    
      }
    } catch (error:any) {
       console.log(error)
       return error;
    }
};

