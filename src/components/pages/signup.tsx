"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    terms: true,
  });

  // --- TanStack Mutation ---
  const signupMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, data); // Replace with your backend endpoint
      return response.data;
    },
   onSuccess: (data) => {
  if (data.success) {
    window.location.href = `/verify/${data.id}`
  } else {
    alert(data.message);
  }
  console.log(data);
},

    onError: (error: any) => {
      alert(error.response?.data?.message || "Signup failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };
  return (
      <div className="md:w-[40%] w-[80%] px-3 mx-auto mt-0 md:flex-0 shrink-0">
      <div className="relative z-0 flex flex-col min-w-0 break-words 
        bg-white dark:bg-neutral-900 
        border border-gray-200 dark:border-neutral-700 
        shadow-soft-xl rounded-2xl bg-clip-border transition-colors duration-300">

        {/* Header */}
        <div className="p-6 mb-0 text-center bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 rounded-t-2xl">
          <h5 className="text-gray-800 dark:text-gray-100 font-semibold">Register with</h5>
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

          {/* Apple */}
          <div className="w-3/12 max-w-full px-1 flex-0">
            <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center 
              uppercase transition-all border rounded-lg cursor-pointer 
              text-xs ease-soft-in tracking-tight-soft hover:scale-105 hover:opacity-80
              text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" height="32" width="24">
                <path fill="currentColor" d="M40.9 32.8c.1 9.2 8 12.3 8.1 12.4-.1.2-1.3 4.4-4.2 8.7-2.5 3.7-5.1 7.5-9.2 7.6-3.9.1-5.2-2.5-9.8-2.5-4.3 0-5.7 2.5-9.6 2.6-3.9.1-7-3.8-9.6-7.6C1.2 46.1-2.8 32.3 2.5 23c2.6-4.6 7.3-7.6 12.4-7.7 3.9-.1 7.4 2.6 9.8 2.6 2.3 0 6.8-3.3 11.5-2.8 2 .1 7.5.8 11 6.1-2.5 1.6-8.8 5.4-8.8 11.6z"/>
              </svg>
            </a>
          </div>

          {/* Google */}
          <div className="w-3/12 max-w-full px-1 mr-auto flex-0"
  onClick={() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("Backend URL not defined");
      return;
    }
    window.location.href = `${backendUrl}/auth/google`;
  }}
>
            <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center 
              uppercase transition-all border rounded-lg cursor-pointer 
              text-xs ease-soft-in tracking-tight-soft hover:scale-105 hover:opacity-80
              text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" height="32" width="24">
                <path fill="#4285F4" d="M58 30c0-2.4-.2-4.2-.6-6H32v12h15.7c-.3 2.6-2 6.8-5.9 9.3l-.1.3 8.7 6.8.6.1C54.6 47.7 58 40.1 58 30z"/>
                <path fill="#34A853" d="M32 59c8 0 14.6-2.6 19.5-7.1l-8.7-6.8c-2.5 1.7-5.9 3-10.8 3-8.1 0-15-5.4-17.3-12.8H4.2v8C9 52.4 19 59 32 59z"/>
                <path fill="#FBBC05" d="M14.2 35.3c-.6-1.9-1-3.9-1-6s.4-4.1 1-6l-.1-.3L4.1 16.1l-.3.1C1.1 20.3 0 24.7 0 29.5s1.1 9.2 3.8 13.2l10.4-7.4z"/>
                <path fill="#EA4335" d="M32 11.4c5.5 0 9.1 2.3 11.2 4.2l8.2-8.1C46.1 2.9 39.4 0 32 0 19 0 9 6.6 4.1 16.3l10.1 7.4C17 16.6 23.6 11.4 32 11.4z"/>
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
          type="text"
          name="name"
          placeholder="Name"
          aria-label="Name"
          value={formData.name}
          onChange={handleChange}
          className="text-sm block w-full rounded-lg border 
          border-gray-300 dark:border-gray-600 
          py-2 px-3 text-gray-800 dark:text-gray-100 
          bg-white dark:bg-neutral-800 
          focus:border-fuchsia-300 focus:outline-none transition-colors duration-300"
        />
      </div>

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
        />
      </div>

      <div className="flex items-center mb-4">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={formData.terms}
          onChange={handleChange}
          className="w-5 h-5 mr-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-neutral-800"
        />
        <label
          htmlFor="terms"
          className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          I agree to the{" "}
          <a className="font-bold text-slate-700 dark:text-slate-100" href="#">
            Terms and Conditions
          </a>
        </label>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="inline-block w-full px-6 py-3 mt-6 mb-2 font-bold text-center text-white 
          uppercase transition-all rounded-lg hover:scale-105 
          bg-gradient-to-tl from-gray-900 to-slate-800 
          hover:opacity-90"
        >
         
        </button>
      </div>

      <p className="mt-4 mb-0 text-sm text-center text-slate-700 dark:text-slate-300">
        Already have an account?{" "}
        <a className="font-bold text-slate-700 dark:text-slate-100" href="/signin">
          Sign in
        </a>
      </p>
    </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
