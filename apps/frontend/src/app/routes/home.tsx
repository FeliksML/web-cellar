import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await apiClient.get("/health");
      return response.data;
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold">Web Cellar</h1>
        <p className="mb-8 text-xl text-slate-300">
          Production-ready React + FastAPI boilerplate
        </p>

        <div className="mb-8 rounded-lg bg-slate-700/50 p-6">
          <h2 className="mb-4 text-lg font-semibold">API Status</h2>
          {isLoading && <p className="text-slate-400">Checking connection...</p>}
          {error && (
            <p className="text-red-400">
              Unable to connect to API. Make sure the backend is running.
            </p>
          )}
          {data && (
            <div className="space-y-2">
              <p className="text-green-400">Connected</p>
              <p className="text-sm text-slate-400">
                Database: {data.database}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-700"
          >
            API Docs
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-600 px-6 py-3 font-medium transition hover:bg-slate-700"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
