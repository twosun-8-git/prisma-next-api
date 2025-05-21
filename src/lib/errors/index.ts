/**
 * 500エラーを返す関数
 * @param message
 * @param error
 * @returns 500エラー
 */
export const error500 = (message: string, error?: unknown) => {
  return {
    success: false,
    statusCode: 500,
    error: {
      code: "UNKNOWN_ERROR",
      message: message || "エラーが発生しました。",
      error: error,
    },
  };
};

/**
 * 400エラーを返す関数
 * @param message
 * @param error
 * @returns 400エラー
 */
export const error400 = (message: string, error?: unknown) => {
  return {
    success: false,
    statusCode: 400,
    error: {
      code: "BAD_REQUEST",
      message: message || "不正なリクエストです。",
      error: error,
    },
  };
};

/**
 * 404エラーを返す関数
 * @param message
 * @param error
 * @returns 404エラー
 */
export const error404 = (message: string, error?: unknown) => {
  return {
    success: false,
    statusCode: 404,
    error: {
      code: "NOT_FOUND",
      message: message || "見つかりませんでした。",
      error: error,
    },
  };
};

/**
 * 409エラーを返す関数
 * @param message
 * @param error
 * @returns 409エラー
 */
export const error409 = (message: string, error?: unknown) => {
  return {
    success: false,
    statusCode: 409,
    error: {
      code: "CONFLICT",
      message: message || "重複しています。",
      error: error,
    },
  };
};
