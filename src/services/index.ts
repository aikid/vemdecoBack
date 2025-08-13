import { type AxiosRequestConfig } from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import { unlink } from 'fs/promises'
import repositories from '../repositories'
import Connect from '../util/axios'
import { prompts, defaultPrompt } from '../util/prompts'
import { env } from '../.env'
import { type prompt, type transcribe, type completions, type ContentBlock } from '../config/service-config'
import { summarizeText } from '../util/summarize'
import Anthropic from '@anthropic-ai/sdk'
import { uploadToS3 } from '../util/s3'
import path from 'path'
import TranscriptionRepository from '../repositories/transcription-repository'
import type * as TranscriptionTypes from '../config/transcription-types'
import { get } from 'https'
import { randomUUID } from 'node:crypto'

const MODEL_TRANSCRIPTION: string = 'whisper-1'
const WHISPER_LANGUAGE: string = 'pt'
// const GPT_MODEL: string = 'gpt-3.5-turbo'
// const TEMPERATURE: number = 0.3
const CLAUDE_MODEL: string = 'claude-3-haiku-20240307'

class Services {
  getPrompts(): prompt[] {
    return repositories.getPrompts()
  }

  async transcribeAndSummarize(prompt: string, file: string, mymeType: string): Promise<transcribe> {
    let instructions: string | undefined = prompts.find(row => row.name === prompt)?.prompt

    if (instructions === undefined) {
      instructions = prompts[0].prompt
    }

    instructions = defaultPrompt.replace('[[prompt]]', instructions)
    const fileName = file.split('src/tmp/')[1]
    const filePath = fs.createReadStream(file)

    const formData = new FormData()
    formData.append('file', filePath)
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

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
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

      const result: transcribe = {
        success: true,
        usage: response.usage,
        transcription: responseTranscription.text,
        completion: summarizeText(firstContentBlock.text)
      }

      const createTranscriptionRegister: TranscriptionTypes.createTranscription = {
        customer: prompt,
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
        customer: prompt,
        link,
        expireDate: new Date(Date.now() + 1440 * 60 * 1000),
        data: result
      }

      await TranscriptionRepository.create(createTranscriptionRegister)
      return result
    }
  }

  async getLastTranscriptions(customer: string) {
    return await TranscriptionRepository.getLastTranscriptions(customer)
  }

  async reprocessTranscribe(body: TranscriptionTypes.reprocessTranscribe): Promise<transcribe> {
    let instructions: string | undefined = prompts.find(row => row.name === body.prompt)?.prompt

    if (instructions === undefined) {
      instructions = prompts[0].prompt
    }

    instructions = defaultPrompt.replace('[[prompt]]', instructions)

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

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
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

/*   async transcribeAndSummarize(prompt: string, file: string): Promise<transcribe> {
    let instructions: string | undefined = prompts.find(row => row.name === prompt)?.prompt

    if (instructions === undefined) {
      instructions = prompts[0].prompt
    }

    const formData = new FormData()
    formData.append('file', createReadStream(file))
    formData.append('model', MODEL_TRANSCRIPTION)

    const axiosRequestTranscription: AxiosRequestConfig = {
      method: 'POST',
      url: env.URL_TRANSCRIPTION,
      headers: {
        organization: 'org-ovTkeL0SeZddwuCW4UTe4Jbh'
      },
      data: formData
    }

    const responseTranscription = await Connect.start(axiosRequestTranscription)

    const bodyToCompletions: completions = {
      model: GPT_MODEL,
      temperature: TEMPERATURE,
      n: 1,
      messages: [
        {
          role: 'system',
          content: instructions
        },
        {
          role: 'user',
          content: responseTranscription.text
        }
      ]
    }

    const axiosRequestCompletions: AxiosRequestConfig = {
      method: 'POST',
      url: env.URL_COMPLETIONS,
      data: bodyToCompletions

    }

    const response = await Connect.start(axiosRequestCompletions)

    if (response.choices[0].message.content === undefined) {
      return {
        success: false,
        prompt,
        transcription: responseTranscription.text
      }
    }

    return {
      success: true,
      usage: response.usage,
      transcription: responseTranscription.text,
      completion: summarizeText(response.choices[0].message.content)
    }
  } */
}

export default new Services()
