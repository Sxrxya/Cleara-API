"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <Sidebar />
            <div className="lg:pl-64">
                <Header />
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
