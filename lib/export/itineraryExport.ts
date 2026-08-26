import { Itinerary } from "@/lib/db";

import { firms } from "@/lib/data/firms";
import { regions } from "@/lib/data/regions";
import { services } from "@/lib/data/services";
import { vehicles } from "@/lib/data/vehicles";

/*
|--------------------------------------------------------------------------
| Build Customer-Facing Itinerary Export Data
|--------------------------------------------------------------------------
|
| Resolves all IDs stored in the itinerary into customer-facing data
| required by the PDF/export layer.
|
| Responsibilities:
|
| - Resolve firm
| - Resolve region
| - Resolve service
| - Resolve selected vehicles
| - Resolve selected package
| - Combine service + region inclusions/exclusions
| - Attach region-specific payment/cancellation policies
| - Attach firm-specific payment details
| - Attach region-specific terms
| - Attach hotel information
| - Expose firm metadata
| - Expose itinerary timestamps
|
|--------------------------------------------------------------------------
*/

export function buildItineraryExportData(itinerary: Itinerary) {
    /*
    |--------------------------------------------------------------------------
    | Resolve Firm
    |--------------------------------------------------------------------------
    */

    const firm = firms.find(
        (item) => item.id === itinerary.firmId
    );

    /*
    |--------------------------------------------------------------------------
    | Resolve Region
    |--------------------------------------------------------------------------
    */

    const region = regions.find(
        (item) => item.id === itinerary.regionId
    );

    /*
    |--------------------------------------------------------------------------
    | Resolve Service
    |--------------------------------------------------------------------------
    */

    const service = services.find(
        (item) => item.id === itinerary.serviceId
    );

    /*
    |--------------------------------------------------------------------------
    | Resolve Quotation Vehicles
    |--------------------------------------------------------------------------
    */

    const quotationVehicles = (
        itinerary.vehicleOptions ?? []
    )
        .map((option) => {
            const vehicle = vehicles.find(
                (item) => item.id === option.vehicleId
            );

            if (!vehicle) {
                return null;
            }

            return {
                vehicleId: vehicle.id,

                name: vehicle.name,

                seatingCapacity:
                    vehicle.seatingCapacity,

                carrier: vehicle.carrier,

                price: option.price,
            };
        })
        .filter(
            (
                vehicle
            ): vehicle is NonNullable<typeof vehicle> =>
                vehicle !== null
        );

    /*
    |--------------------------------------------------------------------------
    | Resolve Package
    |--------------------------------------------------------------------------
    */

    const packageOption =
        service?.packageOptions?.find(
            (option) =>
                option.id === itinerary.packageId
        );

    /*
    |--------------------------------------------------------------------------
    | Inclusions
    |--------------------------------------------------------------------------
    */

    const inclusions = [
        ...(service?.inclusions ?? []),
        ...(region?.inclusions ?? []),
    ];

    /*
    |--------------------------------------------------------------------------
    | Exclusions
    |--------------------------------------------------------------------------
    */

    const exclusions = [
        ...(service?.exclusions ?? []),
        ...(region?.exclusions ?? []),
    ];

    /*
    |--------------------------------------------------------------------------
    | Region Policies
    |--------------------------------------------------------------------------
    */

    const paymentPolicy =
        region?.paymentPolicy ?? [];

    const cancellationPolicy =
        region?.cancellationPolicy ?? [];

    const terms =
        region?.terms ?? [];

    /*
    |--------------------------------------------------------------------------
    | Firm Payment Details
    |--------------------------------------------------------------------------
    |
    | Payment information belongs to the selected firm.
    |
    | This is intentionally separate from paymentPolicy.
    |
    */

    const paymentDetails = {
        paymentMethods:
            firm?.paymentMethods ?? [],

        bankDetails: firm?.bankDetails
            ? {
                accountName:
                    firm.bankDetails.accountName ?? "",

                accountNumber:
                    firm.bankDetails.accountNumber ?? "",

                bankName:
                    firm.bankDetails.bankName ?? "",

                ifsc:
                    firm.bankDetails.ifsc ?? "",

                branch:
                    firm.bankDetails.branch ?? "",

                upi:
                    firm.bankDetails.upi ?? "",

                upiQrCode:
                    firm.bankDetails.upiQrCode ?? "",
            }
            : undefined,
    };

    /*
    |--------------------------------------------------------------------------
    | Hotels
    |--------------------------------------------------------------------------
    */

    const hotels = itinerary.hotelEnabled
        ? itinerary.hotels ?? []
        : [];

    /*
    |--------------------------------------------------------------------------
    | Export Data
    |--------------------------------------------------------------------------
    */

    return {
        /*
        |--------------------------------------------------------------------------
        | Trip
        |--------------------------------------------------------------------------
        */

        trip: {
            title:
                itinerary.title,

            customerName:
                itinerary.customerName,

            destination:
                itinerary.destination,

            startDate:
                itinerary.startDate,

            endDate:
                itinerary.endDate,

            pax:
                itinerary.pax,

            createdAt:
                itinerary.createdAt,

            updatedAt:
                itinerary.updatedAt,
        },

        /*
        |--------------------------------------------------------------------------
        | Initial Quotation
        |--------------------------------------------------------------------------
        */

        quotation: {
            vehicles:
                quotationVehicles,

            package:
                packageOption
                    ? {
                        id:
                            packageOption.id,

                        name:
                            packageOption.name,

                        price:
                            itinerary.packagePrice,
                    }
                    : undefined,
        },

        /*
        |--------------------------------------------------------------------------
        | Itinerary Content
        |--------------------------------------------------------------------------
        */

        itinerary: {
            content:
                itinerary.content,
        },

        /*
        |--------------------------------------------------------------------------
        | Customer-Facing Policies
        |--------------------------------------------------------------------------
        */

        inclusions,

        exclusions,

        paymentPolicy,

        /*
        |--------------------------------------------------------------------------
        | Payment Details
        |--------------------------------------------------------------------------
        |
        | Firm-specific payment information.
        |
        | This should be rendered immediately after Payment Policy
        | in the PDF.
        |
        */

        paymentDetails,

        cancellationPolicy,

        terms,

        /*
        |--------------------------------------------------------------------------
        | Hotels
        |--------------------------------------------------------------------------
        */

        hotels,

        /*
        |--------------------------------------------------------------------------
        | Metadata
        |--------------------------------------------------------------------------
        */

        meta: {
            itineraryId:
                itinerary.id,

            firmId:
                itinerary.firmId,

            regionId:
                itinerary.regionId,

            serviceId:
                itinerary.serviceId,

            firmName:
                firm?.name ?? "",

            firmPhone:
                firm?.phone ?? "",

            firmEmail:
                firm?.email ?? "",

            firmWebsite:
                firm?.website ?? "",

            firmAddress:
                firm?.address ?? "",

            regionName:
                region?.name ?? "",

            serviceName:
                service?.name ?? "",

            logo:
                firm?.logo ?? "",
        },
    };
}