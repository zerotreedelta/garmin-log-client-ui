export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "us-east-1",
      BUCKET: "training-servrerless-app-file-upload"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://2d3evfkybh.execute-api.us-east-1.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-west-2",
      USER_POOL_ID: "us-west-2_TslO9ktcc",
      APP_CLIENT_ID: "4qpv0p7ojqsf62h7b8tqfq590b",
      IDENTITY_POOL_ID: "us-west-2:e31263bd-ff33-4387-9e1b-6c5e47073c98"
    }
  };