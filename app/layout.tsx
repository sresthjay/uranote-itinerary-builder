import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ThemeProvider from "@/components/ThemeProvider";

const themeInitScript = `(function(){try{var t=localStorage.getItem("uranote-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}}catch(e){}})();`;

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    applicationName: "Uranote Itinerary Builder",
    title: "Uranote Itinerary Builder",
    description: "Create, manage and export travel itineraries with Uranote.",
    appleWebApp: {
        capable: true,
        title: "Uranote Itinerary Builder",
        statusBarStyle: "default",
    },
    icons: {
        apple: "/icons/icon.png",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#020617" },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
        >
            <body className="min-h-screen">
                <script
                    dangerouslySetInnerHTML={{
                        __html: themeInitScript,
                    }}
                />
                <ThemeProvider>
                    {children}
                </ThemeProvider>
                <ServiceWorkerRegister />
            </body>
        </html>
    );
}