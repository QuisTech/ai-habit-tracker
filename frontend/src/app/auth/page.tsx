"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, LogIn, UserPlus } from "lucide-react";

// ✅ Define response types for clarity
interface AuthResponse {
  token?: string;
  error?: string;
}

export default function AuthPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (isLogin && data.token) {
        localStorage.setItem("token", data.token);
        router.push("/"); // ✅ Redirect to home
      } else {
        alert("Account created successfully! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-gray-100">
          {isLogin ? "Welcome Back 👋" : "Create an Account 🚀"}
        </h1>

        {error && (
          <div className="mb-4 text-red-500 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800">
              <User className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
                className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800">
              <Lock className="text-gray-400 mr-2" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-2.5 font-semibold rounded-lg text-white transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-semibold"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}
