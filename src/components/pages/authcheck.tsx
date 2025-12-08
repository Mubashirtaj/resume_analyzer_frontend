'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function setCookie(name: string, value: string, minutes: number) {
    const d = new Date();
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

export default function MyClientComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const accessToken = searchParams.get("accessToken");
    const [status, setStatus] = useState("initializing");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (accessToken) {
            setStatus("verifying_token");
            setProgress(30);

            // Simulate token verification process
            const verificationTimer = setTimeout(() => {
                setStatus("setting_cookie");
                setProgress(60);
                
                setCookie("atk", accessToken, 1440);
                
                setTimeout(() => {
                    setStatus("redirecting");
                    setProgress(100);
                    
                    // Redirect after a brief moment to show completion
                    setTimeout(() => {
                        router.push("/analyzer");
                    }, 1000);
                }, 800);
            }, 1500);

            return () => clearTimeout(verificationTimer);
        }
    }, [accessToken, router]);

    // Smooth progress bar animation
    useEffect(() => {
        if (progress < 100 && status !== "redirecting") {
            const timer = setTimeout(() => {
                setProgress(prev => Math.min(prev + 1, 100));
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [progress, status]);

    const getStatusMessage = () => {
        switch (status) {
            case "initializing":
                return "Initializing verification...";
            case "verifying_token":
                return "Verifying access token...";
            case "setting_cookie":
                return "Securing your session...";
            case "redirecting":
                return "Redirecting to analyzer...";
            default:
                return "Processing...";
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case "initializing":
                return "text-blue-500";
            case "verifying_token":
                return "text-yellow-500";
            case "setting_cookie":
                return "text-orange-500";
            case "redirecting":
                return "text-green-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto border border-white/20">
                {/* Animated Logo/Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-8 h-8 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                    </div>
                </div>

                {/* Status Text */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Authentication
                    </h1>
                    <div className={`text-lg font-semibold ${getStatusColor()} transition-colors duration-300`}>
                        {getStatusMessage()}
                    </div>
                    {accessToken && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 break-all">
                            Token: {accessToken.substring(0, 20)}...
                        </p>
                    )}
                </div>

                {/* Animated Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Loading Animation */}
                <div className="flex justify-center space-x-2 mb-6">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                    ))}
                </div>

                {/* Security Badge */}
                <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Secure Connection
                    </div>
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1]">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
                <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-150"></div>
            </div>
        </div>
    );
}