'use client'

import React, { useState } from "react";
import { redirect } from 'next/navigation'


function AuthForm() {
  // State Management
  const [activeForm, setActiveForm] = useState("login"); // "login", "signup", "forgot1", "forgot2"
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle Forms
  const showForm = (form) => {
    setActiveForm(form);
    setMessage("");
    setFormData({});
  };

  // API Request Helper
  const makeRequest = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong!");
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const data = await makeRequest("http://127.0.0.1:8000/api/auth/signin/", { email, password });

    if (data?.access) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setMessage("Login successful! Redirecting...");
      // setTimeout(() => {
      //   window.location.href = "/dashboard.html";
      // }, 1000);
      redirect('/dashboard')
    } else {
      setMessage(data?.error || "Login failed!");
    }
  };

  // Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, username, password } = formData;
    const data = await makeRequest("http://127.0.0.1:8000/api/auth/register/", { email, username, password });

    if (data?.id) {
      setMessage("Signup successful! Please login.");
      setTimeout(() => showForm("login"), 1000);
    } else {
      setMessage(data?.error || "Signup failed!");
    }
  };

  // Generate OTP
  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    const { email } = formData;
    const data = await makeRequest("http://127.0.0.1:8000/api/auth/generate_otp/", { email });

    if (data?.otp) {
      setMessage(`OTP sent to ${email}`);
      showForm("forgot2");
      setFormData((prev) => ({ ...prev, email }));
    } else {
      setMessage(data?.error || "Failed to generate OTP!");
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { otp, email, newPassword, confirmPassword } = formData;
    const data = await makeRequest("http://127.0.0.1:8000/api/auth/reset_password/", {
      otp,
      email,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    if (data?.message) {
      setMessage("Password reset successful! Redirecting to login...");
      alert("Password reset successful! Redirecting to login...");
      setTimeout(() => showForm("login"), 1500);
    } else {
      setMessage(data?.error || "Failed to reset password!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-100">

    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        {activeForm === "signup"
          ? "Signup"
          : activeForm === "forgot1"
          ? "Forgot Password"
          : "Login"}
      </h2>

      {/* Slide Controls */}
      <div className="flex justify-between mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => showForm("login")}
          className={`w-1/2 text-center text-gray-600 font-medium p-2 transition ${
            activeForm === "login" ? "border-b-2 border-blue-500 text-blue-500" : ""
          }`}
        >
          Login
        </button>
        <button
          onClick={() => showForm("signup")}
          className={`w-1/2 text-center text-gray-600 font-medium p-2 transition ${
            activeForm === "signup" ? "border-b-2 border-blue-500 text-blue-500" : ""
          }`}
        >
          Signup
        </button>
      </div>

      {/* Forms */}
      <div className="space-y-4">
        {/* Login Form */}
        {activeForm === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <p
              className="text-sm text-blue-500 cursor-pointer hover:underline"
              onClick={() => showForm("forgot1")}
            >
              Forgot password?
            </p>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
            <p className="text-green-500 text-sm text-center">{message}</p>
            <p className="text-sm text-gray-600 text-center">
              Not a member?{" "}
              <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => showForm("signup")}>
                Signup now
              </span>
            </p>
          </form>
        )}

        {/* Signup Form */}
        {activeForm === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Signup
            </button>
            <p className="text-green-500 text-sm text-center">{message}</p>
          </form>
        )}

        {/* Generate OTP Form */}
        {activeForm === "forgot1" && (
          <form onSubmit={handleGenerateOTP} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Generate OTP
            </button>
            <p className="text-green-500 text-sm text-center">{message}</p>
          </form>
        )}

        {/* Reset Password Form */}
        {activeForm === "forgot2" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2 border bg-gray-100 rounded-lg"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Reset Password
            </button>
            <p className="text-green-500 text-sm text-center">{message}</p>
          </form>
        )}
      </div>
    </div>
  </div>
  </div>

  );
}

export default AuthForm;
