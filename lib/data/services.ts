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