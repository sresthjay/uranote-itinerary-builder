export interface Vehicle {
    id: string;
    name: string;
    carrier: boolean;
    seatingCapacity: number;
}

export const vehicles: Vehicle[] = [
    {
        id: "dzire",
        name: "Swift Dzire",
        carrier: true,
        seatingCapacity: 4,
    },

    {
        id: "innova",
        name: "Toyota Innova",
        carrier: true,
        seatingCapacity: 6,
    },

    {
        id: "innova-crysta-6",
        name: "Innova Crysta",
        carrier: true,
        seatingCapacity: 6,
    },

    {
        id: "innova-crysta-7",
        name: "Innova Crysta",
        carrier: true,
        seatingCapacity: 7,
    },

    {
        id: "tempo-traveller-12",
        name: "Tempo Traveller 12+1",
        carrier: true,
        seatingCapacity: 12,
    },

    {
        id: "tempo-traveller-16",
        name: "Tempo Traveller 16+1",
        carrier: true,
        seatingCapacity: 16,
    },
];