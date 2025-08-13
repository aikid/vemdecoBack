import { z } from 'zod'
import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${environment}`);

dotenv.config({ path: envPath });

const envSchema = z.object({
  PORT: z.string().default('3000'),
  BEARER_TOKEN: z.string(),
  URL_TRANSCRIPTION: z.string(),
  URL_COMPLETIONS: z.string(),
  DB_URL: z.string(),
  DB_USER: z.string(),
  DB_PWD: z.string(),
  SECRET_ADM_KEY: z.string(),
  SECRET_USR_KEY: z.string(),
  ADM_TOKEN: z.string(),
  EMAIL_SENDER: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PWD: z.string(),
  SECRET_UPD_PWD: z.string(),
  ASAAS_TOKEN: z.string(),
  ASAAS_URL_CUSTOMER: z.string(),
  ASAAS_ACCESS_TOKEN: z.string(),
  ASAAS_URL_SUBSCRIPTION: z.string(),
  ASAAS_CALLBACK_URL: z.string(),
  LOG: z.string(),
  IAM_USER_KEY: z.string(),
  IAM_USER_SECRET: z.string()
})

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error(`Invalid environment variables`)
  throw new Error(JSON.stringify(_env.error.format()));
}

const env = _env.data;

export { env };

