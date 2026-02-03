import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#EBF2FE",
                    100: "#D7E5FD",
                    200: "#AFCBFB",
                    300: "#87B1F9",
                    400: "#5F97F7",
                    500: "#2D6CDF", // Main brand color
                    600: "#2456B3",
                    700: "#1B4187",
                    800: "#122B5A",
                    900: "#09162E",
                },
                success: {
                    50: "#E6FBF4",
                    100: "#CCF7E9",
                    200: "#99EFD3",
                    300: "#66E7BD",
                    400: "#33DFA7",
                    500: "#00C482", // Validation green
                    600: "#009D68",
                    700: "#00764E",
                    800: "#004E34",
                    900: "#00271A",
                },
                background: {
                    light: "#F8FAFC",
                    dark: "#0A0A0A",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.5s ease-out",
                "slide-down": "slideDown 0.5s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                slideDown: {
                    "0%": { transform: "translateY(-20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },
            boxShadow: {
                "glow": "0 0 20px rgba(45, 108, 223, 0.3)",
                "glow-success": "0 0 20px rgba(0, 196, 130, 0.3)",
            },
        },
    },
    plugins: [],
};

export default config;
