import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json()
    
    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    }

    const result = await AIService.optimizeTaskDescription(description)
    
    if (result.success) {
      return NextResponse.json({ optimizedDescription: result.data })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('AI optimization error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 