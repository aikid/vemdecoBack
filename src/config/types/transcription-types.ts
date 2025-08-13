interface createTranscription {
  customer: string
  link: string
  expireDate: Date
  data: any
}

interface reprocessTranscribe {
  prompt: string
  link: string
}

export type { createTranscription, reprocessTranscribe }
