"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.API_URL_INTERNAL ?? "http://localhost:8000";

export async function loginAction(_prevState: unknown, formData: FormData): Promise<{ error?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const res = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  });

  if (!res.ok) {
    return { error: "Invalid email or password" };
  }

  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    const match = setCookieHeader.match(/access_token=([^;]+)/);
    if (match) {
      cookies().set("access_token", match[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 86400,
        path: "/",
      });
    }
  }

  redirect("/");
}

export async function registerAction(_prevState: unknown, formData: FormData): Promise<{ error?: string }> {
  const res = await fetch(`${API}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
      full_name: formData.get("full_name"),
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data.detail ?? "Registration failed" };
  }

  redirect("/login?registered=1");
}

export async function logoutAction(): Promise<void> {
  cookies().delete("access_token");
  redirect("/login");
}
