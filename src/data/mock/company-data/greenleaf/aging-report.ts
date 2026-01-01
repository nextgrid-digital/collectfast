import { faker } from '@faker-js/faker'
import { type AgingReportRow } from '@/features/collectfast/aging-report/data/schema'

// Set a fixed seed for consistent data generation
faker.seed(88888)

export const greenleafAgingReport: AgingReportRow[] = Array.from(
  { length: 6 },
  () => {
    const customer = `${faker.person.firstName()} ${faker.person.lastName()}`
    const bucket1_30 = parseFloat(
      faker.finance.amount({ min: 0, max: 3000, dec: 2 })
    )
    const bucket31_60 = parseFloat(
      faker.finance.amount({ min: 0, max: 2000, dec: 2 })
    )
    const bucket61_90 = parseFloat(
      faker.finance.amount({ min: 0, max: 1500, dec: 2 })
    )
    const bucket90Plus = parseFloat(
      faker.finance.amount({ min: 0, max: 1000, dec: 2 })
    )

    const outstanding = bucket1_30 + bucket31_60 + bucket61_90 + bucket90Plus

    return {
      id: faker.string.uuid(),
      customer,
      bucket_1_30: bucket1_30,
      bucket_31_60: bucket31_60,
      bucket_61_90: bucket61_90,
      bucket_90_plus: bucket90Plus,
      outstanding,
    }
  }
)

