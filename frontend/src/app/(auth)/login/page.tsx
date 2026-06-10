import { LoginForm } from "@/features/auth";

export default function LoginPage({ searchParams }: { searchParams: { registered?: string } }) {
  return <LoginForm registered={searchParams.registered === "1"} />;
}
