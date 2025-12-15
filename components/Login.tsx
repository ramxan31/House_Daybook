"use client";
import { apiClient } from "@/lib/apiClient";
import { UserProfile } from "@/types/auth";
import { DollarSign } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAlert } from "./Alert";
import { Button, Input } from "./UI";

interface LoginProps {
  onLogin: (profile: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const alert = useAlert();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (authMode === "register") {
        if (!authForm.name || !authForm.email || !authForm.password) {
          throw new Error("All fields are required");
        }
        if (authForm.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        const { token, user: userData } = await apiClient.register(authForm);

        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(userData));
      } else {
        if (!authForm.email || !authForm.password) {
          throw new Error("Email and password are required");
        }

        const { token, user: userData } = await apiClient.login(authForm);
        onLogin(userData);
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(userData));

        alert("Login Successfull", "success", 5);
      }

      setAuthForm({ name: "", email: "", password: "" });
    } catch (error: any) {
      alert(error.message, "error", 5);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">
            House Daybook
          </h1>
          <p className="text-gray-600">
            {authMode === "login" ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {authError}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authMode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                type="text"
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm({ ...authForm, name: e.target.value })
                }
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm({ ...authForm, email: e.target.value })
              }
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            disabled={authLoading}
            variant="primary"
            className="w-full"
          >
            {authLoading
              ? "Please wait..."
              : authMode === "login"
              ? "Login"
              : "Register"}
          </Button>

          {/* <div className="text-center">
            <button
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setAuthError("");
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {authMode === "login"
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
