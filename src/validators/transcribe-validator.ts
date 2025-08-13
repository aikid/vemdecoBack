import { z } from 'zod'

import type * as TranscriptionTypes from '../config/types/transcription-types'

class TranscribeValidator {
  transcribeSumarize(body: TranscriptionTypes.createTranscription) {
    const bodySchema = z.object({
      transcription: z.string()
    })

    const _body = bodySchema.safeParse(body)

    if (!_body.success) {
      console.error('Invalid variables')
      throw new Error(JSON.stringify(_body.error.format()))
    }

    return _body.data
  }

  reprocessTranscribe(body: TranscriptionTypes.reprocessTranscribe) {
    const bodySchema = z.object({
      prompt: z.string(),
      link: z.string()
    })

    const _body = bodySchema.safeParse(body)

    if (!_body.success) {
      console.error('Invalid variables')
      throw new Error(JSON.stringify(_body.error.format()))
    }

    return _body.data
  }
}

export default new TranscribeValidator()
