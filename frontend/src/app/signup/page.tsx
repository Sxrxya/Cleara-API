"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, Sparkles, Building } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        company: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (!formData.agreeToTerms) {
            toast.error("Please agree to the terms and conditions");
            return;
        }

        setLoading(true);

        try {
            // TODO: Implement actual registration
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success("Account created successfully!");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Signup Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950">
                <div className="w-full max-w-md space-y-8 animate-fade-in">
                    {/* Logo */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-success-500 rounded-2xl mb-4 shadow-glow">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold gradient-text">Cleara</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Start cleaning your data today
                        </p>
                    </div>

                    {/* Signup Form */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Create your account
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        className="input pl-10"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fullName: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        className="input pl-10"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Company */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Company (optional)
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="input pl-10"
                                        placeholder="Acme Inc."
                                        value={formData.company}
                                        onChange={(e) =>
                                            setFormData({ ...formData, company: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="input pl-10 pr-10"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="input pl-10"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) =>
                                            setFormData({ ...formData, confirmPassword: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Terms Agreement */}
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 mt-1 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                                    checked={formData.agreeToTerms}
                                    onChange={(e) =>
                                        setFormData({ ...formData, agreeToTerms: e.target.checked })
                                    }
                                />
                                <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-primary-500 hover:text-primary-600">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-primary-500 hover:text-primary-600">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    "Create account"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-primary-500 hover:text-primary-600"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Benefits */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-success-500 via-primary-500 to-primary-600 p-12 items-center justify-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow animation-delay-400"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-white max-w-lg space-y-8">
                    <h2 className="text-5xl font-bold leading-tight">
                        Start with 500 free requests
                    </h2>
                    <p className="text-xl text-white/90">
                        No credit card required. Upgrade anytime as you scale.
                    </p>
                    <div className="space-y-6">
                        <div className="glass p-6 rounded-2xl">
                            <h3 className="text-2xl font-bold mb-2">Free Tier</h3>
                            <p className="text-white/80">500 requests/month</p>
                            <p className="text-white/80">Community support</p>
                            <p className="text-white/80">Full API access</p>
                        </div>
                        <div className="glass p-6 rounded-2xl">
                            <h3 className="text-2xl font-bold mb-2">Pro - ₹799/mo</h3>
                            <p className="text-white/80">100,000 requests/month</p>
                            <p className="text-white/80">Priority support</p>
                            <p className="text-white/80">99.9% SLA</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
