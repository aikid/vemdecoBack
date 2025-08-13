import { Router, type Request, type Response, type NextFunction } from 'express'

import Logger from '../middlewares/winston-logger'
import TranscribeController from '../controllers/transcribe-controller'
import upload from '../util/multer'
import Private from '../middlewares/private'

const transcribeRoutes = Router()

transcribeRoutes.use(Logger.preHandler)

transcribeRoutes.post('/transcribe-and-summarize', Private.user, upload.single('audio'), TranscribeController.transcribe)

transcribeRoutes.post('/summarize-transcription', Private.user, TranscribeController.summarize)

transcribeRoutes.get('/get-last-transcriptions', Private.user, TranscribeController.getLastTranscriptions)

transcribeRoutes.post('/reprocess-transcribe', Private.user, TranscribeController.reprocessTranscribe)

transcribeRoutes.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  try {
    const message = JSON.parse(err.message)
    return res.status(400).json({
      status: 400,
      message
    })
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: err.message
    })
  }
})

export default transcribeRoutes
