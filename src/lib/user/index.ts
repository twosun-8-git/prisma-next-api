import prisma from "../prismaClient";
import { GetUser, User, UpdateUser } from "./type";

/**
 * ユーザーを取得する関数
 * @param email
 * @param scores
 * @returns ユーザー
 */
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

/**
 * ユーザーを作成する関数
 * @param email
 * @param name
 * @param age
 * @param isAdmin
 * @param scores
 */
export const createUser = async ({
  email,
  name,
  age,
  isAdmin,
  scores,
}: User) => {
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

/**
 * emailからscoreのidを取得する関数
 * @param email
 * @returns scoreのid
 */
export const getScoreIdByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { scores: true },
  });
  // 1人のユーザーに1つのscoreのみ前提
  if (user && user.scores && user.scores.length > 0) {
    return user.scores[0].id;
  }
  return null;
};

/**
 * ユーザーを更新する関数
 * @param email
 * @param name
 * @param age
 * @param isAdmin
 * @param scores
 */
export const updateUser = async ({
  email,
  name,
  age,
  isAdmin,
  scores,
}: UpdateUser) => {
  try {
    let scoreUpdate = undefined;
    if (scores) {
      const scoreId = await getScoreIdByEmail(email);
      if (scoreId) {
        scoreUpdate = {
          update: [
            {
              where: { id: scoreId },
              data: {
                Langage: scores.Langage,
                Arithmetic: scores.Arithmetic,
                Science: scores.Science,
                Math: scores.Math,
              },
            },
          ],
        };
      }
    }

    const result = await prisma.user.update({
      where: { email },
      data: {
        name,
        age,
        isAdmin,
        scores: scoreUpdate,
      },
    });

    return {
      status: true,
      data: result,
    };
  } catch (error: unknown) {
    console.log(error);
    return {
      status: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: "ユーザー更新中にエラーが発生しました。",
      },
    };
  }
};
