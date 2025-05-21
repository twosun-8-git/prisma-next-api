import { NextResponse, NextRequest } from "next/server";

/**
 * メールアドレスが必須かどうかをチェックする関数
 * @param email
 * @returns エラーがある場合はNextResponseオブジェクト、なければnull
 */
export const checkEmail = (email: string | null): NextResponse | null => {
  if (!email) {
    return NextResponse.json(
      { error: "メールアドレスは必須です" },
      { status: 400 }
    );
  }
  return null;
};

/**
 * 操作結果のエラーを処理する関数
 * @param result 操作の結果
 * @returns エラーがある場合はNextResponseオブジェクト、なければnull
 */
export const handleResultError = (result: {
  success: boolean;
  statusCode?: number;
  error?: {
    code: string;
    message: string;
  } | null;
}): NextResponse | null => {
  if (!result.success) {
    // エラーコードとHTTPステータスコードのマッピング
    const errorStatusMap: Record<string, number> = {
      DUPLICATE_EMAIL: 409,
      USER_NOT_FOUND: 404,
      ALREADY_EXIST_EMAIL: 409,
      REQUIRED_ERROR: 400,
      NOT_FOUND: 404,
      BAD_REQUEST: 400,
      CONFLICT: 409,
      UNKNOWN_ERROR: 500,
    };

    const errorCode = result.error?.code;
    const statusCode = errorCode ? errorStatusMap[errorCode] : 500;

    return NextResponse.json(
      {
        code: result.statusCode || statusCode,
        error: result.error?.message || "エラーが発生しました",
      },
      { status: result.statusCode || statusCode }
    );
  }
  return null;
};

/**
 * GETリクエストからクエリパラメーターを取得する
 * @param request NextRequestオブジェクト
 * @param paramName 取得したいパラメーター名
 * @returns パラメーターの値（存在しない場合はnull）
 */
export const getQueryParam = (
  request: NextRequest,
  paramName: string
): string | null => {
  const { searchParams } = new URL(request.url);
  return searchParams.get(paramName);
};

/**
 * GETリクエストから複数のクエリパラメーターを取得する
 * @param request NextRequestオブジェクト
 * @param paramNames 取得したいパラメーター名の配列
 * @returns パラメーター名と値のオブジェクト
 */
export const getQueryParams = (
  request: NextRequest,
  paramNames: string[]
): Record<string, string | null> => {
  const { searchParams } = new URL(request.url);
  return paramNames.reduce((acc, paramName) => {
    acc[paramName] = searchParams.get(paramName);
    return acc;
  }, {} as Record<string, string | null>);
};
