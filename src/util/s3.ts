import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '../.env/index'

const BUCKET_NAME = 'uploads.drmobile.com.br'
const expirationInHours = 24

const s3Client = new S3Client({
  credentials: {
    accessKeyId: env.IAM_USER_KEY,
    secretAccessKey: env.IAM_USER_SECRET
  },
  region: 'sa-east-1'
})

async function uploadToS3(fileName: any, fileContent: any, mimeType: string) {
  const uploadParams: any = {
    Bucket: BUCKET_NAME,
    Key: `resumo-rapido/${fileName}`,
    Body: fileContent,
    ContentType: mimeType,
    ACL: 'public-read'
  }

  try {
    await s3Client.send(new PutObjectCommand(uploadParams))

    const signedUrlParams = {
      Bucket: BUCKET_NAME,
      Key: `resumo-rapido/${fileName}`
    }

    const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(signedUrlParams), {
      expiresIn: expirationInHours * 3600
    })

    return signedUrl
  } catch (e: any) {
    console.error('Erro ao fazer upload para o S3:', e.message)
    throw new Error(e.message)
  }
}

export { uploadToS3 }
