type planType = 'prepaid' | 'billed'

interface createPlan {
  name: string
  isTrial?: boolean
  value: string
  limit: number
  type: planType
  active: boolean
  userId: string
  userName: string
}

interface updatePlan {
  id: string
  name?: string
  gatewayId?: string
  value?: string
  active?: boolean
}

export type { createPlan, updatePlan }
