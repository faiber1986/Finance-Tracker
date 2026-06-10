import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("access_token");
  if (token) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900 p-4">
      {children}
    </div>
  );
}
