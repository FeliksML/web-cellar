import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <p className="mb-8 text-xl text-slate-400">Page not found</p>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
