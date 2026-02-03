import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Cleara - AI-Powered Data Cleaning Platform",
    description: "Make your data make sense. Clean, validate, deduplicate, and enrich your data with AI.",
    keywords: ["data cleaning", "AI", "data validation", "deduplication", "data enrichment"],
    authors: [{ name: "Cleara Team" }],
    openGraph: {
        title: "Cleara - AI-Powered Data Cleaning Platform",
        description: "Make your data make sense.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: "#363636",
                                color: "#fff",
                            },
                            success: {
                                iconTheme: {
                                    primary: "#00C482",
                                    secondary: "#fff",
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: "#ef4444",
                                    secondary: "#fff",
                                },
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    );
}
