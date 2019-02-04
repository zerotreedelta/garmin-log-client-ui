'use strict'

const AWS = require('aws-sdk')
const fs = require('fs')
const ENV_PROFILE = process.env.NODE_ENV
const SSM_ENV_PATH = getEnvPath(process.env.NODE_ENV)

function getEnvPath(environment) {

    let envPath;

    switch(process.env.NODE_ENV) {
        case "production":
            envPath = "prod";
            break;
        case "development":
            envPath = "dev";
            break;
        case "test":
            envPath = "test";
            break;
        default:
            envPath = "dev";
    }

    return envPath;
}

// initializes the .env file for use with react... these values can be overridden with
// .env.<environment>.local
fs.writeFile(`.env.${ENV_PROFILE}`, `REACT_APP_ENV=${ENV_PROFILE}\n`, (err) => {
    if (err) {
        console.log(err, err.stack)
    }
})

console.log(`setting up .env for ${ENV_PROFILE}`)

// TODO: for future to allow for multi region deploy, have a regions enabled var/placeholder
// map the backend hooks to REACT_APP variables that are set at build time as react-scripts build
// removes all non REACT_APP_* from process.env within react code
let envVarMap = [
    {ssmName: "/garmin-log-client-svc/AWSServiceRegion/", envVar: "REACT_APP_S3_REGION"},
    {ssmName: "/garmin-log-client-svc/AWSServiceRegion/", envVar: "REACT_APP_COGNITO_REGION"},
    {ssmName: "/garmin-log-client-svc/AWSServiceRegion/", envVar: "REACT_APP_GWY_REGION"},
    {ssmName: "/garmin-log-client-svc/FileUploadBucketName/", envVar: "REACT_APP_S3_UPLOAD_BUCKET"},
    {ssmName: "/garmin-log-client-svc/ServiceEndpoint/", envVar: "REACT_APP_GWY_URL"},
    {ssmName: "/garmin-log-client-svc/UserPoolClientId/", envVar: "REACT_APP_COGNITO_CLIENT_ID"},
    {ssmName: "/garmin-log-client-svc/UserPoolId/", envVar: "REACT_APP_USER_POOL_ID"},
    {ssmName: "/garmin-log-client-svc/IdentityPoolId/", envVar: "REACT_APP_IDENTITY_POOL_ID"},
]

const ssm = new AWS.SSM({ region: process.env.AWS_REGION, apiVersion: '2014-11-06' });

envVarMap.forEach(varEntry => {
    ssm.getParameter({Name: `${varEntry.ssmName}${SSM_ENV_PATH}`, WithDecryption: false}, (err, resp) => {
        if (err) {
            console.log(`Error getting parms for ${varEntry.ssmName}`)
        } else {
            console.log(`react app env value for ${varEntry.ssmName} is ${resp.Parameter.Value}`)
            fs.appendFile(`.env.${ENV_PROFILE}`, `${varEntry.envVar}=${resp.Parameter.Value}\n`, (err) => {
                if (err) {
                    console.log("unable to write to .env file")
                    //console.log(err, err.stack)
                }
            })                
        }
    })
})



