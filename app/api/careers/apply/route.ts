// @ts-nocheck
import { NextResponse } from "next/server";
import { withCsrfProtection } from '@/lib/security/csrf';
import { withRateLimit } from '@/lib/rate-limit';
import fs from "fs/promises";
import path from "path";

type ApplicationPayload = {
  name: string;
  email: string;
  jobId: string | number;
  jobTitle?: string;
  location?: string;
  coverLetter?: string;
  resumeUrl?: string;
};

export const POST = withCsrfProtection(withRateLimit(async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload: Partial<ApplicationPayload> = {};

    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      payload = Object.fromEntries(form.entries()) as Partial<ApplicationPayload>;
    } else {
      payload = await request.json().catch(() => ({}));
    }

    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim();
    const jobId = String(payload.jobId || "").trim();

    if (!name || !email || !jobId) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: name, email, jobId" },
        { status: 400 }
      );
    }

    const record = {
      name,
      email,
      jobId,
      jobTitle: payload.jobTitle || null,
      location: payload.location || null,
      coverLetter: payload.coverLetter || null,
      resumeUrl: payload.resumeUrl || null,
      receivedAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || null,
    };

    const dir = path.join(process.cwd(), "system-files");
    const filePath = path.join(dir, "career_applications.json");
    await fs.mkdir(dir, { recursive: true });

    let existing: any[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      existing = JSON.parse(raw);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    existing.push(record);
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/careers/apply error", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected error processing application" },
      { status: 500 }
    );
  }
}, {
  limit: 30,
  windowMs: 10 * 60 * 1000,
  key: (req: Request) => {
    // Careers apply is generally unauthenticated; use UA + accept-language as part of key with IP if available via headers
    const ua = (req.headers as any).get?.('user-agent') || 'ua-unknown';
    const lang = (req.headers as any).get?.('accept-language') || 'lang-unknown';
    return `careers-apply:${ua}:${lang}`;
  }
}));

