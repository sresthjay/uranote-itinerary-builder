import { pdf } from "@react-pdf/renderer";

import { Itinerary } from "@/lib/db";
import {
    buildItineraryExportData,
} from "./itineraryExport";
import {
    CustomerItineraryPDF,
    buildItineraryPdfFileName,
} from "./CustomerItineraryPDF";

export async function exportItineraryPdf(
    itinerary: Itinerary
) {
    const data =
        buildItineraryExportData(itinerary);

    const blob = await pdf(
        <CustomerItineraryPDF data={data} />
    ).toBlob();

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    /*
     * Use the centralized filename builder.
     */
    link.download =
        buildItineraryPdfFileName(data);

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
}