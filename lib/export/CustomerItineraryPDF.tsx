"use client";

import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";

import { renderItineraryContent } from "./renderItineraryContent";

/*
|--------------------------------------------------------------------------
| Fonts
|--------------------------------------------------------------------------
*/

Font.register({
    family: "Cormorant Garamond",
    fonts: [
        {
            src: "/fonts/CormorantGaramond-Regular.ttf",
            fontWeight: 400,
        },
        {
            src: "/fonts/CormorantGaramond-SemiBold.ttf",
            fontWeight: 600,
        },
    ],
});

Font.register({
    family: "Montserrat",
    fonts: [
        {
            src: "/fonts/Montserrat-Regular.ttf",
            fontWeight: 400,
        },
        {
            src: "/fonts/Montserrat-Medium.ttf",
            fontWeight: 500,
        },
        {
            src: "/fonts/Montserrat-SemiBold.ttf",
            fontWeight: 600,
        },
    ],
});

/*
|--------------------------------------------------------------------------
| Colors
|--------------------------------------------------------------------------
*/

export const colors = {
    teal: "#164E52",
    tealDark: "#103C3F",
    tealLight: "#EAF3F2",

    amber: "#C8923E",
    amberLight: "#F8F0E3",

    text: "#191c1e",
    textLight: "#514040",
    muted: "#899398",

    border: "#E2E8E8",
    background: "#F7F9F8",

    white: "#FFFFFF",
};

