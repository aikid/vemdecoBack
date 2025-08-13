import moment from 'moment-timezone'

class DateTime {
  timezone

  constructor() {
    this.timezone = 'America/Sao_Paulo'
  }

  now(format: string) {
    return moment.tz(this.timezone).format(format)
  }

  futureDate(daysToAdd: number, format: string) {
    return moment.tz(this.timezone).add(daysToAdd, 'days').format(format)
  }

  futureDateInMinutes(minutesToAdd: number, format: string) {
    return moment.tz(this.timezone).add(minutesToAdd, 'minutes').format(format)
  }
}

export default new DateTime()
