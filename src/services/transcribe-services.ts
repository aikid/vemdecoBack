import { AnthropicBedrock } from '@anthropic-ai/bedrock-sdk'
import path from 'path'
import fs from 'fs'
import { unlink } from 'fs/promises'
import { get } from 'https'
import { randomUUID } from 'node:crypto'

import { type AxiosRequestConfig } from 'axios'
import FormData from 'form-data'
import Connect from '../util/axios'
import { defaultPrompt } from '../util/prompts'
import { env } from '../.env'
import { type transcribe, type completions, type ContentBlock } from '../config/service-config'
import { summarizeText } from '../util/summarize'
import TranscriptionRepository from '../repositories/transcription-repository'
import type * as TranscriptionTypes from '../config/types/transcription-types'
import { uploadToS3 } from '../util/s3'

const MODEL_TRANSCRIPTION: string = 'whisper-1'
const WHISPER_LANGUAGE: string = 'pt'
const CLAUDE_MODEL: string = 'anthropic.claude-3-sonnet-20240229-v1:0'
class TranscribeServices {
  async transcribeAndSummarize(prompt: string, file: string, mymeType: string, email: string): Promise<transcribe> {
    const instructions = defaultPrompt.replace('[[prompt]]', prompt)

    const fileName = file.split('src/tmp/')[1]

    const formData = new FormData()
    formData.append('file', fs.createReadStream(file))
    formData.append('model', MODEL_TRANSCRIPTION)
    formData.append('language', WHISPER_LANGUAGE)

    const axiosRequestTranscription: AxiosRequestConfig = {
      method: 'POST',
      url: env.URL_TRANSCRIPTION,
      headers: {
        organization: 'org-ovTkeL0SeZddwuCW4UTe4Jbh'
      },
      data: formData
    }

    const responseTranscription = await Connect.start(axiosRequestTranscription)

    const anthropic = new AnthropicBedrock({
      awsRegion: 'sa-east-1',
      awsAccessKey: 'AKIA3DEM4UZZEIVRKIUV',
      awsSecretKey: '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'
    })

    const response: completions = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      temperature: 1,
      system: instructions,
      messages: [
        { role: 'user', content: responseTranscription.text }
      ]
    })

    const firstContentBlock: ContentBlock = response.content[0]

    if (firstContentBlock && firstContentBlock.type === 'text') {
      const link = await this.uploadS3(fileName, mymeType)

      const result = {
        success: true,
        usage: response.usage,
        transcription: responseTranscription.text,
        completion: summarizeText(firstContentBlock.text)
      }

      const createTranscriptionRegister: TranscriptionTypes.createTranscription = {
        customer: email,
        link,
        expireDate: new Date(Date.now() + 1440 * 60 * 1000),
        data: result
      }

      await TranscriptionRepository.create(createTranscriptionRegister)

      return result
    } else {
      const link = await this.uploadS3(fileName, mymeType)

      const result: transcribe = {
        success: false,
        prompt,
        transcription: responseTranscription.text
      }

      const createTranscriptionRegister: TranscriptionTypes.createTranscription = {
        customer: email,
        link,
        expireDate: new Date(Date.now() + 1440 * 60 * 1000),
        data: result
      }

      await TranscriptionRepository.create(createTranscriptionRegister)

      return result
    }
  }

  async getLastTranscriptions(email: string) {
    return await TranscriptionRepository.getLastTranscriptions(email)
  }

  async reprocessTranscribe(body: TranscriptionTypes.reprocessTranscribe): Promise<transcribe> {
    const instructions = defaultPrompt.replace('[[prompt]]', body.prompt)

    const filePath = await this.downloadAudio(body.link)

    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath))
    formData.append('model', MODEL_TRANSCRIPTION)
    formData.append('language', WHISPER_LANGUAGE)

    const axiosRequestTranscription: AxiosRequestConfig = {
      method: 'POST',
      url: env.URL_TRANSCRIPTION,
      headers: {
        organization: 'org-ovTkeL0SeZddwuCW4UTe4Jbh'
      },
      data: formData

    }

    const responseTranscription = await Connect.start(axiosRequestTranscription)

    await unlink(filePath)

    const anthropic = new AnthropicBedrock({
      awsRegion: 'sa-east-1',
      awsAccessKey: 'AKIA3DEM4UZZEIVRKIUV',
      awsSecretKey: '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'
    })

    const response: completions = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      temperature: 1,
      system: instructions,
      messages: [
        { role: 'user', content: responseTranscription.text }
      ]
    })

    const firstContentBlock: ContentBlock = response.content[0]

    if (firstContentBlock && firstContentBlock.type === 'text') {
      return {
        success: true,
        usage: response.usage,
        transcription: responseTranscription.text,
        completion: summarizeText(firstContentBlock.text)
      }
    } else {
      return {
        success: false,
        prompt: body.prompt,
        transcription: responseTranscription.text
      }
    }
  }

  async transcribeSummarize(prompt: string, transcription: string): Promise<transcribe> {
    const instructions = defaultPrompt.replace('[[prompt]]', prompt)

    const anthropic = new AnthropicBedrock({
      awsRegion: 'sa-east-1',
      awsAccessKey: 'AKIA3DEM4UZZEIVRKIUV',
      awsSecretKey: 'oTbJYCA4Y2YMhs4Duzu5cS2xvbm1COnYiSjK6R9L'
    })

    const response: completions = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      temperature: 1,
      system: instructions,
      messages: [
        { role: 'user', content: transcription }
      ]
    })
    const firstContentBlock: ContentBlock = response.content[0]

    if (firstContentBlock && firstContentBlock.type === 'text') {
      return {
        success: true,
        usage: response.usage,
        transcription,
        completion: summarizeText(firstContentBlock.text)
      }
    } else {
      return {
        success: false,
        prompt,
        transcription
      }
    }
  }

  async uploadS3(fileName: string, mymeType: string) {
    const filePath = path.join(process.cwd(), 'src', 'tmp', fileName)
    const readStream = fs.createReadStream(filePath)
    const s3return = await uploadToS3(fileName, readStream, mymeType)
    return s3return
  }

  async downloadAudio(url: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, `${randomUUID()}.ogg`)
      const file = fs.createWriteStream(filePath)
      get(url, (response: { pipe: (arg0: fs.WriteStream) => void }) => {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve(filePath)
        })
      }).on('error', (err: any) => {
        fs.unlink(filePath, () => { reject(err) })
      })
    })
  }
}

export default new TranscribeServices()
