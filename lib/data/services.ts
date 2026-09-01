export interface PackageOption {
    id: string;
    name: string;
}

export interface Service {
    id: string;
    name: string;

    pricingModel: "vehicle" | "package";

    inclusions: string[];
    exclusions: string[];

    paymentPolicy: string[];
    cancellationPolicy: string[];

    packageOptions?: PackageOption[];
}

export const services: Service[] = [
    {
        id: "taxi-service",
        name: "Taxi Service",

        pricingModel: "vehicle",

        inclusions: [
            "Transportation using the selected vehicle or similar vehicle",
            "Private non-sharable vehicle for sightseeing as per the tour itinerary",
            "Fuel charges & Parking charges",
            "Road tax & Toll tax",
            "Interstate taxes",
            "Driver allowance (fooding & lodging)",
        ],
        exclusions: [
            "Hotel accommodation, meals, beverages, and other services not specifically included in the confirmed itinerary",
            "Travel insurance unless specifically included in the inclusions column",
            "Personal expenses such as room heater, telephone, laundry, liquor, and other personal charges",
            "Air, rail, bus, Volvo, train, or other transportation fares unless specifically included in the inclusions column",
            "Entry fees, permits, tickets, and charges for parks, monuments, attractions, and other sightseeing places unless specifically included in inclusions column",
            "Adventure activities, recreational activities, and other experiences unless specifically included in the inclusions column",
            "Personal guide charges unless specifically included in the inclusions column",
            "Any service, activity, ticket, meal, upgrade, or expense not specifically mentioned as included in the inclusions column",
            "Additional costs arising from increases in taxes or fuel prices, extension or changes to the itinerary due to natural calamities, roadblocks, vehicle breakdowns, union issues, or other factors beyond our control",
        ],

        /*
        |--------------------------------------------------------------------------
        | Payment Policy
        |--------------------------------------------------------------------------
        */

        paymentPolicy: [
            "A 20% advance payment is required to confirm a taxi-only booking.",

            "For complete tour packages, a 50% advance payment is required to confirm the booking.",

            "The remaining balance is payable during the tour as per the payment schedule we'll share with you before the trip.",

            "Once the payment is reflected in our account, we will share the payment receipt & the reservation voucher (for hotels).",

            "Please share a screenshot of the payment confirmation with us for verification and faster processing.",
        ],

        /*
        |--------------------------------------------------------------------------
        | Cancellation Policy
        |--------------------------------------------------------------------------
        */

        cancellationPolicy: [
            "In case of cancellation, the refundable amount will be processed according to the cancellation schedule below. Please review the policy carefully before confirming or cancelling your tour.",

            "More than 30 days before the tour commencement date: 90% of the amount paid will be refunded.",

            "30 to 15 days before the tour commencement date: 50% of the amount paid will be refunded.",

            "More than 7 days but less than 15 days before the tour commencement date: 30% of the amount paid will be refunded.",

            "7 days or less before the tour commencement date: 10% of the amount paid will be refunded.",

            "On the day before or on the day of tour commencement: No refund will be provided.",

            "Cancellation after the tour has commenced: No refund will be provided for cancellations made on or after the tour commencement date.",

            "No refund will be provided for sightseeing or services affected by natural calamities or circumstances beyond our control, including landslides, earthquakes, heavy rainfall, heavy snowfall, road closures, or similar conditions.",

            "No refund will be provided for technical or mechanical issues affecting the taxi during the tour where an alternative arrangement or resolution is provided as per operational feasibility.",

            "Token payments (10%) are non-refundable in all circumstances.",

            "Approved refunds will be processed within 1 months from the date on which the refund is initiated.",
        ],

    },

    {
        id: "tour-package",
        name: "Tour Package",

        pricingModel: "package",

        inclusions: [
            "Transportation using the selected vehicle or similar vehicle",
            "Private non-sharable vehicle for sightseeing as per the tour itinerary",
            "Hotels as per Stay Details section, meals as per your plan meal plan",
            "Fuel charges",
            "Road tax",
            "Toll tax",
            "Driver allowance",
            "Interstate taxes",
            "Parking charges",
        ],
        exclusions: [
            "Meals outside hotels and beverages during the tour",
            "Travel insurance unless specifically included in the inclusions column",
            "Personal expenses such as room heater, telephone, laundry, liquor, and other personal charges",
            "Air, rail, bus, Volvo, train, or other transportation fares unless specifically included in the inclusions column",
            "Entry fees, permits, tickets, and charges for parks, monuments, attractions, and other sightseeing places unless specifically included in inclusions column",
            "Adventure activities, recreational activities, and other experiences unless specifically included in the inclusions column",
            "Personal guide charges unless specifically included in the inclusions column",
            "Any service, activity, ticket, meal, upgrade, or expense not specifically mentioned as included in the inclusions column",
            "Additional costs arising from increases in taxes or fuel prices, extension or changes to the itinerary due to natural calamities, roadblocks, vehicle breakdowns, union issues, or other factors beyond our control",
        ],

        /*
         |--------------------------------------------------------------------------
         | Payment Policy
         |--------------------------------------------------------------------------
        */

        paymentPolicy: [
            "A 20% advance payment is required to confirm a taxi-only booking.",

            "For complete tour packages, a 50% advance payment is required to confirm the booking.",

            "The remaining balance is payable during the tour as per the payment schedule we'll share with you before the trip.",

            "Once the payment is reflected in our account, we will share the payment receipt & the reservation voucher (for hotels).",

            "Please share a screenshot of the payment confirmation with us for verification and faster processing.",
        ],

        /*
        |--------------------------------------------------------------------------
        | Cancellation Policy
        |--------------------------------------------------------------------------
        */

        cancellationPolicy: [
            "In case of cancellation, the refundable amount will be processed according to the cancellation schedule below. Please review the policy carefully before confirming or cancelling your tour.",

            "More than 30 days before the tour commencement date: 90% of the amount paid will be refunded.",

            "30 to 15 days before the tour commencement date: 50% of the amount paid will be refunded.",

            "More than 7 days but less than 15 days before the tour commencement date: 30% of the amount paid will be refunded.",

            "7 days or less before the tour commencement date: 10% of the amount paid will be refunded.",

            "On the day before or on the day of tour commencement: No refund will be provided.",

            "Cancellation after the tour has commenced: No refund will be provided for cancellations made on or after the tour commencement date.",

            "No refund will be provided for sightseeing or services affected by natural calamities or circumstances beyond our control, including landslides, earthquakes, heavy rainfall, heavy snowfall, road closures, or similar conditions.",

            "No refund will be provided for technical or mechanical issues affecting the taxi during the tour where an alternative arrangement or resolution is provided as per operational feasibility.",

            "Token payments (10%) are non-refundable in all circumstances.",

            "Approved refunds will be processed within 1 months from the date on which the refund is initiated.",
        ],

        packageOptions: [
            {
                id: "deluxe",
                name: "Deluxe Package",
            },
            {
                id: "three-star",
                name: "3 Star Package",
            },
            {
                id: "luxury",
                name: "Luxury Package",
            },
        ],
    },
];