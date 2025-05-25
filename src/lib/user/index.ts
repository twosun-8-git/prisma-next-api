import prisma from "@/lib/prismaClient";
import {
  CreateUser,
  GetUser,
  UpdateUser,
  DeleteUser,
  SCORE_FIELDS,
} from "@/lib/user/type";
import { getScoreIdByEmail, checkUniqueEmail, checkRequire } from "@/lib/utils";
import { error500, error400, error404 } from "@/lib/errors";
import { z } from "zod";
import { UserSchema } from "@generated/zod/modelSchema/UserSchema";
import { ScoreSchema } from "@generated/zod/modelSchema/ScoreSchema";
import { UserWhereUniqueInputSchema } from "@generated/zod/inputTypeSchemas/UserWhereUniqueInputSchema";

// 完全なユーザースキーマ（UserSchema に scores が含まれないので追加）
const CompleteUserSchema = UserSchema.extend({
  scores: z.array(ScoreSchema).optional(),
});

// GetUserのバリデーションスキーマ
const GetUserSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  scores: z.boolean().optional(),
});

/**
 * ユーザーを取得する関数
 * @param email
 * @param scores
 * @returns ユーザー
 */
export const getUser = async ({ email, scores = true }: GetUser) => {
  // Zodによるバリデーション
  const validationResult = GetUserSchema.safeParse({ email, scores });
  if (!validationResult.success) {
    return {
      success: false,
      statusCode: 400,
      error: validationResult.error.errors[0].message,
    };
  }

  // メールアドレスの形式チェック
  const emailValidation = UserWhereUniqueInputSchema.safeParse({ email });
  if (!emailValidation.success) {
    return {
      success: false,
      statusCode: 400,
      error: "無効なメールアドレス形式です",
    };
  }

  try {
    const result = await prisma.user
      .findUnique({
        where: { email },
        include: {
          scores: Boolean(scores),
        },
      })
      .withAccelerateInfo();

    if (!result.data) {
      return error404("ユーザーが見つかりません。");
    }

    // 結果のバリデーション（CompleteUserSchemaを使用）
    const validatedResult = CompleteUserSchema.safeParse(result.data);
    if (!validatedResult.success) {
      return error500(
        "取得したデータの形式が不正です。",
        validatedResult.error
      );
    }

    return {
      success: true,
      statusCode: 200,
      data: validatedResult.data,
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

  // スコアのバリデーション
  if (scores) {
    // 存在しないフィールドのチェック
    const validFields = SCORE_FIELDS.map(String);
    const providedFields = Object.keys(scores);
    const invalidFields = providedFields.filter(
      (field) => !validFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return error400(`無効なスコアフィールド: ${invalidFields.join(", ")}`);
    }

    // 値の型チェック
    const invalidValues = Object.entries(scores)
      .filter(([, value]) => typeof value !== "number")
      .map(([field]) => field);

    if (invalidValues.length > 0) {
      return error400(
        `スコアは数値で指定してください: ${invalidValues.join(", ")}`
      );
    }

    // 値の範囲チェック
    const invalidRanges = Object.entries(scores)
      .filter(([, value]) => {
        // 整数であることを確認
        if (!Number.isInteger(value)) return true;
        // 0-100の範囲内であることを確認
        return value < 0 || value > 100;
      })
      .map(([field]) => field);

    if (invalidRanges.length > 0) {
      return error400(
        `スコアは0から100の整数で指定してください: ${invalidRanges.join(", ")}`
      );
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      return tx.user.create({
        data: {
          email,
          name,
          age,
          isAdmin,
          scores: scores
            ? {
                create: {
                  Langage: scores.Langage,
                  Arithmetic: scores.Arithmetic,
                  Science: scores.Science,
                  Math: scores.Math,
                },
              }
            : undefined,
        },
        include: {
          scores: true,
        },
      });
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
  // メールアドレスの形式チェック
  const emailValidation = UserWhereUniqueInputSchema.safeParse({ email });
  if (!emailValidation.success) {
    return {
      success: false,
      statusCode: 400,
      error: "無効なメールアドレス形式です",
    };
  }

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
    if (
      error instanceof Error &&
      error.message.includes("Record to update does not exist")
    ) {
      return {
        success: false,
        statusCode: 404,
        error: {
          code: "NOT_FOUND",
          message: "ユーザーが見つかりません。",
        },
      };
    }
    return error500("ユーザー更新中にエラーが発生しました。", error);
  }
};

/**
 * ユーザーを削除する関数
 * @param email
 * @returns ユーザー
 */
export const deleteUser = async ({ email }: DeleteUser) => {
  // メールアドレスの形式チェック
  const emailValidation = UserWhereUniqueInputSchema.safeParse({ email });
  if (!emailValidation.success) {
    return {
      success: false,
      statusCode: 400,
      error: "無効なメールアドレス形式です",
    };
  }

  try {
    const result = await prisma.user.delete({
      where: { email },
    });

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return {
        success: false,
        statusCode: 404,
        error: {
          code: "NOT_FOUND",
          message: "ユーザーが見つかりません。",
        },
      };
    }
    return error500("ユーザー削除中にエラーが発生しました。", error);
  }
};
