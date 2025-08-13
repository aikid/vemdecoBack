import path from 'path'
import { randomUUID } from 'node:crypto'
import multer from 'multer'

const basePath = path.join()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${basePath}/src/tmp`)
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${randomUUID()}.ogg`)
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed: string[] = ['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/webm']
    cb(null, allowed.includes(file.mimetype))
  }
})

export default upload
