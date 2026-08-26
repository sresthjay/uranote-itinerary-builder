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
| This function resolves all IDs stored in the itinerary into the
| customer-facing data required by the PDF/export layer.
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
| - Attach region-specific terms
| - Attach hotel information
| - Expose firm metadata
| - Expose itinerary creation/modification timestamps
|
|--------------------------------------------------------------------------
*/

export function buildItineraryExportData(
    itinerary: Itinerary
) {
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
    |
    | Package definition comes from the selected service.
    | Package price comes from the itinerary because that is the
    | finalized/customer-specific price.
    |
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
    |
    | Service-level inclusions +
    | Region-level inclusions
    |
    */

    const inclusions = [
        ...(service?.inclusions ?? []),
        ...(region?.inclusions ?? []),
    ];

    /*
    |--------------------------------------------------------------------------
    | Exclusions
    |--------------------------------------------------------------------------
    |
    | Service-level exclusions +
    | Region-level exclusions
    |
    */

    const exclusions = [
        ...(service?.exclusions ?? []),
        ...(region?.exclusions ?? []),
    ];

    /*
    |--------------------------------------------------------------------------
    | Region Policies
    |--------------------------------------------------------------------------
    |
    | These are arrays because the PDF renders them as individual
    | customer-facing points.
    |
    */

    const paymentPolicy =
        region?.paymentPolicy ?? [];

    const cancellationPolicy =
        region?.cancellationPolicy ?? [];

    const terms =
        region?.terms ?? [];

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

            /*
            |----------------------------------------------------------------------
            | Document Metadata
            |----------------------------------------------------------------------
            |
            | createdAt is permanent.
            | updatedAt changes whenever the itinerary is modified.
            |
            */

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
        | Customer-Facing Policies & Terms
        |--------------------------------------------------------------------------
        */

        inclusions,

        exclusions,

        paymentPolicy,

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
        |
        | Firm information is resolved from firms.ts.
        | Region information is resolved from regions.ts.
        | Service information is resolved from services.ts.
        | Nothing is hardcoded here.
        |
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

            regionName:
                region?.name ?? "",

            serviceName:
                service?.name ?? "",

            logo:
                firm?.logo ?? "",
        },
    };
}