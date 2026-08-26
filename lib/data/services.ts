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
            "Fuel charges",
            "Road tax",
            "Toll tax",
            "Driver allowance",
            "Interstate taxes",
            "Parking charges",
        ],
        exclusions: [
            "Hotel, Meals & Beverages",
            "Travel insurance",
            "Personal expenses such as room heater, telephone, liquor, and other personal charges",
            "Air, rail, or bus fare",
            "Entry fees to parks, monuments, and other attractions",
            "Adventure activities such as rafting, paragliding, toy train rides, yak rides, horse rides, skiing, and skating",
            "Laundry charges",
            "Personal guide charges",
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
            "Travel insurance",
            "Personal expenses such as telephone, liquor, and other personal charges",
            "Air, rail, or bus fare",
            "Entry fees to parks, monuments, and other attractions",
            "Adventure activities such as rafting, paragliding, toy train rides, yak rides, horse rides, skiing, skating, etc.",
            "Laundry charges",
            "Personal guide charges",
            "Additional costs arising from increases in taxes or fuel prices that affect the cost of surface transportation prior to departure",
            "Any service or expense not specifically mentioned in the tour package",
            "Additional costs arising from extension or changes to the itinerary due to natural calamities, roadblocks, vehicle breakdowns, union issues, or other factors beyond our control",
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