import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json()
    
    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 })
    }

    const result = await AIService.generateTaskSuggestions(userInput)
    
    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('AI suggestions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 