import prisma from "@/lib/prismaClient";
import { CreateUser, GetUser, UpdateUser, DeleteUser } from "@/lib/user/type";
import {
  getScoreIdByEmail,
  checkExistUser,
  checkUniqueEmail,
  checkRequire,
} from "@/lib/utils";
import { error500 } from "@/lib/errors";

/**
 * ユーザーを取得する関数
 * @param email
 * @param scores
 * @returns ユーザー
 */
export const getUser = async ({ email, scores = false }: GetUser) => {
  const existUser = await checkExistUser(email);
  if (!existUser.success) {
    return existUser;
  }

  try {
    const result = await prisma.user
      .findUnique({
        where: { email },
        include: !scores
          ? undefined
          : {
              scores: true,
            },
      })
      .withAccelerateInfo();

    return {
      success: true,
      statusCode: 200,
      data: result,
    };
  } catch (error: unknown) {
    return error500("ユーザー取得中にエラーが発生しました。", error);
  }
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
}: CreateUser) => {
  const uniqueEmail = await checkUniqueEmail(email);
  if (!uniqueEmail.success) {
    return uniqueEmail;
  }

  const requireName = checkRequire(name);

  if (!requireName.success) {
    return checkRequire(name, "名前は必須項目です。");
  }

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
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    return error500("ユーザー作成中にエラーが発生しました。", error);
  }
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
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    return error500("ユーザー更新中にエラーが発生しました。", error);
  }
};

/**
 * ユーザーを削除する関数
 * @param email
 * @returns ユーザー
 */
export const deleteUser = async ({ email }: DeleteUser) => {
  try {
    const result = await prisma.user.delete({
      where: { email },
    });

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    return error500("ユーザー削除中にエラーが発生しました。", error);
  }
};
