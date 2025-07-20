import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const allowedOrigins = [
  "https://beat-me-up-mauve.vercel.app",
  "https://beat-me-up-git-main-jayant-kumars-projects-3fca7f2c.vercel.app",
  "https://beat-me-up-jayant-kumars-projects-3fca7f2c.vercel.app",
  "https://beat-me-ztutuello-jayant-kumars-projects-3fca7f2c.vercel.app",
  "http://localhost:3000", // For local development
];

export async function POST(req: Request) {
  const origin = req.headers.get("origin") || req.headers.get("referer");
  if (!origin || !allowedOrigins.some((o) => origin.startsWith(o))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
