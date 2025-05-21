import prisma from "@/lib/prismaClient";
import { error400, error404, error409 } from "@/lib/errors";
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
 * ユーザーが存在するかどうかを確認する関数
 * @param email
 * @returns ユーザーが存在するかどうか
 */
export const checkExistUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return error404("ユーザーが見つかりません。");
  }

  return {
    success: true,
    statusCode: 200,
    data: user,
  };
};

/**
 * メールアドレスが重複しているかどうかを確認する関数
 * @param email
 * @returns メールアドレスが重複しているかどうか
 */
export const checkUniqueEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return error409("このメールアドレスは既に登録されています。");
  }

  return {
    success: true,
    statusCode: 200,
    data: user,
  };
};

/**
 * 必須項目かどうかを確認する関数
 * @param value
 * @returns 必須項目かどうか
 */
export const checkRequire = (value: string, message?: string) => {
  if (!value) {
    return error400(message || "必須項目です。");
  }

  return {
    success: true,
    statusCode: 200,
  };
};
