**Build pipeline for appcenter ms apps **

In order to run this app, node.js should be installed on the machine. 

After installing node run `npm install -g typescript` to install typescript globally. 

Run `npm install` and `npm run build` to install dependencies and build app

After that run `node .\dist\node.js ` with following arguments : 
* --owner ( Owner of the app )
* --app (Name of the app)
* --key (Api key which is required for authorization)
* --interval (Interval between requests for build status. Default is 10 seconds )

Final command should like like this `node .\dist\node.js --owner togrul125-gmail.com --app React --key sampleKey --interval 10000`