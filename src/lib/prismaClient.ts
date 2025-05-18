import { PrismaClient } from "../../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

// PrismaClientのインスタンスを作成する関数
const createPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};

// グローバルスコープの型定義
type GlobalWithPrisma = typeof globalThis & {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// グローバルスコープでPrismaClientのインスタンスを保持
const globalWithPrisma = globalThis as GlobalWithPrisma;

// シングルトンインスタンスを作成
const prisma = globalWithPrisma.prisma ?? createPrismaClient();

// 開発環境でのみ、グローバルインスタンスを設定
if (process.env.NODE_ENV !== "production") {
  globalWithPrisma.prisma = prisma;
}

export default prisma;
