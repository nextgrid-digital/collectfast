import { faker } from '@faker-js/faker'
import { type Customer } from '@/features/collectfast/customers/data/schema'

// Set a fixed seed for consistent data generation
faker.seed(11111)

export const techstartCustomers: Customer[] = Array.from({ length: 15 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const totalOutstanding = parseFloat(
    faker.finance.amount({ min: 0, max: 25000, dec: 2 })
  )
  const invoiceCount = faker.number.int({ min: 1, max: 12 })

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: faker.phone.number(),
    totalOutstanding,
    invoiceCount,
    status: faker.helpers.arrayElement([
      'active',
      'inactive',
      'overdue',
      'on-hold',
    ] as const),
    lastPaymentDate: faker.datatype.boolean({ probability: 0.7 })
      ? faker.date.recent({ days: 60 })
      : null,
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent(),
  }
})

