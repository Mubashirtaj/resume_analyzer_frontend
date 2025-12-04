"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface VerifyPageProps {
  params: {
    id: string;
  };
}

const VerifyPage = () => {
  const router = useRouter();
   const params = useParams();
  const userId = params.id;
  console.log(userId);
  
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle paste OTP
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split("");
      setOtp(otpArray.slice(0, 6));
      
      // Focus last input after paste
      setTimeout(() => {
        const lastInput = document.getElementById("otp-5");
        if (lastInput) lastInput.focus();
      }, 0);
    }
  };

  // Handle key down for navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Verify OTP
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`,
        {
          id:userId,
          otp: otpString
        },
        {
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log("Verify Response:", data);

      if (data.success) {
        setMessage("Verification successful! Redirecting...");
        
        // Store access token if provided
        if (data.accessToken) {
          setCookie("atk", data.accessToken, 1440);
        }
        
        setTimeout(() => {
          router.push("/analyzer");
        }, 1500);
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (error: any) {
      console.error("Verify Error:", error);
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-otp`,
        { id:userId },
        {
          withCredentials: true,
        }
      );

      const data = response.data;
      
      if (data.success) {
        setMessage("New OTP sent to your email!");
        setCountdown(30); // Reset countdown
        setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
        
        // Focus first input
        setTimeout(() => {
          const firstInput = document.getElementById("otp-0");
          if (firstInput) firstInput.focus();
        }, 0);
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      console.error("Resend Error:", error);
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // Helper function to set cookie
  const setCookie = (name: string, value: string, minutes: number) => {
    const d = new Date();
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Verify Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            We've sent a 6-digit verification code to your email
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            User ID: {userId}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-neutral-700">
          {/* Messages */}
          {message && (
            <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300 text-sm">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleVerify}>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Enter Verification Code
              </label>
              
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="\d"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2
                      border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-neutral-900
                      text-gray-800 dark:text-gray-100
                      focus:border-blue-500 dark:focus:border-blue-400 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20
                      transition-all duration-200"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || resendLoading}
                  className={`font-medium ${
                    countdown > 0 || resendLoading
                      ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                  }`}
                >
                  {resendLoading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:from-blue-700 hover:to-indigo-700 
                text-white font-medium rounded-lg 
                transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                dark:focus:ring-offset-neutral-900"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : "Verify Account"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <Link
                href="/signin"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:underline"
              >
                ← Back to Sign In
              </Link>
              
              <Link
                href="/signup"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:underline"
              >
                Need an account? Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Having trouble? Contact{" "}
            <a href="mailto:support@example.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;