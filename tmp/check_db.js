const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users in DB:', users.length);
    if (users.length > 0) {
      console.log('First user ID:', users[0].id);
    } else {
      console.log('No users found.');
    }
  } catch (e) {
    console.error('Error connecting to DB:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
