"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Search */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search resources, API endpoints, or users..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-slate-500 text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-950"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
