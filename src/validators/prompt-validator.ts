import { z } from 'zod'

import type * as PromptTypes from '../config/types/prompt-types'
import GeneralValidator from './general'

class PromptValidator {
  createPrompt(body: PromptTypes.createPrompt) {
    const bodySchema = z.object({
      prompt: z.string().min(100, { message: 'The prompt cannot be created, please enter more complex prompts.' }),
      category: z.enum(['health']).default('health')
    })

    return GeneralValidator(bodySchema, body)
  }

  updatePrompt(body: PromptTypes.updatePrompt) {
    const bodySchema = z.object({
      id: z.string(),
      prompt: z.string().min(100, { message: 'The prompt cannot be updated, please enter more complex prompts.' })
    })

    return GeneralValidator(bodySchema, body)
  }

  setDefaultPrompt(body: PromptTypes.setDefaultPrompt) {
    const bodySchema = z.object({
      id: z.string(),
      email: z.string().email()
    })

    return GeneralValidator(bodySchema, body)
  }
}

export default new PromptValidator()
