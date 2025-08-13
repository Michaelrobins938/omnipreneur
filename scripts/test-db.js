const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
console.log('DB=', process.env.DATABASE_URL);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const rows = await prisma.('SELECT 1');
    console.log('db ok', rows);
  } catch (e) {
    console.error('db error', e.message || e);
  } finally {
    await prisma.();
  }
})();
