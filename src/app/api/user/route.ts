import { NextRequest, NextResponse } from "next/server";

import { createUser, getUser, updateUser } from "@/lib/user";
import { checkEmail, getQueryParams, handleResultError } from "@/app/api/utils";

export async function GET(request: NextRequest) {
  const params = getQueryParams(request, ["email", "scores"]);
  const { email, scores } = params;

  const error = checkEmail(email);
  if (error) return error;

  const users = await getUser({
    email: email as string,
    scores: scores === "1",
  });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { email } = body;

  const error = checkEmail(email);
  if (error) return error;

  const result = await createUser(body);

  const resultError = handleResultError(result);
  if (resultError) return resultError;

  return NextResponse.json(result);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const { email } = body;

  const error = checkEmail(email);
  if (error) return error;

  const result = await updateUser(body);

  const resultError = handleResultError(result);
  if (resultError) return resultError;

  return NextResponse.json(result);
}
