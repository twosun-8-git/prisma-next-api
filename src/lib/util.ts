import { NextRequest } from "next/server";

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
