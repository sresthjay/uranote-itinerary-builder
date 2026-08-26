import { Itinerary } from "@/lib/db";
import { buildItineraryExportData } from "./itineraryExport";

export function exportItineraryJson(
    itinerary: Itinerary
) {
    const data = buildItineraryExportData(itinerary);

    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], {
        type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${itinerary.title
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase()}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}