import plan from '../models/plan'

import type * as PlanTypes from '../config/types/plan-types'

class PlanRepositories {
  async createPlan(body: PlanTypes.createPlan) {
    return await plan.create(body)
  }

  async listPlans() {
    return await plan.find()
  }

  async listActivePlans() {
    return await plan.find({ active: true })
  }

  async findPlan(plainId: string) {
    return await plan.findOne({ _id: plainId })
  }

  async findTrialPan() {
    return await plan.findOne({ isTrial: true, active: true })
  }
}

export default new PlanRepositories()
