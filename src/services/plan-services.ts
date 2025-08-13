import type * as PlanTypes from '../config/types/plan-types'

import planRepository from '../repositories/plan-repository'

class PlanServices {
  async createPlan(body: PlanTypes.createPlan) {
    return await planRepository.createPlan(body)
  }

  async listPlans() {
    return await planRepository.listPlans()
  }

  async listActivePlans() {
    return await planRepository.listActivePlans()
  }

  async findPlan(planId: string) {
    return await planRepository.findPlan(planId)
  }

  async findTrialPlan() {
    return await planRepository.findTrialPan()
  }
}

export default new PlanServices()
