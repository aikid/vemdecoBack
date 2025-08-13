import { type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'
import type * as PromptTypes from '../config/types/prompt-types'
import PromptValidator from '../validators/prompt-validator'
import PromptServices from '../services/prompt-services'

class PromptController {
  async createPrompt(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.params.active !== 'yes') throw new Error('Only active accounts can create prompts')

      const body: PromptTypes.createPrompt = {
        prompt: req.body.prompt,
        email: req.params.email,
        subscriptionId: req.params.subscriptionId,
        category: 'health',
        default: false
      }

      PromptValidator.createPrompt(body)

      await PromptServices.createPrompt(body)

      const response = { message: 'Prompt created successfully' }

      Logger.captureResult(req, response)

      return res.json(response)
    } catch (e) {
      next(e)
    }
  }

  async getUserPrompts(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params

      const prompts = await PromptServices.getUserPrompts(email)

      if (prompts.length === 0) return res.status(204).json()

      Logger.captureResult(req, prompts)

      return res.json(prompts)
    } catch (e) {
      next(e)
    }
  }

  async updatePrompt(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.params.active !== 'yes') throw new Error('Only active accounts can create prompts')

      const body: PromptTypes.updatePrompt = {
        id: req.body.id,
        prompt: req.body.prompt
      }

      PromptValidator.updatePrompt(body)

      const response = await PromptServices.updatePrompt(body)

      if (response === null) throw new Error('Prompt not found')

      const responseMessage = { message: 'Prompt updated successfully' }

      Logger.captureResult(req, responseMessage)

      return res.json(responseMessage)
    } catch (e) {
      next(e)
    }
  }

  async setDefaultPrompt(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.params.active !== 'yes') throw new Error('Only active accounts can create prompts')

      const body: PromptTypes.setDefaultPrompt = {
        id: req.body.id,
        email: req.params.email
      }

      PromptValidator.setDefaultPrompt(body)

      const response = await PromptServices.setDefaultPrompt(body)

      if (response === null) throw new Error('Prompt not found')

      Logger.captureResult(req, response)

      return res.json(response)
    } catch (e) {
      next(e)
    }
  }
}

export default new PromptController()
