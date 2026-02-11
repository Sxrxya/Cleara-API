"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Key,
    BarChart3,
    Terminal,
    CreditCard,
    FileText,
    Settings,
    Sparkles,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useState } from "react";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Playground", href: "/playground", icon: Terminal },
    { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
    { name: "Usage", href: "/dashboard/usage", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Documentation", href: "/dashboard/docs", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-slate-950/80 backdrop-blur-xl border-r border-white/5 transition-all duration-300 flex flex-col ${collapsed ? "w-20" : "w-64"
                    }`}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-white/5 service-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        {!collapsed && (
                            <span className="text-xl font-bold text-white tracking-tight">Cleara</span>
                        )}
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-indigo-500/10 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)] border border-indigo-500/10"
                                        : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
                                    }`}
                                title={collapsed ? item.name : undefined}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-white/5 service-border">
                    {!collapsed ? (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 shadow-sm">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                                    JD
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-200 truncate">John Doe</p>
                                    <p className="text-xs text-slate-500 truncate">Pro Plan</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10 pointer-events-none shadow-md">
                                JD
                            </div>
                        </div>
                    )}

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full mt-4 flex items-center justify-center p-2 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>
            </aside>
        </>
    );
}
