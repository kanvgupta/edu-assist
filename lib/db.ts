import { PrismaClient } from "@prisma/client";

// Declare a global variable to hold the Prisma Client instance in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Instantiate PrismaClient
// Check if we are in production or if the global prisma instance doesn't exist
const prisma =
  globalThis.prisma ||
  new PrismaClient({
    // Optional: Add logging configuration if needed during development
    // log: ['query', 'info', 'warn', 'error'],
  });

// In development, assign the prisma instance to the global variable
// This prevents creating multiple instances due to hot reloading
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Export the prisma client instance
export default prisma;
