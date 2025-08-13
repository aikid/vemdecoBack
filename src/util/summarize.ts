import { jsonrepair } from 'jsonrepair'
import { type summarize } from '../config/service-config'

const normalizeText = (text: string): string => {
  return text.trim()
}

const parseOrRepairJson = (text: string): any => {
  try {
    return JSON.parse(text)
  } catch {
    try {
      const repairedJson = jsonrepair(text)
      return JSON.parse(repairedJson)
    } catch (e: any) {
      throw new Error('Falha ao reparar ou parsear o JSON: ' + e.message)
    }
  }
}

const summarizeText = (text: string): summarize => {
  const response: summarize = {
    summary: 'Informação não disponível na transcrição da consulta.',
    prescription: 'Informação não disponível na transcrição da consulta.',
    certificate: 'Informação não disponível na transcrição da consulta.',
    json: text,
    error: 'Não ocorreram erros.'
  }

  try {
    const obj = parseOrRepairJson(text)

    if (obj.resumo) { response.summary = normalizeText(obj.resumo) }
    if (obj.prescricao) { response.prescription = normalizeText(obj.prescricao) }
    if (obj.atestado) { response.certificate = normalizeText(obj.atestado) }
  } catch (e: any) {
    response.summary = 'Transcrição insuficiente para processar a informação ou falha no processamento.'
    response.prescription = 'Transcrição insuficiente para processar a informação ou falha no processamento.'
    response.certificate = 'Transcrição insuficiente para processar a informação ou falha no processamento.'
    response.error = e.message
  }

  return response
}

export { summarizeText }
