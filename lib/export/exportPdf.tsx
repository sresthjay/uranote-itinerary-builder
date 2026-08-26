import { pdf } from "@react-pdf/renderer";

import { Itinerary } from "@/lib/db";
import {
    buildItineraryExportData,
} from "./itineraryExport";
import {
    CustomerItineraryPDF,
    buildItineraryPdfFileName,
} from "./CustomerItineraryPDF";

/*
|--------------------------------------------------------------------------
| Convert an image URL to a data URL
|--------------------------------------------------------------------------
|
| react-pdf is much more reliable with base64/data URLs than browser-hosted
| image URLs such as:
|
| http://localhost:3000/firms/uranote-holidays/qr.png
|
*/

async function imageUrlToDataUrl(
    imageUrl?: string
): Promise<string | undefined> {
    if (!imageUrl) {
        return undefined;
    }

    /*
     * Already a data URL.
     */
    if (imageUrl.startsWith("data:image/")) {
        return imageUrl;
    }

    try {
        const response = await fetch(imageUrl, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(
                "Failed to load PDF image:",
                imageUrl,
                response.status
            );

            return undefined;
        }

        const blob = await response.blob();

        return await new Promise<string | undefined>(
            (resolve) => {
                const reader =
                    new FileReader();

                reader.onloadend = () => {
                    if (
                        typeof reader.result ===
                        "string"
                    ) {
                        resolve(reader.result);
                    } else {
                        resolve(undefined);
                    }
                };

                reader.onerror = () => {
                    resolve(undefined);
                };

                reader.readAsDataURL(blob);
            }
        );
    } catch (error) {
        console.error(
            "Error converting PDF image to data URL:",
            imageUrl,
            error
        );

        return undefined;
    }
}

/*
|--------------------------------------------------------------------------
| Export itinerary PDF
|--------------------------------------------------------------------------
*/

export async function exportItineraryPdf(
    itinerary: Itinerary
) {
    const data =
        buildItineraryExportData(itinerary);

    /*
     * Prepare QR code for react-pdf.
     *
     * The QR may currently be something like:
     *
     * /firms/uranote-holidays/qr.png
     *
     * or:
     *
     * http://localhost:3000/firms/uranote-holidays/qr.png
     *
     * Convert it to a data URL before rendering.
     */

    const qrCode =
        data.paymentDetails
            ?.bankDetails
            ?.upiQrCode;

    if (qrCode) {
        let qrUrl = qrCode;

        /*
         * Convert relative paths into absolute browser URLs.
         */
        if (
            !qrCode.startsWith("http://") &&
            !qrCode.startsWith("https://") &&
            !qrCode.startsWith("data:image/")
        ) {
            if (qrCode.startsWith("/")) {
                qrUrl =
                    `${window.location.origin}${qrCode}`;
            } else {
                qrUrl =
                    `${window.location.origin}/${qrCode}`;
            }
        }

        const qrDataUrl =
            await imageUrlToDataUrl(qrUrl);

        /*
         * Put the converted image back into the
         * export data.
         */
        if (
            qrDataUrl &&
            data.paymentDetails?.bankDetails
        ) {
            data.paymentDetails.bankDetails.upiQrCode =
                qrDataUrl;
        }
    }

    const blob = await pdf(
        <CustomerItineraryPDF data={data} />
    ).toBlob();

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        buildItineraryPdfFileName(data);

    document.body.appendChild(link);

    link.click();

    link.remove();

    /*
     * Give the browser a moment before
     * releasing the object URL.
     */
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}