import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // ユーザーデータの作成
  await prisma.user.create({
    data: {
      name: "山田太郎",
      email: "yamada@example.com",
      age: 25,
      isAdmin: false,
      scores: {
        create: {
          Langage: 5,
          Arithmetic: 24,
          Science: 14,
          Math: 65,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "鈴木花子",
      email: "suzuki@example.com",
      age: 29,
      isAdmin: true,
      scores: {
        create: {
          Langage: 92,
          Arithmetic: 50,
          Science: 81,
          Math: 78,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "田中宏樹",
      email: "tanaka@example.com",
      age: 14,
      isAdmin: true,
      scores: {
        create: {
          Langage: 92,
          Arithmetic: 32,
          Science: 11,
          Math: 0,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "宮城良太",
      email: "miyagi@example.com",
      age: 32,
      isAdmin: true,
    },
  });

  console.log("シードデータの作成が完了しました");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
