export interface Vehicle {
    id: string;
    name: string;
    carrier: boolean;
    seatingCapacity: number;
}

export const vehicles: Vehicle[] = [
    {
        id: "alto",
        name: "Suzuki Alto",
        carrier: true,
        seatingCapacity: 4,
    },

    {
        id: "dzire",
        name: "Swift Dzire",
        carrier: true,
        seatingCapacity: 4,
    },

    {
        id: "etios",
        name: "Toyota Etios",
        carrier: false,
        seatingCapacity: 4,
    },

    {
        id: "ertiga",
        name: "Suzuki Ertiga",
        carrier: true,
        seatingCapacity: 6,
    },
   
    {
        id: "innova",
        name: "Toyota Innova",
        carrier: true,
        seatingCapacity: 6,
    },

    {
        id: "carens",
        name: "Kia Carens",
        carrier: true,
        seatingCapacity: 7,
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
        id: "scorpio",
        name: "Mahindra Scorpio",
        carrier: true,
        seatingCapacity: 8,
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

    {
        id: "tempo-traveller-20",
        name: "Tempo Traveller 20+1",
        carrier: true,
        seatingCapacity: 20,
    },

    {
        id: "urbania-12",
        name: "Urbania 12+1",
        carrier: true,
        seatingCapacity: 12,
    },

    {
        id: "urbania-16",
        name: "Urbania 16+1",
        carrier: true,
        seatingCapacity: 16,
    },
];