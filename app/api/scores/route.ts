import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, score } = await req.json();

  if (!name || typeof score !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.score.findFirst({ where: { name } });
  let result;
  if (existing) {
    result = await prisma.score.update({
      where: { id: existing.id },
      data: { score: Math.max(existing.score, score) },
    });
  } else {
    result = await prisma.score.create({
      data: { name, score },
    });
  }

  return NextResponse.json(result);
}

export async function GET() {
  const scorecard = await prisma.score.findMany({
    orderBy: { score: "desc" },
  });

  return NextResponse.json(scorecard);
}
