import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AIResponse {
  success: boolean
  data?: any
  error?: string
}

export class AIService {
  static async generateTaskSuggestions(userInput: string): Promise<AIResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that helps users create and organize tasks. Generate 3-5 specific, actionable task suggestions based on the user's input. Return them as a JSON array with title, description, priority (LOW, MEDIUM, HIGH), and estimated duration in hours."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      const suggestions = JSON.parse(completion.choices[0].message.content || '[]')
      return { success: true, data: suggestions }
    } catch (error) {
      console.error('AI task suggestion error:', error)
      return { success: false, error: 'Failed to generate task suggestions' }
    }
  }

  static async optimizeTaskDescription(description: string): Promise<AIResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that helps optimize task descriptions. Make the description more clear, actionable, and professional while maintaining the original intent. Keep it concise but informative."
          },
          {
            role: "user",
            content: description
          }
        ],
        temperature: 0.5,
        max_tokens: 200,
      })

      const optimizedDescription = completion.choices[0].message.content
      return { success: true, data: optimizedDescription }
    } catch (error) {
      console.error('AI description optimization error:', error)
      return { success: false, error: 'Failed to optimize description' }
    }
  }

  static async generateTaskSummary(tasks: any[]): Promise<AIResponse> {
    try {
      const taskData = tasks.map(task => ({
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
      }))

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that analyzes task data and provides insights. Generate a brief summary of the user's task management patterns, productivity insights, and suggestions for improvement."
          },
          {
            role: "user",
            content: `Analyze these tasks and provide insights: ${JSON.stringify(taskData)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      })

      const summary = completion.choices[0].message.content
      return { success: true, data: summary }
    } catch (error) {
      console.error('AI summary generation error:', error)
      return { success: false, error: 'Failed to generate summary' }
    }
  }

  static async autoPrioritizeTasks(tasks: any[]): Promise<AIResponse> {
    try {
      const taskData = tasks.map(task => ({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        currentPriority: task.priority
      }))

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that helps prioritize tasks. Analyze the tasks and suggest optimal priority levels (LOW, MEDIUM, HIGH) based on urgency, importance, and due dates. Return the suggestions as a JSON array with taskId and suggestedPriority."
          },
          {
            role: "user",
            content: `Prioritize these tasks: ${JSON.stringify(taskData)}`
          }
        ],
        temperature: 0.5,
        max_tokens: 400,
      })

      const priorities = JSON.parse(completion.choices[0].message.content || '[]')
      return { success: true, data: priorities }
    } catch (error) {
      console.error('AI task prioritization error:', error)
      return { success: false, error: 'Failed to prioritize tasks' }
    }
  }
} 