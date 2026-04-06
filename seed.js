import prisma from './config/prisma.js'

async function main() {
  try {
    // const user = await prisma.user.create({
    //   data: {
    //     name: 'Patience Msumba',
    //     email: 'msumbapatience5@gmail.com',
    //     password: 'iwannanutinyou',
    //     files: {
    //       create: {
    //         name: 'awesomeFile02',
    //       },
    //     },
    //   },
    //   include: {
    //     files: true,
    //   },
    // })

    const allUsers = await prisma.user.findMany({
      include: {
        files: true,
      },
    })

    console.log('ALL USERS', JSON.stringify(allUsers, null, 2))

    await prisma.$disconnect()
  } catch (error) {
    await prisma.$disconnect()
    process.exit(1)
  }
}

main()
