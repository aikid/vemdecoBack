interface prompt {
  name: string
  alias: string
  prompt: string
}

interface summarize {
  summary: string
  prescription: string
  certificate: string
}
interface summarize {
  summary: string
  prescription: string
  certificate: string
  json?: string
  error?: string
}

interface ToolUseBlock {
  type: 'tool_use'
  id: string
  name: string
  input: any
}

interface TextBlock {
  type: 'text'
  text: string
}

type ContentBlock = ToolUseBlock | TextBlock

interface completions {
  id: string
  type: string
  role: string
  model: string
  content: ContentBlock[]
  stop_reason: string | null
  stop_sequence: string | null
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export type { prompt, transcribe, completions, summarize, ContentBlock }
