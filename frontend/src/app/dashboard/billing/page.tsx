"use client";

import { useState } from "react";
import {
    CreditCard,
    Check,
    Zap,
    Crown,
    Building,
    Calendar,
    Download,
} from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "₹0",
        period: "forever",
        description: "Perfect for trying out Cleara",
        features: [
            "500 requests/month",
            "1 project",
            "Community support",
            "Full API access",
            "Basic analytics",
        ],
        current: false,
        icon: Zap,
        color: "gray",
    },
    {
        name: "Pro",
        price: "₹799",
        period: "per month",
        description: "For growing teams and projects",
        features: [
            "100,000 requests/month",
            "5 projects",
            "Priority support",
            "99.9% SLA",
            "Advanced analytics",
            "Custom integrations",
        ],
        current: true,
        icon: Crown,
        color: "primary",
        popular: true,
    },
    {
        name: "Growth",
        price: "₹4,999",
        period: "per month",
        description: "For high-volume applications",
        features: [
            "1,000,000 requests/month",
            "Unlimited projects",
            "Dedicated support",
            "99.95% SLA",
            "Advanced analytics",
            "Custom integrations",
            "Priority features",
        ],
        current: false,
        icon: Building,
        color: "success",
    },
];

const invoices = [
    {
        id: "INV-2026-001",
        date: "Feb 1, 2026",
        amount: "₹799",
        status: "paid",
        plan: "Pro",
    },
    {
        id: "INV-2026-002",
        date: "Jan 1, 2026",
        amount: "₹799",
        status: "paid",
        plan: "Pro",
    },
    {
        id: "INV-2025-012",
        date: "Dec 1, 2025",
        amount: "₹799",
        status: "paid",
        plan: "Pro",
    },
];

export default function BillingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Billing & Subscription
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage your subscription and billing information
                </p>
            </div>

            {/* Current Plan */}
            <div className="card bg-gradient-to-br from-primary-500 to-success-500 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Crown className="w-6 h-6" />
                            <span className="text-sm font-medium opacity-90">Current Plan</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Pro Plan</h2>
                        <p className="opacity-90 mb-4">
                            100,000 requests/month • Priority support • 99.9% SLA
                        </p>
                        <div className="flex items-center space-x-4">
                            <div>
                                <p className="text-sm opacity-75">Next billing date</p>
                                <p className="font-semibold">March 1, 2026</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-75">Amount</p>
                                <p className="font-semibold">₹799/month</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <button className="btn bg-white text-primary-600 hover:bg-gray-100 mb-2">
                            Manage Subscription
                        </button>
                        <p className="text-sm opacity-75">Auto-renews monthly</p>
                    </div>
                </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center space-x-4">
                <span
                    className={`text-sm font-medium ${billingCycle === "monthly"
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                >
                    Monthly
                </span>
                <button
                    onClick={() =>
                        setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${billingCycle === "annual"
                            ? "bg-primary-500"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingCycle === "annual" ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </button>
                <span
                    className={`text-sm font-medium ${billingCycle === "annual"
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                >
                    Annual
                    <span className="ml-2 badge badge-success text-xs">Save 20%</span>
                </span>
            </div>

            {/* Pricing Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                    <div
                        key={plan.name}
                        className={`card relative ${plan.popular
                                ? "ring-2 ring-primary-500 shadow-glow"
                                : ""
                            } ${plan.current ? "opacity-75" : ""}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="badge bg-primary-500 text-white px-4 py-1">
                                    Most Popular
                                </span>
                            </div>
                        )}
                        {plan.current && (
                            <div className="absolute top-4 right-4">
                                <span className="badge badge-success">Current Plan</span>
                            </div>
                        )}
                        <div className="text-center mb-6">
                            <div
                                className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${plan.color === "primary"
                                        ? "bg-primary-100 dark:bg-primary-900/30"
                                        : plan.color === "success"
                                            ? "bg-success-100 dark:bg-success-900/30"
                                            : "bg-gray-100 dark:bg-gray-800"
                                    }`}
                            >
                                <plan.icon
                                    className={`w-6 h-6 ${plan.color === "primary"
                                            ? "text-primary-600 dark:text-primary-400"
                                            : plan.color === "success"
                                                ? "text-success-600 dark:text-success-400"
                                                : "text-gray-600 dark:text-gray-400"
                                        }`}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {plan.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                {plan.description}
                            </p>
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                    {billingCycle === "annual" && plan.price !== "₹0"
                                        ? `₹${Math.floor(parseInt(plan.price.replace("₹", "").replace(",", "")) * 12 * 0.8).toLocaleString()}`
                                        : plan.price}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400 ml-2">
                                    {billingCycle === "annual" && plan.price !== "₹0"
                                        ? "per year"
                                        : plan.period}
                                </span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                    <Check className="w-5 h-5 text-success-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`w-full ${plan.current
                                    ? "btn btn-secondary cursor-not-allowed"
                                    : plan.popular
                                        ? "btn btn-primary"
                                        : "btn btn-outline"
                                }`}
                            disabled={plan.current}
                        >
                            {plan.current ? "Current Plan" : "Upgrade to " + plan.name}
                        </button>
                    </div>
                ))}
            </div>

            {/* Payment Method */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Payment Method
                    </h3>
                    <button className="btn btn-secondary">Update</button>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                            •••• •••• •••• 4242
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Expires 12/2027
                        </p>
                    </div>
                    <span className="badge badge-success">Default</span>
                </div>
            </div>

            {/* Invoice History */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Invoice History
                    </h3>
                    <button className="btn btn-secondary flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download All</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Invoice
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Date
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Plan
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Amount
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Status
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                    <td className="py-3 px-4">
                                        <code className="text-sm font-mono text-gray-900 dark:text-white">
                                            {invoice.id}
                                        </code>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                        {invoice.date}
                                    </td>
                                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                                        {invoice.plan}
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                                        {invoice.amount}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="badge badge-success capitalize">
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
