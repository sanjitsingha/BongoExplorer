"use client";
import { useState, useEffect, useContext, Suspense } from "react";
import { AuthContext } from "../authprovider";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const ResetPasswordForm = () => {
  const { resetPassword } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
    status: { type: "", message: "" },
    isLoading: false,
  });

  // Get userId and secret from URL parameters
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    if (!userId || !secret) {
      setFormState((prev) => ({
        ...prev,
        status: {
          type: "error",
          message: "Invalid reset password link",
        },
      }));
    }
  }, [userId, secret]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formState;

    if (password !== confirmPassword) {
      setFormState((prev) => ({
        ...prev,
        status: {
          type: "error",
          message: "Passwords do not match",
        },
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isLoading: true,
      status: { type: "", message: "" },
    }));

    try {
      await resetPassword(userId, secret, password);
      setFormState((prev) => ({
        ...prev,
        status: {
          type: "success",
          message:
            "Password reset successful. You can now login with your new password.",
        },
      }));

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        status: {
          type: "error",
          message: "Failed to reset password. Please try again.",
        },
      }));
    } finally {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-t relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={formState.password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-b relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formState.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {formState.status.message && (
            <div
              className={`p-4 rounded ${
                formState.status.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {formState.status.message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={formState.isLoading || !userId || !secret}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                formState.isLoading || !userId || !secret
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {formState.isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main page component with Suspense
const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Loading reset password form...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
