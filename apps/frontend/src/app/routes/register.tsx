import { RegisterForm } from "@/features/auth";

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <RegisterForm />
    </div>
  );
}
