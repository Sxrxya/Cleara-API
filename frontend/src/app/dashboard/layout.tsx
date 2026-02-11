"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="mesh-bg opacity-30 dark:opacity-20" />
            </div>

            <div className="relative z-10 flex">
                <Sidebar />
                <div className="lg:pl-64 flex-1">
                    <Header />
                    <main className="p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
