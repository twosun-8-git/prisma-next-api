import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/lib/user";
import { getQueryParams } from "@/lib/util";

export async function GET(request: NextRequest) {
  const params = getQueryParams(request, ["email", "scores"]);
  const { email, scores } = params;

  if (!email) {
    return NextResponse.json(
      { error: "Email parameter is required" },
      { status: 400 }
    );
  }

  const users = await getUser({
    email,
    scores: scores === "1",
  });

  return NextResponse.json(users);
}
