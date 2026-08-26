export interface Region {
    id: string;
    name: string;

    inclusions: string[];
    exclusions: string[];

    paymentPolicy: string[];
    cancellationPolicy: string[];

    terms: string[];
}

export const regions: Region[] = [
    {
        id: "himachal",
        name: "Himachal Pradesh",

        inclusions: [
            "Himachal Pradesh per-day vehicle taxes",
        ],

        exclusions: [],

        /*
        |--------------------------------------------------------------------------
        | Payment Policy
        |--------------------------------------------------------------------------
        */

        paymentPolicy: [
            "A 30% advance payment is required to confirm a taxi-only booking.",

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

        /*
        |--------------------------------------------------------------------------
        | Himachal Pradesh – Regional Terms & Important Instructions
        |--------------------------------------------------------------------------
        */

        terms: [
            "Please take a printout of the final itinerary and carry it with you during the tour. The final itinerary and voucher shared with you will be considered the applicable reference for the confirmed services.",

            "Sightseeing timings in Himachal Pradesh are generally 9:00 a.m. to 5:00 p.m. during the winter season and 8:00 a.m. to 6:00 p.m. during the rest of the year. Sightseeing will be conducted within the applicable operating hours.",

            "All sightseeing places mentioned in the confirmed package will be covered once during the tour. A particular sightseeing location will not normally be repeated unless specifically agreed in advance.",

            "During winter and monsoon seasons, access to certain sightseeing locations, particularly those outside major highways, may be restricted or blocked due to snowfall, landslides, heavy rainfall, road conditions, or other circumstances beyond our control. In such cases, the affected sightseeing may not be possible.",

            "During periods of heavy tourist traffic, particularly in popular destinations such as Shimla and Manali, traffic congestion may affect the number of sightseeing places that can be covered within the available time. Every reasonable effort will be made to cover the important places included in the confirmed itinerary.",

            "The specific vehicle requested is subject to availability. If the requested vehicle is unavailable, a similar vehicle of comparable category may be provided.",

            "Rohtang Pass sightseeing is subject to seasonal accessibility, weather conditions, government regulations, local permissions, and road conditions. Access may be restricted or unavailable during adverse weather or whenever authorities restrict tourist movement.",

            "Himachal Pradesh involves significant changes in altitude, temperature, and road conditions. Some travelers may experience discomfort such as headache, nausea, motion sickness, or stomach-related issues. Travelers are advised to carry any personal medicines they may require during the tour.",

            "The package and quotation are prepared according to the requirements shared by the customer. The quotation remains customizable only until it is finalized. Once the package and quotation are confirmed, changes may be subject to availability and additional charges.",

            "If a customer chooses not to use any of the confirmed services after commencement of the tour, the customer will remain liable for the amount specified in the confirmed voucher or payment schedule. Unused services are not automatically eligible for a refund.",

            "Customers are advised not to modify the confirmed tour plan during the trip. If the number of travel days is reduced after commencement of the tour, the total confirmed package price will not automatically be reduced.",

            "Any sightseeing location or service not included in the final confirmed quotation or itinerary will be treated as an additional service and may attract additional charges. Such additions are subject to availability, local conditions, and operational feasibility.",

            "If a customer chooses to terminate or discontinue the tour before the scheduled completion date, the applicable charges and payment obligations will be governed by the confirmed voucher and cancellation policy.",

            "We take reasonable care in providing transportation, drivers, hotels, and other confirmed services. Customers are expected to treat drivers, hotel staff, and service partners respectfully. In case of any service-related concern, customers should contact us promptly so that we can assist in resolving the issue.",

            "If payment is not made according to the agreed payment schedule or confirmed voucher, the service provider reserves the right to suspend or terminate the pending services, subject to the applicable terms and circumstances.",

            "The service provider will not be responsible for loss, theft, damage, or misplacement of personal belongings. Customers are responsible for keeping their valuables and personal belongings secure throughout the tour.",

            "Air-conditioning will be switched off in certain hilly and high-altitude areas due to vehicle operating conditions, road conditions, or local regulations. Where applicable, additional charges for AC operation in such areas may be payable directly on the spot.",

            "For any assistance or service-related concern before or during the tour, please contact the contact details provided in your itinerary or voucher. Our team will make reasonable efforts to assist and resolve the issue at the earliest.",
        ],
    },

    {
        id: "uttarakhand",
        name: "Uttarakhand",

        inclusions: [
            // Uttarakhand-specific inclusions
        ],

        exclusions: [
            // Uttarakhand-specific exclusions
        ],

        paymentPolicy: [],

        cancellationPolicy: [],

        terms: [],
    },

    {
        id: "ladakh",
        name: "Ladakh",

        inclusions: [
            // Ladakh-specific inclusions
        ],

        exclusions: [
            // Ladakh-specific exclusions
        ],

        paymentPolicy: [],

        cancellationPolicy: [],

        terms: [],
    },
];