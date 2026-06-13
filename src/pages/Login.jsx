import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const { login, error, setError } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setError(null);

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const result = await login(
      formData.email,
      formData.password
    );

    setLoading(false);

    if (result.success) {
      toast.success("Login Successful");

      navigate("/");
    } else {
      toast.error(
        result.message || "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-blue-300 flex items-center justify-center p-6">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Side */}

        <div className="flex flex-col justify-center p-10 md:p-16">

          <h1 className="text-4xl font-bold mb-3">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mb-10">
            Login to manage users, projects and
            monitor progress.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="block mb-2 text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:opacity-90 transition"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

        </div>

        {/* Right Side */}

        <div className="hidden md:flex bg-white items-center justify-center p-10">

          <img
            src="/loginpage.avif"
            alt="Project Management"
            className="rounded-2xl object-cover h-full w-full"
          />

        </div>

      </div>

    </div>
  );
};

export default Login;