import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb"

import {
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({
  region: "us-east-1",

  endpoint:
    process.env.DYNAMODB_ENDPOINT,

  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID || "test",

    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY ||
      "test",
  },
})

export const dynamodb =
  DynamoDBDocumentClient.from(client)