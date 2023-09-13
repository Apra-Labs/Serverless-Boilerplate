import { createInterface } from "readline";
import pkg from "shelljs";
const {exec} = pkg;

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const validArguments = ["dev", "staging", "prod"];
const deployType = process.argv[2];

if (!validArguments.includes(deployType)) {
    console.error("Invalid deploy type");
    console.info("Allowed arguments: dev | staging | prod");
    process.exit(0);
}

const validProfileNames = ["serverlessProfile"];
const profileName = process.argv[3] || 'default';

if (!validProfileNames.includes(profileName)) {
    console.error("Invalid profile name");
    console.info("Allowed arguments: serverlessProfile");
    process.exit(0);
}

const getAPIURL = (serverlessOutput) => {
    const urlRegex = /https?:\/\/\S+/g;
    const urls = serverlessOutput.match(urlRegex);
    return urls ? urls[0] : null;
};


const processDeploy = () => {
    exec("tsc");
    console.log("\ntsc done");

    const serverlessCommand = "serverless deploy --stage " + deployType + " --aws-profile " + profileName + " --verbose";
    console.info(serverlessCommand);

    const { stdout, stderr, code } = exec(serverlessCommand);
    if (code !== 0) {
        console.error("Something failed");
        console.error(stderr);
        process.exit(0);
    }
    console.log("\nServerless deployed");
    const API_URL = getAPIURL(stdout);
    console.log("\nAPI URL : " + API_URL);
    if (!API_URL || !API_URL.trim()) {
        console.error("No URL found");
        process.exit(0);
    }

    console.log("\ndeployment done...");
};


rl.question(
    "Enter build stage type to confirm: [dev | staging | prod] :",
    (answer) => {
        console.log(`you have entered: ${answer}`);
        if (answer !== deployType) {
            console.error("\nMismatch in stage type");
            process.exit(0);
        } else {
            rl.question(
                "Enter aws profile name to confirm: [serverlessProfile] : ",
                (answer) => {
                    console.log(`you have entered: ${answer}`);
                    console.log("Deployment initiated...");
                    rl.close();
                    if (answer !== profileName) {
                        console.error("\nMismatch in profile name");
                        process.exit(0);
                    } else {
                        processDeploy();
                    }
                }
            );
        }
    }
);






