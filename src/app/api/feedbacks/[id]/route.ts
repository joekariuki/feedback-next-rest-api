import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const feedback = await prisma.feedback.findUnique({
    where: {
      id,
    },
  });

  if (!feedback) {
    let error_response = {
      status: "FAIL",
      message: "No Feedback with the provided ID found",
    };

    return new NextResponse(JSON.stringify(error_response), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  let json_response = {
    status: "SUCCESS",
    data: {
      feedback,
    },
  };

  return NextResponse.json(json_response);
}
