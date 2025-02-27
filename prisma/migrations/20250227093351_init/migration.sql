-- CreateTable
CREATE TABLE "User" (
    "twitterAccount" TEXT NOT NULL,
    "lastSeenTime" TIMESTAMP(3),
    "walletId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("twitterAccount")
);
