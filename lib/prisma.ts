import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../lib/generated/prisma/client";

const url = new URL(process.env.DATABASE_URL!);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    connectTimeout: 30000,
    connectionLimit: 1,
    ssl: {
        rejectUnauthorized: process.env.APP_ENV == 'production' ? true : false, // TiDB Cloud requires SSL
    }
});

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;