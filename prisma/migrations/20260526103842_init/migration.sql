-- CreateTable
CREATE TABLE "HealthLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawInput" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "weight" REAL,
    "systolic" INTEGER,
    "diastolic" INTEGER,
    "calories" INTEGER,
    "analysis" TEXT
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
