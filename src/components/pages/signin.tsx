"use client";

import { useState } from "react";
import axios from "axios";
import React from "react";
export function setCookie(name: string, value: string, minutes: number) {
  const d = new Date();
  d.setTime(d.getTime() + (minutes * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  // ⚠️ Secure hata diya local testing ke liye
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // --- handle input change ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- handle submit (axios call) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`,
        formData,
        {
          withCredentials: true, // ✅ send/receive httpOnly cookies
        }
      );

      const data = response.data;
      console.log("Signin Response:", data);

      if (data.success) {
        // Access token (frontend readable)
        setCookie("atk", data.accessToken, 1440); // 1 day


        // Redirect to dashboard
        window.location.href = "/analyzer";
      } else {
        alert(data.message || "Signin failed");
      }
    } catch (error: any) {
      console.error("Signin Error:", error);
      alert(error.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };
  const GoogleHandler = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("Backend URL not defined");
      return;
    }
    window.location.href = `${backendUrl}/auth/google`;
  }
  const GithubHandler = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("Backend URL not defined");
      return;
    }
    window.location.href = `${backendUrl}/auth/github`;
  }

  return (
    <div className="md:w-[40%] w-[80%] px-3 mx-auto mt-0 md:flex-0 shrink-0">
      <div className="relative z-0 flex flex-col min-w-0 break-words 
        bg-white dark:bg-neutral-900 
        border border-gray-200 dark:border-neutral-700 
        shadow-soft-xl rounded-2xl bg-clip-border transition-colors duration-300">

        {/* Header */}
        <div className="p-6 mb-0 text-center bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 rounded-t-2xl">
          <h5 className="text-gray-800 dark:text-gray-100 font-semibold">Sign in with</h5>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-wrap px-3 -mx-3 sm:px-6 xl:px-12 mt-4">
          {/* Facebook */}
          <div className="w-3/12 max-w-full px-1 ml-auto flex-0">
            <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center 
              uppercase transition-all border rounded-lg cursor-pointer 
              text-xs ease-soft-in tracking-tight-soft hover:scale-105 hover:opacity-80
              text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" height="32" width="24">
                <circle cx="32" cy="32" r="30" fill="#3C5A9A" />
                <path fill="#FFFFFF" d="M39 9h-6.5c-4 0-8 2-8 7.3v6h-5v7h5v21h8.5V29h5.5l.6-7H33v-2.7c0-2.3 1.3-3.3 3.3-3.3H39V9z" />
              </svg>
            </a>
          </div>

          {/* Github */}
          <div className="w-3/12 max-w-full px-1 flex-0" onClick={GithubHandler}>
            <a
              className="inline-block w-full px-6 py-3 mb-4 font-bold text-center 
      uppercase transition-all border rounded-lg cursor-pointer 
      text-xs ease-soft-in tracking-tight-soft hover:scale-105 hover:opacity-80
      text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                height="32"
                width="24"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 
        0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13 
        -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66 
        .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15 
        -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.7 7.7 0 0 1 2-.27c.68 0 1.36.09 
        2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 
        1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 
        1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 
        0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
          </div>

          {/* Google */}
          <div className="w-3/12 max-w-full px-1 mr-auto flex-0"
            onClick={GoogleHandler}
          >
            <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center 
              uppercase transition-all border rounded-lg cursor-pointer 
              text-xs ease-soft-in tracking-tight-soft hover:scale-105 hover:opacity-80
              text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" height="32" width="24">
                <path fill="#4285F4" d="M58 30c0-2.4-.2-4.2-.6-6H32v12h15.7c-.3 2.6-2 6.8-5.9 9.3l-.1.3 8.7 6.8.6.1C54.6 47.7 58 40.1 58 30z" />
                <path fill="#34A853" d="M32 59c8 0 14.6-2.6 19.5-7.1l-8.7-6.8c-2.5 1.7-5.9 3-10.8 3-8.1 0-15-5.4-17.3-12.8H4.2v8C9 52.4 19 59 32 59z" />
                <path fill="#FBBC05" d="M14.2 35.3c-.6-1.9-1-3.9-1-6s.4-4.1 1-6l-.1-.3L4.1 16.1l-.3.1C1.1 20.3 0 24.7 0 29.5s1.1 9.2 3.8 13.2l10.4-7.4z" />
                <path fill="#EA4335" d="M32 11.4c5.5 0 9.1 2.3 11.2 4.2l8.2-8.1C46.1 2.9 39.4 0 32 0 19 0 9 6.6 4.1 16.3l10.1 7.4C17 16.6 23.6 11.4 32 11.4z" />
              </svg>
            </a>
          </div>

          <div className="relative w-full max-w-full px-3 mt-2 text-center shrink-0">
            <p className="inline px-4 mb-2 font-semibold leading-normal 
              bg-white dark:bg-neutral-900 text-sm 
              text-slate-400 dark:text-slate-500">
              or
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                aria-label="Email"
                value={formData.email}
                onChange={handleChange}
                className="text-sm block w-full rounded-lg border 
                border-gray-300 dark:border-gray-600 
                py-2 px-3 text-gray-800 dark:text-gray-100 
                bg-white dark:bg-neutral-800 
                focus:border-fuchsia-300 focus:outline-none transition-colors duration-300"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                aria-label="Password"
                value={formData.password}
                onChange={handleChange}
                className="text-sm block w-full rounded-lg border 
                border-gray-300 dark:border-gray-600 
                py-2 px-3 text-gray-800 dark:text-gray-100 
                bg-white dark:bg-neutral-800 
                focus:border-fuchsia-300 focus:outline-none transition-colors duration-300"
                required
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-5 h-5 mr-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-neutral-800"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              {/* <a className="text-sm font-bold text-slate-700 dark:text-slate-100 hover:underline" href="/forgot-password">
                Forgot password?
              </a> */}
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-block w-full px-6 py-3 mt-6 mb-2 font-bold text-center text-white 
                uppercase transition-all rounded-lg hover:scale-105 
                bg-gradient-to-tl from-gray-900 to-slate-800 
                hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"

              >
                SignIn
              </button>
            </div>

            <p className="mt-4 mb-0 text-sm text-center text-slate-700 dark:text-slate-300">
              Don't have an account?{" "}
              <a className="font-bold text-slate-700 dark:text-slate-100" href="/signup">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;