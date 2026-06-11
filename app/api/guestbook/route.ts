import { NextResponse } from "next/server"

import {
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb"

import { dynamodb } from "@/lib/dynamodb"

export async function POST(
  request: Request
) {
  try {
    const { name, message } =
      await request.json()

    const entry = {
      entryId: crypto.randomUUID(),
      name,
      message,
      createdAt: Date.now(),
    }

    await dynamodb.send(
      new PutCommand({
        TableName:
          "GuestbookEntries",
        Item: entry,
      })
    )

    return NextResponse.json(
      entry
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          "Failed to create entry",
      },
      {
        status: 500,
      }
    )
  }
}

export async function GET() {
  try {
    const result =
      await dynamodb.send(
        new ScanCommand({
          TableName:
            "GuestbookEntries",
        })
      )

    return NextResponse.json(
      result.Items || []
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          "Failed to fetch entries",
      },
      {
        status: 500,
      }
    )
  }
}