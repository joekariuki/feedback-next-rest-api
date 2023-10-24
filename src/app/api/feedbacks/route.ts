import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET All - retrieves all feedbacks
export async function GET(request: NextRequest) {
  const page_str = request.nextUrl.searchParams.get("page");
  const limit_str = request.nextUrl.searchParams.get("limit");

  const page = page_str ? parseInt(page_str, 10) : 1;
  const limit = limit_str ? parseInt(limit_str, 10) : 10;
  const skip = (page - 1) * limit;

  const feedbacks = await prisma.feedback.findMany({
    skip,
    take: limit,
  });

  let json_response = {
    status: "success",
    results: feedbacks.length,
    feedbacks,
  };

  return NextResponse.json(json_response);
}
