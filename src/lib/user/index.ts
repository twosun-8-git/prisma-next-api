import prisma from "../prismaClient";
import { GetUser, CreateUser } from "./type";

export const getUser = async ({ email, scores = false }: GetUser) => {
  const result = await prisma.user
    .findMany({
      where: {
        email: {
          equals: email,
        },
      },
      include: !scores
        ? undefined
        : {
            scores: true,
          },
    })
    .withAccelerateInfo();
  return result;
};

export const createUser = async ({
  email,
  name,
  age,
  isAdmin,
  scores,
}: CreateUser) => {
  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        age,
        isAdmin,
        scores: !scores
          ? undefined
          : {
              create: {
                Langage: scores.Langage,
                Arithmetic: scores.Arithmetic,
                Science: scores.Science,
                Math: scores.Math,
              },
            },
      },
    });

    return {
      status: true,
      data: result,
    };
  } catch (error: unknown) {
    const { code } = error as { code: string };

    // P2002 はユニーク制約違反のエラーコード
    if (code === "P2002") {
      return {
        status: false,
        error: {
          code: "DUPLICATE_EMAIL",
          message: "このメールアドレスは既に登録されています。",
        },
      };
    }

    // その他のエラー
    return {
      status: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: "ユーザー作成中にエラーが発生しました。",
      },
    };
  }
};