/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
    page: {
        paddingTop: 42,
        paddingBottom: 55,
        paddingHorizontal: 44,

        fontFamily: "Montserrat",
        fontSize: 11,

        color: colors.text,
        lineHeight: 1.75,

        backgroundColor: colors.white,
    },

    /*
    |--------------------------------------------------------------------------
    | Header
    |--------------------------------------------------------------------------
    */

    header: {
        flexDirection: "row",

        width: "100%",

        marginBottom: 30,
        paddingBottom: 14,

        borderBottomWidth: 1,
        borderBottomColor: colors.border,

        alignItems: "center",
        justifyContent: "space-between",
    },

    headerContent: {
        flex: 1,
        paddingRight: 15,
    },

    brand: {
        fontFamily: "Montserrat",
        fontSize: 20,
        fontWeight: 600,

        color: colors.teal,

        letterSpacing: 1.1,
        lineHeight: 1.25,
    },

    subtitle: {
        marginTop: 3,

        fontFamily: "Montserrat",
        fontSize: 10,

        color: colors.muted,

        letterSpacing: 0.5,
        lineHeight: 1.3,
    },

    headerContact: {
        marginTop: 7,

        fontFamily: "Montserrat",
        fontSize: 8.5,
        fontWeight: 400,

        color: colors.textLight,

        lineHeight: 1.4,
    },

    /*
    |--------------------------------------------------------------------------
    | Logo
    |--------------------------------------------------------------------------
    */

    logoContainer: {
        width: 75,
        height: 75,

        alignItems: "flex-end",
        justifyContent: "center",
    },

    logo: {
        width: 70,
        height: 70,

        objectFit: "contain",
    },

    /*
    |--------------------------------------------------------------------------
    | Sections
    |--------------------------------------------------------------------------
    */

    section: {
        marginBottom: 22,
    },

    sectionTitle: {
        fontFamily: "Montserrat",
        fontSize: 12,
        fontWeight: 600,

        color: colors.teal,

        marginBottom: 9,

        textTransform: "uppercase",
        letterSpacing: 0.7,

        lineHeight: 1.3,
    },

    /*
    |--------------------------------------------------------------------------
    | Tour Identity
    |--------------------------------------------------------------------------
    */

    tourNameSection: {
        marginTop: 2,
        marginBottom: 24,
        paddingBottom: 14,

        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    tourNameLabel: {
        fontFamily: "Montserrat",
        fontSize: 12,
        fontWeight: 600,

        color: colors.teal,

        marginBottom: 6,

        textTransform: "uppercase",
        letterSpacing: 1,

        lineHeight: 1.2,
    },

    tourName: {
        fontFamily: "Cormorant Garamond",
        fontSize: 23,
        fontWeight: 600,

        color: colors.amber,

        lineHeight: 1.2,
    },

    /*
    |--------------------------------------------------------------------------
    | Document Dates
    |--------------------------------------------------------------------------
    */

    documentDates: {
        flexDirection: "row",

        marginTop: 9,

        alignItems: "center",
    },

    documentDate: {
        fontFamily: "Montserrat",
        fontSize: 8,

        color: colors.textLight,

        lineHeight: 1.3,
    },

    documentDateSeparator: {
        marginHorizontal: 7,

        fontFamily: "Montserrat",
        fontSize: 8,

        color: colors.border,
    },

    /*
    |--------------------------------------------------------------------------
    | Trip Details
    |--------------------------------------------------------------------------
    */

    infoCard: {
        padding: 14,

        backgroundColor: colors.tealLight,

        borderRadius: 7,

        borderWidth: 1,
        borderColor: "#D7E7E5",
    },

    infoRow: {
        flexDirection: "row",

        width: "100%",

        marginBottom: 12,
    },

    infoRowLast: {
        marginBottom: 0,
    },

    infoItemLeft: {
        width: "48%",
        paddingRight: 12,
    },

    infoItemRight: {
        width: "52%",
        paddingLeft: 8,
    },

    label: {
        fontFamily: "Montserrat",
        fontSize: 8.5,
        fontWeight: 600,

        color: colors.muted,

        marginBottom: 4,

        textTransform: "uppercase",
        letterSpacing: 0.7,

        lineHeight: 1.2,
    },

    value: {
        fontFamily: "Montserrat",
        fontSize: 10,
        fontWeight: 500,

        color: colors.text,

        lineHeight: 1.45,
    },

    /*
    |--------------------------------------------------------------------------
    | Quotation
    |--------------------------------------------------------------------------
    */

    quotationCard: {
        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: 7,

        overflow: "hidden",
    },

    quotationHeader: {
        paddingHorizontal: 13,
        paddingVertical: 9,

        backgroundColor: colors.amberLight,

        borderBottomWidth: 1,
        borderBottomColor: "#EEDFC7",
    },

    quotationHeaderText: {
        fontFamily: "Montserrat",
        fontSize: 10,
        fontWeight: 600,

        color: colors.amber,

        textTransform: "uppercase",
        letterSpacing: 0.8,

        lineHeight: 1.2,
    },

    quotationDetailRow: {
        flexDirection: "row",

        width: "100%",

        paddingHorizontal: 13,
        paddingVertical: 10,

        borderBottomWidth: 1,
        borderBottomColor: colors.border,

        minHeight: 34,
    },

    quotationDetailLabel: {
        width: "20%",

        fontFamily: "Montserrat",
        fontSize: 8.5,
        fontWeight: 600,

        color: colors.muted,

        lineHeight: 1.4,
    },

    quotationDetailValue: {
        width: "48%",

        paddingRight: 10,

        fontFamily: "Montserrat",
        fontSize: 9.8,
        fontWeight: 500,

        color: colors.text,

        lineHeight: 1.4,
    },

    quotationDetailPrice: {
        width: "32%",

        fontFamily: "Montserrat",
        fontSize: 11,
        fontWeight: 600,

        color: colors.teal,

        textAlign: "right",

        lineHeight: 1.4,
    },

    quoteRowLast: {
        borderBottomWidth: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | Hotels
    |--------------------------------------------------------------------------
    */

    hotelSection: {
        marginBottom: 10,
    },

    hotel: {
        padding: 11,

        marginBottom: 8,

        backgroundColor: colors.background,

        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: 7,
    },

    hotelName: {
        fontFamily: "Montserrat",
        fontSize: 10.5,
        fontWeight: 600,

        color: colors.teal,

        marginBottom: 4,

        lineHeight: 1.35,
    },

    hotelDestination: {
        fontFamily: "Montserrat",
        fontSize: 9.5,

        color: colors.amber,

        marginBottom: 2,

        lineHeight: 1.4,
    },

    hotelDetail: {
        fontFamily: "Montserrat",
        fontSize: 9.5,

        color: colors.textLight,

        marginBottom: 2,

        lineHeight: 1.4,
    },

    /*
    |--------------------------------------------------------------------------
    | Itinerary
    |--------------------------------------------------------------------------
    */

    itinerarySection: {
        marginTop: 18,
        marginBottom: 20,
    },

    itineraryHeading: {
        fontFamily: "Cormorant Garamond",
        fontSize: 25,
        fontWeight: 600,

        color: colors.amber,

        marginBottom: 15,

        lineHeight: 1.15,
    },

    /*
    |--------------------------------------------------------------------------
    | Important Information
    |--------------------------------------------------------------------------
    */

    termsSection: {
        marginTop: 0,
    },

    termsBlock: {
        marginBottom: 18,
    },

    termsTitle: {
        fontFamily: "Montserrat",
        fontSize: 10,
        fontWeight: 600,

        color: colors.amber,

        marginBottom: 7,

        textTransform: "uppercase",
        letterSpacing: 0.7,

        lineHeight: 1.3,
    },

    bulletRow: {
        flexDirection: "row",

        width: "100%",

        marginBottom: 5,

        paddingRight: 5,
    },

    bullet: {
        width: 12,

        fontFamily: "Montserrat",
        fontSize: 11,

        color: colors.amber,

        lineHeight: 1.5,
    },

    bulletText: {
        width: "92%",

        fontFamily: "Montserrat",
        fontSize: 10,

        color: colors.text,

        lineHeight: 1.55,
    },

    /*
|--------------------------------------------------------------------------
| Payment Details
|--------------------------------------------------------------------------
*/

    paymentDetailsCard: {
        marginTop: 4,

        padding: 13,

        backgroundColor: colors.background,

        borderWidth: 1,
        borderColor: colors.border,

        borderRadius: 7,
    },

    paymentMethodsLabel: {
        fontFamily: "Montserrat",
        fontSize: 8.5,
        fontWeight: 600,

        color: colors.muted,

        marginBottom: 5,

        textTransform: "uppercase",
        letterSpacing: 0.7,

        lineHeight: 1.2,
    },

    paymentMethods: {
        fontFamily: "Montserrat",
        fontSize: 9.5,
        fontWeight: 500,

        color: colors.text,

        marginBottom: 12,

        lineHeight: 1.4,
    },

    paymentRow: {
        flexDirection: "row",

        width: "100%",

        marginBottom: 5,
    },

    paymentLabel: {
        width: "32%",

        fontFamily: "Montserrat",
        fontSize: 8.5,
        fontWeight: 600,

        color: colors.muted,

        lineHeight: 1.4,
    },

    paymentValue: {
        width: "68%",

        fontFamily: "Montserrat",
        fontSize: 9.5,
        fontWeight: 500,

        color: colors.text,

        lineHeight: 1.4,
    },

    paymentUpi: {
        fontFamily: "Montserrat",
        fontSize: 9.5,
        fontWeight: 600,

        color: colors.teal,

        lineHeight: 1.4,
    },

    paymentQrContainer: {
        marginTop: 10,

        alignItems: "flex-start",
    },

    paymentQr: {
        width: 100,
        height: 100,

        objectFit: "contain",
    },

    /*
    |--------------------------------------------------------------------------
    | Footer
    |--------------------------------------------------------------------------
    */

    footerContainer: {
        position: "absolute",

        left: 44,
        right: 44,
        bottom: 12,

        height: 28,

        alignItems: "center",
        justifyContent: "flex-end",
    },

    footerLine: {
        width: "100%",

        borderTopWidth: 1,
        borderTopColor: colors.border,

        marginBottom: 6,
    },

    footer: {
        fontFamily: "Montserrat",
        fontSize: 9,

        color: colors.muted,

        textAlign: "center",

        lineHeight: 1.3,
    },
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatDate(date: string) {
    if (!date) return "";

    const value = new Date(`${date}T00:00:00`);

    if (Number.isNaN(value.getTime())) {
        return "";
    }

    return value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/*
|--------------------------------------------------------------------------
| Format DateTime
|--------------------------------------------------------------------------
|
| Used for document creation/modification timestamps.
|
*/

function formatDateTime(date?: string) {
    if (!date) return "";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "";
    }

    return value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatCurrency(value?: number) {
    if (
        value === undefined ||
        value === null ||
        value <= 0
    ) {
        return "";
    }

    return `₹${value.toLocaleString("en-IN")}`;
}

function normalizeList(
    value?: string | string[]
): string[] {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }

    return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| Resolve Logo
|--------------------------------------------------------------------------
|
| react-pdf is more reliable when image paths are absolute.
|
| Supports:
| - https://...
| - data:image/...
| - /logos/...
| - logos/...
|
*/

function resolveImageSource(
    source?: string
): string | null {
    if (!source) {
        return null;
    }

    const value = source.trim();

    if (!value) {
        return null;
    }

    // Already an absolute URL or data URI.
    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("data:image/")
    ) {
        return value;
    }

    // Browser-side export.
    if (typeof window !== "undefined") {
        const path = value.startsWith("/")
            ? value
            : `/${value}`;

        return `${window.location.origin}${path}`;
    }

    // SSR fallback.
    return value.startsWith("/")
        ? value
        : `/${value}`;
}

/*
|--------------------------------------------------------------------------
| Filename Helpers
|--------------------------------------------------------------------------
*/

function toTitleCase(value: string) {
    return value
        .trim()
        .split(/\s+/)
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join("-");
}

function cleanFilePart(value: string) {
    return value
        .trim()
        .replace(/[<>:"/\\|?*]+/g, "")
        .replace(/\s+/g, "-");
}

export function buildItineraryPdfFileName(
    data: ExportData
) {
    const customerName = cleanFilePart(
        toTitleCase(
            data.trip.customerName || "Traveler"
        )
    );

    const destination = cleanFilePart(
        toTitleCase(
            data.trip.destination || "Trip"
        )
    );

    const date = data.trip.startDate
        ? new Date(
            `${data.trip.startDate}T00:00:00`
        )
        : null;

    const datePart =
        date && !Number.isNaN(date.getTime())
            ? date
                .toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                .replace(/\s+/g, "-")
            : "";

    const itineraryText =
        data.itinerary.content || "";

    /*
     * Extract duration from the itinerary if available.
     *
     * Expected examples:
     * 8N 9D
     * 8 N 9 D
     * 8 nights 9 days
     */

    const durationMatch =
        itineraryText.match(
            /(\d+)\s*N[\s-]*(\d+)\s*D/i
        );

    const durationPart = durationMatch
        ? `${durationMatch[1]}N-${durationMatch[2]}D`
        : "";

    return [
        customerName,
        destination,
        datePart,
        durationPart,
    ]
        .filter(Boolean)
        .join("-") + ".pdf";
}

/*
|--------------------------------------------------------------------------
| Export Data
|--------------------------------------------------------------------------
*/

type ExportData = ReturnType<
    typeof import("./itineraryExport")
    .buildItineraryExportData
>;

/*
|--------------------------------------------------------------------------
| Reusable Footer
|--------------------------------------------------------------------------
*/

function PDFHeaderFooter({
    data,
}: {
    data: ExportData;
}) {
    const footerItems = [
        data.meta.firmName,
        data.meta.firmPhone,
        data.meta.firmEmail,
        data.meta.firmWebsite,
    ].filter(Boolean);

    if (!footerItems.length) {
        return null;
    }

    return (
        <View
            style={styles.footerContainer}
            fixed
        >
            <View style={styles.footerLine} />

            <Text style={styles.footer}>
                {footerItems.join(" · ")}
            </Text>
        </View>
    );
}

/*
|--------------------------------------------------------------------------
| Bullet List
|--------------------------------------------------------------------------
*/

function BulletList({
    items,
}: {
    items: string[];
}) {
    if (!items.length) return null;

    return (
        <View>
            {items.map((item, index) => (
                <View
                    key={index}
                    style={styles.bulletRow}
                >
                    <Text style={styles.bullet}>
                        •
                    </Text>

                    <Text style={styles.bulletText}>
                        {item}
                    </Text>
                </View>
            ))}
        </View>
    );
}

/*
|--------------------------------------------------------------------------
| Customer Itinerary PDF
|--------------------------------------------------------------------------
*/

export function CustomerItineraryPDF({
    data,
}: {
    data: ExportData;
}) {
    const inclusions = normalizeList(
        data.inclusions
    );

    const exclusions = normalizeList(
        data.exclusions
    );

    const terms = normalizeList(
        data.terms
    );

    const hasPolicies =
        data.paymentPolicy.length > 0 ||
        data.cancellationPolicy.length > 0 ||
        terms.length > 0;

    const hasQuotation =
        data.quotation.vehicles.length > 0 ||
        Boolean(data.quotation.package);

    const logoSource = resolveImageSource(
        data.meta.logo
    );

    const paymentQrSource = resolveImageSource(
        data.paymentDetails?.bankDetails?.upiQrCode
    );

    const createdDate = formatDateTime(
        data.trip.createdAt
    );

    const modifiedDate = formatDateTime(
        data.trip.updatedAt
    );

    console.log("PDF LOGO:", logoSource);
    console.log(
        "PDF QR:",
        data.paymentDetails?.bankDetails?.upiQrCode
    );
    console.log("PDF QR SOURCE:", paymentQrSource);

    return (
        <Document>
            <Page
                size="A4"
                style={styles.page}
                wrap
            >
                {/* ========================================================
                    HEADER
                ======================================================== */}

                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        {data.meta.firmName && (
                            <Text style={styles.brand}>
                                {data.meta.firmName}
                            </Text>
                        )}

                        {data.meta.regionName && (
                            <Text style={styles.subtitle}>
                                {data.meta.regionName}
                            </Text>
                        )}

                        {(data.meta.firmPhone ||
                            data.meta.firmEmail) && (
                                <Text style={styles.headerContact}>
                                    {[
                                        data.meta.firmPhone,
                                        data.meta.firmEmail,
                                    ]
                                        .filter(Boolean)
                                        .join("  ·  ")}
                                </Text>
                            )}
                    </View>

                    {logoSource && (
                        <View
                            style={
                                styles.logoContainer
                            }
                        >
                            <Image
                                src={logoSource}
                                style={styles.logo}
                            />
                        </View>
                    )}
                </View>

                {/* ========================================================
                    TOUR IDENTITY
                ======================================================== */}

                <View style={styles.tourNameSection}>
                    <Text style={styles.tourNameLabel}>
                        Tour Name
                    </Text>

                    <Text style={styles.tourName}>
                        {data.trip.destination}
                    </Text>

                    {(createdDate || modifiedDate) && (
                        <View style={styles.documentDates}>
                            {createdDate && (
                                <Text style={styles.documentDate}>
                                    Created: {createdDate}
                                </Text>
                            )}

                            {createdDate &&
                                modifiedDate && (
                                    <Text
                                        style={
                                            styles.documentDateSeparator
                                        }
                                    >
                                        ·
                                    </Text>
                                )}

                            {modifiedDate && (
                                <Text style={styles.documentDate}>
                                    Modified: {modifiedDate}
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {/* ========================================================
                    TRIP DETAILS
                ======================================================== */}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Trip Details
                    </Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View
                                style={
                                    styles.infoItemLeft
                                }
                            >
                                <Text style={styles.label}>
                                    Traveler
                                </Text>

                                <Text style={styles.value}>
                                    {data.trip
                                        .customerName ||
                                        "—"}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.infoItemRight
                                }
                            >
                                <Text style={styles.label}>
                                    Travel Dates
                                </Text>

                                <Text style={styles.value}>
                                    {formatDate(
                                        data.trip
                                            .startDate
                                    )}{" "}
                                    –{" "}
                                    {formatDate(
                                        data.trip
                                            .endDate
                                    )}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.infoRow,
                                styles.infoRowLast,
                            ]}
                        >
                            <View
                                style={
                                    styles.infoItemLeft
                                }
                            >
                                <Text style={styles.label}>
                                    Travelers
                                </Text>

                                <Text style={styles.value}>
                                    {data.trip.pax} Pax
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.infoItemRight
                                }
                            >
                                <Text style={styles.label}>
                                    Service
                                </Text>

                                <Text style={styles.value}>
                                    {data.meta.serviceName ||
                                        "—"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ========================================================
                    INITIAL QUOTATION
                ======================================================== */}

                {hasQuotation && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Quotation Details
                        </Text>

                        <View
                            style={
                                styles.quotationCard
                            }
                        >
                            <View
                                style={
                                    styles.quotationHeader
                                }
                            >
                                <Text
                                    style={
                                        styles.quotationHeaderText
                                    }
                                >
                                    Travel Arrangement
                                </Text>
                            </View>

                            {data.quotation.vehicles.map(
                                (
                                    vehicle,
                                    index
                                ) => {
                                    const isLast =
                                        index ===
                                        data
                                            .quotation
                                            .vehicles
                                            .length -
                                        1 &&
                                        !data
                                            .quotation
                                            .package;

                                    return (
                                        <View
                                            key={
                                                vehicle.vehicleId
                                            }
                                            style={[
                                                styles.quotationDetailRow,
                                                isLast
                                                    ? styles.quoteRowLast
                                                    : {},
                                            ]}
                                            wrap={false}
                                        >
                                            <Text
                                                style={
                                                    styles.quotationDetailLabel
                                                }
                                            >
                                                Vehicle:
                                            </Text>

                                            <Text
                                                style={
                                                    styles.quotationDetailValue
                                                }
                                            >
                                                {
                                                    vehicle.name
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.quotationDetailPrice
                                                }
                                            >
                                                {formatCurrency(
                                                    vehicle.price
                                                )}
                                            </Text>
                                        </View>
                                    );
                                }
                            )}

                            {data.quotation.package && (
                                <View
                                    style={[
                                        styles.quotationDetailRow,
                                        styles.quoteRowLast,
                                    ]}
                                    wrap={false}
                                >
                                    <Text
                                        style={
                                            styles.quotationDetailLabel
                                        }
                                    >
                                        Package:
                                    </Text>

                                    <Text
                                        style={
                                            styles.quotationDetailValue
                                        }
                                    >
                                        {
                                            data
                                                .quotation
                                                .package
                                                .name
                                        }{" "}
                                        Package
                                    </Text>

                                    <Text
                                        style={
                                            styles.quotationDetailPrice
                                        }
                                    >
                                        {formatCurrency(
                                            data
                                                .quotation
                                                .package
                                                .price
                                        )}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* ========================================================
                    STAY DETAILS
                ======================================================== */}

                {data.hotels.length > 0 && (
                    <View
                        style={styles.hotelSection}
                    >
                        <Text style={styles.sectionTitle}>
                            Stay Details
                        </Text>

                        {data.hotels.map(
                            (hotel, index) => (
                                <View
                                    key={index}
                                    style={styles.hotel}
                                    wrap={false}
                                >
                                    <Text
                                        style={
                                            styles.hotelName
                                        }
                                    >
                                        {hotel.name ||
                                            hotel.destination}
                                    </Text>

                                    <Text
                                        style={
                                            styles.hotelDestination
                                        }
                                    >
                                        {
                                            hotel.destination
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.hotelDetail
                                        }
                                    >
                                        {formatDate(
                                            hotel.checkIn
                                        )}{" "}
                                        –{" "}
                                        {formatDate(
                                            hotel.checkOut
                                        )}
                                    </Text>

                                    {hotel.roomType && (
                                        <Text
                                            style={
                                                styles.hotelDetail
                                            }
                                        >
                                            Room:{" "}
                                            {
                                                hotel.roomType
                                            }
                                        </Text>
                                    )}

                                    {hotel.mealPlan && (
                                        <Text
                                            style={
                                                styles.hotelDetail
                                            }
                                        >
                                            Meal Plan:{" "}
                                            {
                                                hotel.mealPlan
                                            }
                                        </Text>
                                    )}
                                </View>
                            )
                        )}
                    </View>
                )}

                {/* ========================================================
                    ITINERARY
                ======================================================== */}

                <View
                    style={styles.itinerarySection}
                >
                    <Text
                        style={
                            styles.itineraryHeading
                        }
                    >
                        Your Itinerary
                    </Text>

                    {renderItineraryContent(
                        data.itinerary.content
                    )}
                </View>

                {/* ========================================================
                    IMPORTANT INFORMATION
                ======================================================== */}

                {(inclusions.length > 0 ||
                    exclusions.length > 0 ||
                    hasPolicies) && (
                        <View style={styles.termsSection}>
                            <Text
                                style={
                                    styles.itineraryHeading
                                }
                            >
                                Important Information
                            </Text>

                            {/* Inclusions */}

                            {inclusions.length > 0 && (
                                <View
                                    style={styles.termsBlock}
                                >
                                    <Text
                                        style={
                                            styles.termsTitle
                                        }
                                    >
                                        Inclusions
                                    </Text>

                                    <BulletList
                                        items={inclusions}
                                    />
                                </View>
                            )}

                            {/* Exclusions */}

                            {exclusions.length > 0 && (
                                <View
                                    style={styles.termsBlock}
                                >
                                    <Text
                                        style={
                                            styles.termsTitle
                                        }
                                    >
                                        Exclusions
                                    </Text>

                                    <BulletList
                                        items={exclusions}
                                    />
                                </View>
                            )}

                            {/* Payment Policy */}

                            {data.paymentPolicy.length >
                                0 && (
                                    <View
                                        style={styles.termsBlock}
                                    >
                                        <Text
                                            style={
                                                styles.termsTitle
                                            }
                                        >
                                            Payment Policy
                                        </Text>

                                        <BulletList
                                            items={
                                                data.paymentPolicy
                                            }
                                        />
                                    </View>
                                )}

                            {/* Payment Details */}

                            {(data.paymentDetails?.paymentMethods
                                ?.length > 0 ||
                                Object.values(
                                    data.paymentDetails
                                        ?.bankDetails ?? {}
                                ).some(Boolean)) && (
                                    <View
                                        style={styles.termsBlock}
                                    >
                                        <Text
                                            style={
                                                styles.termsTitle
                                            }
                                        >
                                            Payment Details
                                        </Text>

                                        <View
                                            style={
                                                styles.paymentDetailsCard
                                            }
                                        >
                                            {data.paymentDetails
                                                .paymentMethods
                                                ?.length > 0 && (
                                                    <>
                                                        <Text
                                                            style={
                                                                styles.paymentMethodsLabel
                                                            }
                                                        >
                                                            Accepted Payment Methods
                                                        </Text>

                                                        <Text
                                                            style={
                                                                styles.paymentMethods
                                                            }
                                                        >
                                                            {data.paymentDetails.paymentMethods.join(
                                                                "  ·  "
                                                            )}
                                                        </Text>
                                                    </>
                                                )}

                                            {data.paymentDetails
                                                .bankDetails
                                                ?.accountName && (
                                                    <View
                                                        style={
                                                            styles.paymentRow
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.paymentLabel
                                                            }
                                                        >
                                                            Account Name
                                                        </Text>

                                                        <Text
                                                            style={
                                                                styles.paymentValue
                                                            }
                                                        >
                                                            {
                                                                data.paymentDetails
                                                                    .bankDetails
                                                                    .accountName
                                                            }
                                                        </Text>
                                                    </View>
                                                )}

                                            {data.paymentDetails
                                                .bankDetails
                                                ?.accountNumber && (
                                                    <View
                                                        style={
                                                            styles.paymentRow
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.paymentLabel
                                                            }
                                                        >
                                                            Account Number
                                                        </Text>

                                                        <Text
                                                            style={
                                                                styles.paymentValue
                                                            }
                                                        >
                                                            {
                                                                data.paymentDetails
                                                                    .bankDetails
                                                                    .accountNumber
                                                            }
                                                        </Text>
                                                    </View>
                                                )}

                                            {data.paymentDetails
                                                .bankDetails
                                                ?.bankName && (
                                                    <View
                                                        style={
                                                            styles.paymentRow
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.paymentLabel
                                                            }
                                                        >
                                                            Bank
                                                        </Text>

                                                        <Text
                                                            style={
                                                                styles.paymentValue
                                                            }
                                                        >
                                                            {
                                                                data.paymentDetails
                                                                    .bankDetails
                                                                    .bankName
                                                            }
                                                        </Text>
                                                    </View>
                                                )}

                                            {data.paymentDetails
                                                .bankDetails
                                                ?.branch && (
                                                    <View
                                                        style={
                                                            styles.paymentRow
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.paymentLabel
                                                            }
                                                        >
                                                            Branch
                                                        </Text>

                                                        <Text
                                                            style={
                                                                styles.paymentValue
                                                            }
                                                        >
                                                            {
                                                                data.paymentDetails
                                                                    .bankDetails
                                                                    .branch
                                                            }
                                                        </Text>
                                                    </View>
                                                )}

                                            {data.paymentDetails
                                                .bankDetails
                                                ?.ifsc && (
                                                    <View
                                                        style={
                                                            styles.paymentRow
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.paymentLabel
                                                            }
                                                        >
                                                            IFSC
                                                        </Text>

                                                        <Text
                                                            style={
                                                                styles.paymentValue
                                                            }
                                                        >
                                                            {
                                                                data.paymentDetails
                                                                    .bankDetails
                                                                    .ifsc
                                                            }
                                                        </Text>
                                                    </View>
                                                )}

                                            {data.paymentDetails
                                                .bankDetails
                                                ?.upi && (
                                                    <View
                                                        style={
                                                            styles.paymentRow
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.paymentLabel
                                                            }
                                                        >
                                                            UPI ID
                                                        </Text>

                                                        <Text
                                                            style={
                                                                styles.paymentUpi
                                                            }
                                                        >
                                                            {
                                                                data.paymentDetails
                                                                    .bankDetails
                                                                    .upi
                                                            }
                                                        </Text>
                                                    </View>
                                                )}

                                            {paymentQrSource && (
                                                <View
                                                    style={styles.paymentQrContainer}
                                                    wrap={false}
                                                >
                                                    <Image
                                                        src={paymentQrSource}
                                                        style={styles.paymentQr}
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                )}

                            {/* Cancellation Policy */}

                            {data.cancellationPolicy
                                .length > 0 && (
                                    <View
                                        style={styles.termsBlock}
                                    >
                                        <Text
                                            style={
                                                styles.termsTitle
                                            }
                                        >
                                            Cancellation Policy
                                        </Text>

                                        <BulletList
                                            items={
                                                data.cancellationPolicy
                                            }
                                        />
                                    </View>
                                )}

                            {/* Terms */}

                            {terms.length > 0 && (
                                <View
                                    style={styles.termsBlock}
                                >
                                    <Text
                                        style={
                                            styles.termsTitle
                                        }
                                    >
                                        Terms & Conditions
                                    </Text>

                                    <BulletList
                                        items={terms}
                                    />
                                </View>
                            )}
                        </View>
                    )}

                {/* ========================================================
                    FOOTER
                ======================================================== */}

                <PDFHeaderFooter data={data} />
            </Page>
        </Document>
    );
}
