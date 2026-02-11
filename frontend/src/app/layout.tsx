import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    title: "Cleara | AI-Powered Data Engine",
    description: "Enterprise-grade data cleaning, validation, and enrichment powered by the Gemini-Groq hybrid engine.",
    keywords: ["data cleaning", "AI", "data validation", "deduplication", "data enrichment", "Gemini", "Groq"],
    icons: {
        icon: "/favicon.ico",
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className={`dark ${inter.variable} ${outfit.variable}`}>
            <body className="font-sans antialiased text-slate-900 dark:text-slate-50 bg-white dark:bg-[#020617]">
                <Providers>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: "rgba(15, 23, 42, 0.8)",
                                color: "#fff",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "16px",
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    );
}
