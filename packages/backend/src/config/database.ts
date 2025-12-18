import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "./config";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = config.supabase.databaseUrl;
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
