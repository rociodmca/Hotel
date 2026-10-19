import { NextResponse } from "next/server";
import { checkPassword, createSession, adminPasswordConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminPasswordConfigured()) {
    return NextResponse.json(
      { error: "El panel no está configurado. Define ADMIN_PASSWORD en el entorno." },
      { status: 500 }
    );
  }

  let password = "";
  try {
    const json = await request.json();
    password = typeof json?.password === "string" ? json.password : "";
  } catch {
    password = "";
  }

  if (!(await checkPassword(password))) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const session = await createSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(session.name, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge
  });
  return response;
}
