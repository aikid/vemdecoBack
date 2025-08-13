import { type ZodSchema, type SafeParseReturnType } from 'zod'

const GeneralValidator = <T>(bodySchema: ZodSchema<T>, body: any): T => {
  const _body: SafeParseReturnType<any, T> = bodySchema.safeParse(body)

  if (!_body.success) {
    console.error('Invalid variables')
    throw new Error(JSON.stringify(_body.error.format()))
  }

  return _body.data
}

export default GeneralValidator
