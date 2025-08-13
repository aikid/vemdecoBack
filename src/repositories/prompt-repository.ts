import mongoose from 'mongoose'
import prompt from '../models/prompt'
import type * as PromptTypes from '../config/types/prompt-types'

class PromptRepositories {
  async createPrompt (body: PromptTypes.createPrompt) {
    return await prompt.create(body)
  }

  async getPromptById (id: string) {
    const objectId = new mongoose.Types.ObjectId(id)
    return await prompt.findById(objectId)
  }

  async getUserPrompts (email: string) {
    return await prompt.find({ email })
  }

  async updatePrompt(body: PromptTypes.updatePrompt) {
    const promptToUpdate = await this.getPromptById(body.id)

    if (promptToUpdate === null) {
      return promptToUpdate
    } else {
      promptToUpdate.prompt = body.prompt
      await promptToUpdate.save()

      return promptToUpdate
    }
  }

  async setDefaultPrompt(body: PromptTypes.setDefaultPrompt) {
    const query = {
      email: body.email,
      default: true
    }

    const promptToDisable = await prompt.findOne(query)

    const promptToSetDefault = await this.getPromptById(body.id)

    if (promptToSetDefault === null) return null

    if (promptToDisable !== null) {
      promptToDisable.default = false
      await promptToDisable.save()
    }

    promptToSetDefault.default = true
    await promptToSetDefault.save()

    return promptToSetDefault
  }

  async getDefaultPrompt(email: string) {
    const query = {
      email,
      default: true
    }

    return await prompt.findOne(query)
  }
}

export default new PromptRepositories()
