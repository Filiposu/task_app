import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { BranchResponse, BuildResponse } from "./models/interfaces";
import * as yargs from 'yargs';

const parser = yargs.options({
    owner: {
        alias: 'ow',
        demandOption: true,
        description: 'Owner name'
    },
    app: {
        alias: 'a',
        demandOption: true,
        description: 'App name'
    },
    key: {
      alias: 'k',
      description: 'Api key',
      demandOption: true
  }
  });

const url: String  = "https://api.appcenter.ms/v0.1/apps/";

(async() => {

  const argv : any = await parser.argv;
  const owner_name =  argv.owner;
  const token = argv.key;
  const app_name = argv.app;
  const url: String  = "https://api.appcenter.ms/v0.1/apps/";
  const branchRequest = url.concat(owner_name+"/").concat(app_name+"/").concat("branches");
  let branches : Array<Promise<BuildResponse|undefined>> = [];

  
  const build  = async (appName:String,branchName:String,commit:String) : Promise<BuildResponse|undefined> => {
    let buildPost = `https://api.appcenter.ms/v0.1/apps/${owner_name}/${appName}/branches/${branchName}/builds`;
    try {
      const totalItems = await axios({url:buildPost,headers: {'X-API-Token': token},method:"POST",params:{sourceVersion:commit,debug:true}});
      var buildStatus = totalItems.data as BuildResponse;
      let buildStatusUrl = `https://api.appcenter.ms/v0.1/apps/togrul125-gmail.com/React/builds/${buildStatus.buildNumber}`;  
      return await new Promise(resolve => {
        const interval = setInterval(() => {          
          axios.get<BuildResponse>(buildStatusUrl,{headers:{'X-API-Token': token}}).then((data)=>{
            console.log(`Retrieving build status on ${buildStatus.sourceBranch}, status: ${data.data.status} `)
            if(data.data.status === "completed"){
              resolve(data.data);
              clearInterval(interval);
            }
          }).catch(error=>{
            console.log(error);
          });
        }, 10000);
      });    
    } catch (error:any) {
       return error;
    }
  };

  axios({
    method:"GET",
    headers: {'X-API-Token': token},
    url:branchRequest
  }).then(res=>{
     res.data.forEach((item:BranchResponse)=>{      
          let built = build(app_name,item.branch.name,item.branch.commit.sha);
          branches.push(built);
    })
    Promise.all(branches).then(function (results) {
      results.forEach(element=>{
          if(element != undefined){
            let logTime : number = (new Date(element.finishTime).getTime() - new Date(element.startTime).getTime())/1000;
            let logUrl = `https://api.appcenter.ms/v0.1/apps/${owner_name}/${app_name}/builds/${element.buildNumber}/logs`;
            console.log(`${element.sourceBranch} build ${element.result} in ${logTime} seconds. Link to build logs: ${logUrl}`)
          }        
      })
    });
  });  
  
})();












