import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

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
    themeColor: "#ffffff",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
        >
            <body className="min-h-screen">
                {children}
                <ServiceWorkerRegister />
            </body>
        </html>
    );
}