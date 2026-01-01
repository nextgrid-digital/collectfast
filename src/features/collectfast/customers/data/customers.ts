import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(12345)

export const customers = Array.from({ length: 200 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const totalOutstanding = parseFloat(
    faker.finance.amount({ min: 0, max: 50000, dec: 2 })
  )
  const invoiceCount = faker.number.int({ min: 0, max: 50 })

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
      ? faker.date.recent({ days: 90 })
      : null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})

