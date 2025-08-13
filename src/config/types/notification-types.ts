interface createNotification {
  ownerId: string
  userId: string
  notificationType: string
  active: boolean
  data: object
}

interface updateNotification {
  id: string
  active: boolean
}

export type { createNotification, updateNotification }
