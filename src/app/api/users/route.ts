import { NextRequest, NextResponse } from "next/server";

import { getUsers } from "@/lib/users";
import { getQueryParams } from "@/app/api/utils";

export async function GET(request: NextRequest) {
  const params = getQueryParams(request, ["admin", "scores"]);
  const { admin, scores } = params;

  const users = await getUsers({
    admin: !admin ? undefined : admin === "1",
    scores: !scores ? undefined : scores === "1",
  });

  return NextResponse.json(users);
}
