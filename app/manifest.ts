import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Uranote Itinerary Builder",
        short_name: "Itinerary Builder",
        description:
            "Create and manage travel itineraries for Uranote.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
            {
                src: "/icons/icon.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}