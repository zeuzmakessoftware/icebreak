import { NextRequest, NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'

const apiKey = process.env.PINECONE_API_KEY as string
const indexName = process.env.PINECONE_INDEX_NAME as string
const indexHost = process.env.PINECONE_INDEX_HOST as string

if (!apiKey || !indexName || !indexHost) {
  throw new Error(
    'Missing Pinecone configuration. Please set PINECONE_API_KEY, PINECONE_INDEX_NAME, and PINECONE_INDEX_HOST in environment.'
  )
}

const pineconeClient = new Pinecone({ apiKey })

const namespace = pineconeClient
  .index(indexName, indexHost)
  .namespace('q-and-a-knowledge-base')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const kAmount = Number(searchParams.get('kAmount'))
    const queryText = searchParams.get('q') ?? ''

    const response = await namespace.searchRecords({
      query: {
        topK: kAmount,
        inputs: { text: queryText },
      },
      fields: ['answer', 'question', 'person'],
    })

    return NextResponse.json({ success: true, data: response })
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}