"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Layers, ArrowRight, Github, Chrome, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("demo@cleara.com");
    const [password, setPassword] = useState("demo123");
    const [fullName, setFullName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (isLogin) {
                // Login logic
                const response = await fetch("http://localhost:8000/v1/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        username: email,
                        password: password,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Login failed");
                }

                const data = await response.json();

                // Store token
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("user_email", email);

                // Redirect to dashboard
                router.push("/dashboard");
            } else {
                // Signup logic (placeholder - backend needs signup endpoint)
                setError("Signup not yet implemented. Please use demo credentials.");
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setEmail("demo@cleara.com");
        setPassword("demo123");
        setError("");

        // Auto-submit after setting values
        setTimeout(() => {
            const form = document.querySelector('form');
            if (form) {
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        }, 100);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            {/* Background Mesh */}
            <div className="mesh-bg opacity-20" />

            {/* Background Shapes */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-float" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-md space-y-8 animate-reveal">
                {/* Logo Header */}
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Layers className="text-white w-7 h-7" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Cleara</span>
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">{isLogin ? "Welcome back" : "Create your account"}</h1>
                        <p className="text-gray-500 text-sm">
                            {isLogin ? "Enter your credentials to access the console." : "Start cleaning your data for free today."}
                        </p>
                    </div>
                </div>

                {/* Demo Credentials Banner */}
                {isLogin && (
                    <div className="card-premium !p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                <Layers className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Demo Credentials</p>
                                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                                    Email: <code className="bg-indigo-100 dark:bg-indigo-800 px-2 py-0.5 rounded">demo@cleara.com</code>
                                    <br />
                                    Password: <code className="bg-indigo-100 dark:bg-indigo-800 px-2 py-0.5 rounded">demo123</code>
                                </p>
                                <button
                                    onClick={handleDemoLogin}
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Auto-fill demo credentials →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="card-premium !p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
                        </div>
                    </div>
                )}

                {/* Login Card */}
                <div className="card-premium glass-dark !p-8 shadow-2xl space-y-6">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 outline-none focus:border-indigo-500/50 transition-colors"
                                        required={!isLogin}
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 outline-none focus:border-indigo-500/50 transition-colors"
                                    required
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Mail className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between px-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                                {isLogin && <button type="button" className="text-[10px] text-indigo-500 hover:underline">Forgot password?</button>}
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 outline-none focus:border-indigo-500/50 transition-colors"
                                    required
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Lock className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-premium w-full !py-3 !text-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isLogin ? "Signing in..." : "Creating account..."}
                                </>
                            ) : (
                                <>
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-4">
                        <div className="h-px bg-white/5 flex-1" />
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">or continue with</span>
                        <div className="h-px bg-white/5 flex-1" />
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="btn-glass !py-2.5 !text-xs" disabled>
                            <Github className="w-4 h-4" />
                            GitHub
                        </button>
                        <button className="btn-glass !py-2.5 !text-xs" disabled>
                            <Chrome className="w-4 h-4" />
                            Google
                        </button>
                    </div>
                </div>

                {/* Mode Toggle */}
                <p className="text-center text-sm text-gray-500">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}
                        className="ml-2 text-indigo-500 font-bold hover:underline"
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>

            {/* Footer Links */}
            <footer className="absolute bottom-8 text-center w-full text-[10px] text-gray-500 uppercase tracking-widest space-x-6">
                <Link href="/terms" className="hover:text-indigo-400">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-indigo-400">Privacy Policy</Link>
                <Link href="/docs" className="hover:text-indigo-400">Help Center</Link>
            </footer>
        </div>
    );
}
