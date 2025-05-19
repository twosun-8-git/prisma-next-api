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
  status: boolean;
  error?: {
    code: string;
    message: string;
  };
}): NextResponse | null => {
  if (!result.status) {
    const statusCode = result.error?.code === "DUPLICATE_EMAIL" ? 409 : 500;
    return NextResponse.json(
      {
        code: statusCode,
        error: result.error?.message,
      },
      { status: statusCode }
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
