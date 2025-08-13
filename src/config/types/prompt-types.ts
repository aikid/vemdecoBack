interface createPrompt {
  prompt: string
  category: string
  email: string
  subscriptionId: string
  default: boolean
}

interface updatePrompt {
  id: string
  prompt: string
}

interface setDefaultPrompt {
  id: string
  email: string
}

export type { createPrompt, updatePrompt, setDefaultPrompt }
