'use server'

import { cookies } from "next/headers";

export async function SetCookies({ name, token }: { name: string; token: string }) {
  const cookieStore = await cookies();

  cookieStore.set(name, token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
}
