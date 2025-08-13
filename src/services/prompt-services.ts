import validator from 'validator'

import promptRepository from '../repositories/prompt-repository'
import type * as PromptTypes from '../config/types/prompt-types'
import { standardGuide } from '../util/prompts'

class PromptServices {
  async createPrompt(body: PromptTypes.createPrompt) {
    const isEmail = validator.isEmail(body.email)
    if (!isEmail) {
      throw new Error('Insira um email válido.')
    }

    await promptRepository.createPrompt(body)
  }

  async getPromptById(id: string) {
    const response = await promptRepository.getPromptById(id)
    return response
  }

  async getUserPrompts(email: string) {
    const response = await promptRepository.getUserPrompts(email)
    return response
  }

  async updatePrompt(body: PromptTypes.updatePrompt) {
    const response = await promptRepository.updatePrompt(body)
    return response
  }

  async setDefaultPrompt(body: PromptTypes.setDefaultPrompt) {
    const response = await promptRepository.setDefaultPrompt(body)
    return response
  }

  async getDefaultPrompt(email: string) {
    const response = await promptRepository.getDefaultPrompt(email)
    return response !== null && response.prompt !== undefined ? response.prompt : standardGuide.prompt
  }
}

export default new PromptServices()
