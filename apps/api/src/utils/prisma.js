import { PrismaClient } from '@prisma/client';

// Singleton pattern pour Prisma Client
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // En développement, utiliser une instance globale pour éviter les reconnexions
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

export default prisma;