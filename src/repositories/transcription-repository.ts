import transcription from '../models/transcription'
import type * as TranscriptionTypes from '../config/types/transcription-types'

class TranscriptionRepository {
  async create(body: TranscriptionTypes.createTranscription) {
    return await transcription.create(body)
  }

  async getLastTranscriptions(email: string) {
    return await transcription.find({ customer: email })
      .sort({ createdAt: -1 })
      .limit(3)
  }
}

export default new TranscriptionRepository()
