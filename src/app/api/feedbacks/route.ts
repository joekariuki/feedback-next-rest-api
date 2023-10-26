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
    status: "SUCCESS",
    results: feedbacks.length,
    feedbacks,
  };

  return NextResponse.json(json_response);
}

// POST - add a single feedback record
export async function POST(request: Request) {
  try {
    const json = await request.json();

    const feedback = await prisma.feedback.create({
      data: json,
    });

    let json_response = {
      status: "SUCCESS",
      data: {
        feedback,
      },
    };

    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      let error_response = {
        status: "FAIL",
        message: "Feedback with the title already exists",
      };

      return new NextResponse(JSON.stringify(error_response), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
