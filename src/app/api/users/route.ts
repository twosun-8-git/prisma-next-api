import { NextRequest, NextResponse } from "next/server";

import { getUsers } from "@/lib/users";
import { getQueryParams } from "@/lib/util";

export async function GET(request: NextRequest) {
  const params = getQueryParams(request, ["scores"]);
  const { scores } = params;

  const users = await getUsers({
    scores: scores === "1",
  });

  return NextResponse.json(users);
}
