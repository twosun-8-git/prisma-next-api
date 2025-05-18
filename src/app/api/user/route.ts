import { NextRequest, NextResponse } from "next/server";

import { createUser, getUser } from "@/lib/user";
import { getQueryParams } from "@/lib/util";

export async function GET(request: NextRequest) {
  const params = getQueryParams(request, ["email", "scores"]);
  const { email, scores } = params;

  if (!email) {
    return NextResponse.json(
      { error: "メールアドレスは必須です" },
      { status: 400 }
    );
  }

  const users = await getUser({
    email,
    scores: scores === "1",
  });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { email } = body;

  if (!email) {
    return NextResponse.json(
      { error: "メールアドレスは必須です" },
      { status: 400 }
    );
  }

  const result = await createUser(body);

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

  return NextResponse.json(result);
}
