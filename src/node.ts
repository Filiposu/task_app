import { BuildResponse } from "./models/interfaces";
import * as yargs from "yargs";
import { getBranches, UserCredentials } from "./service/appcenter";
import { build } from "./service/appbuild";

const parser = yargs.options({
  owner: {
    alias: "ow",
    demandOption: true,
    description: "Owner name",
  },
  app: {
    alias: "a",
    demandOption: true,
    description: "App name",
  },
  key: {
    alias: "k",
    description: "Api key",
    demandOption: true,
  },
  interval: {
    alias: "i",
    description: "Interval between requests for build status",
    default: 10000,
  },
});

(async () => {
  const argv: any = await parser.argv;
  const creds: UserCredentials = {
    owner: argv.owner,
    token: argv.key,
    app: argv.app,
    interval: argv.interval,
  };

  let branches: Array<Promise<BuildResponse | undefined>> = [];
  let branchReponse = await getBranches(creds);
  branchReponse.forEach((b) => {
    if (b.branch != null) {
      let built = build(creds, b.branch.name, b.branch.commit.sha);
      branches.push(built);
    }
  });
})();
