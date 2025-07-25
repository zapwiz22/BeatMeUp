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

  const frontendHeader = req.headers.get("x-frontend-auth");
  if (frontendHeader !== "ztype-game" && frontendHeader !== "beatmeup-game") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, score, captchaToken } = await req.json();

  if (!name || typeof score !== "number" || !captchaToken) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // captcha google
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const verifyRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${captchaToken}`,
    }
  );
  const verifyData = await verifyRes.json();
  console.log("reCAPTCHA verifyData:", verifyData);
  if (
    !verifyData.success ||
    verifyData.score < parseFloat("0") ||
    verifyData.score >= parseFloat(process.env.MAX_LIMIT!)
  ) {
    return NextResponse.json(
      { error: "Failed CAPTCHA", details: verifyData },
      { status: 403 }
    );
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
    where: {
      score: {
        gte: 0,
        lte: 2000,
      },
    },
  });

  return NextResponse.json(scorecard);
}
