import { type Request, type Response, type NextFunction } from 'express'
import { unlink } from 'fs/promises'

import Logger from '../middlewares/winston-logger'
import TranscribeServices from '../services/transcribe-services'
import TranscribeValidator from '../validators/transcribe-validator'
import SubscriptionServices from '../services/subscription-services'
import PromptServices from '../services/prompt-services'
import type * as TranscriptionTypes from '../config/types/transcription-types'

class TranscribeController {
  async transcribe(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params

      if (req.params.active === 'no') {
        return res.status(403).json({ message: 'Your plan has expired or you have reached the contracted limit.' })
      }

      const subscription: any = await SubscriptionServices.find(req.params.id, true)

      if (subscription.consumption >= subscription.planId.limit) {
        return res.status(403).json({ message: 'Your plan has expired or you have reached the contracted limit.' })
      }

      const prompt: any = await PromptServices.getDefaultPrompt(email)
      const file = req.file

      if (file === undefined) {
        throw new Error('Unexpected file format')
      }

      const data = await TranscribeServices.transcribeAndSummarize(prompt, file.path, file.mimetype, email)

      await SubscriptionServices.updateConsumption(req.params.id, req.params.limit)

      await unlink(file.path)

      Logger.captureResult(req, data)

      return res.json(data)
    } catch (e) {
      if (req.file !== undefined) {
        await unlink(req.file.path)
      }
      next(e)
    }
  }

  async summarize (req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params

      if (req.params.active === 'no') {
        return res.status(403).json({ message: 'Your plan has expired or you have reached the contracted limit.' })
      }

      const subscription: any = await SubscriptionServices.find(req.params.id, true)

      if (subscription.consumption >= subscription.planId.limit) {
        return res.status(403).json({ message: 'Your plan has expired or you have reached the contracted limit.' })
      }

      const prompt: any = await PromptServices.getDefaultPrompt(email)

      const body = TranscribeValidator.transcribeSumarize(req.body)

      const data = await TranscribeServices.transcribeSummarize(prompt, body.transcription)

      Logger.captureResult(req, data)

      return res.json(data)
    } catch (e) {
      next(e)
    }
  }

  async getLastTranscriptions (req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params

      if (!email) throw new Error('email is mandatory')

      const data = await TranscribeServices.getLastTranscriptions(email)

      Logger.captureResult(req, data)

      if (data.length === 0) return res.status(204).json()

      return res.json({ transcriptions: data })
    } catch (e) {
      next(e)
    }
  }

  async reprocessTranscribe (req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params

      if (!email) throw new Error('email is mandatory')

      const prompt: any = await PromptServices.getDefaultPrompt(email)

      req.body.prompt = prompt

      const body = TranscribeValidator.reprocessTranscribe(req.body)

      const data = await TranscribeServices.reprocessTranscribe(body as TranscriptionTypes.reprocessTranscribe)

      Logger.captureResult(req, data)

      return res.json(data)
    } catch (e) {
      next(e)
    }
  }
}

export default new TranscribeController()
