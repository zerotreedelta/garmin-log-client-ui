export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "my-region",
      BUCKET: "bucket-for-files"
    },
    apiGateway: {
      REGION: "my-region",
      URL: "my-api-gateway"
    },
    cognito: {
      REGION: "my-region",
      USER_POOL_ID: "my-pool-id",
      APP_CLIENT_ID: "my-app-id",
      IDENTITY_POOL_ID: "my-identity-pool-id:"
    }
  };