import { PrismaClient } from '@prisma/client'
import * as fake from 'faker'
const prisma = new PrismaClient({})

async function main() {
  // let count = 0
  // while (count < 20) {
  //   await prisma.user.create({
  //     data: {
  //       email: fake.internet.email(),
  //       firstName: fake.name.firstName(),
  //       lastName: fake.name.lastName(),
  //       password: fake.internet.password(),
  //       role: 'USER',
  //       resetPasswordToken: '',
  //       resetPasswordExpiry: null,
  //       validateEmailToken: '',
  //       isEmailValidated: true,
  //     },
  //   })
  //   // TODO finish seed script for testing
  //   // await prisma.businessProfile.create({})
  //   // await prisma.offering.create({})
  //   // await prisma.transaction.create({})
  //   // await prisma.offeringCategory.create({})
  //   count++
  // }
  // const allUsers = await prisma.user.findMany()
  // console.log(allUsers)

  // const categories = ['product', 'service', 'experience']

  // categories.map(async (category) => {
  //   await prisma.offeringCategory.create({
  //     data: {
  //       category: category,
  //     },
  //   })
  // })
  const data = await prisma.inviteCode.create({
    data: {
      code: 'RESOURCEGUEST',
    },
  })

  console.log(await prisma.inviteCode.findMany())
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
