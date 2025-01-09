import api from "@/lib/api";
import React, { useState ,useEffect} from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };
  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(`${api}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "An error occurred during login.");
        }
      }

      const data = await response.json();
      console.log(data.user);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("refreshToken", data.refreshToken);
      Cookies.set("authToken", data.token, { expires: 1 });

      const passwordStatusResponse = await fetch(
        `${api}/user/password-status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const passwordStatusData = await passwordStatusResponse.json();
      console.log(passwordStatusData.isDefaultPassword);

      if (passwordStatusData.isDefaultPassword) {
        navigate("/change-password");
      } else {
        navigate("/hr-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    if (
      !forgotPasswordData.currentPassword ||
      !forgotPasswordData.newPassword
    ) {
      alert("Please enter both current and new passwords");
      return;
    }

    try {
      console.log(`${api}/user/change-password`);
      const response = await fetch(`${api}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...forgotPasswordData,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      alert("Password reset successful!");
      setShowForgotPassword(false);
    } catch (error) {
      console.error("Password reset error:", error);
      alert(error.message || "An error occurred during password reset.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-800 via-white to-blue-800">
      <div className="w-96 bg-white shadow-md rounded-lg overflow-hidden">
        {!showForgotPassword ? (
          <div className="p-6">
            <h2 className="text-center text-2xl font-bold text-black mb-6">
              SDET Tech Assessment Admin Login
            </h2>

            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="text-red-500 text-sm text-center mb-4">
                    {error}
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-center text-2xl font-bold text-black mb-6">
              Reset Password
            </h2>

            <form onSubmit={handleForgotPassword}>
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={forgotPasswordData.currentPassword}
                    onChange={handleForgotPasswordChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Reset Password Button */}
              <div className="mt-6 space-y-2">
                <button
                  type="submit"
                  className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Reset Password
                </button>

                {/* Back to Login Button */}
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full border border-blue-800 text-blue-800 py-2 rounded-md hover:bg-blue-50 transition duration-300"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
