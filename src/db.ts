import { PrismaClient } from "@prisma/client";
import { userData } from "./types/type";

const prisma = new PrismaClient();

export async function upsertUser(twitterAccount: string, data: Partial<userData>) {
    const user = await prisma.user.upsert({
        where: { twitterAccount },
        update: data, 
        create: { twitterAccount, ...data }, 
    });
    console.log("User upserted:", user);
    return user;
}

export async function getUser(twitterAccount: string): Promise<userData | null> {
    const user:userData = await prisma.user.findUnique({
      where: { twitterAccount },
    });
    console.log("User found:", user);
    return user;
}
