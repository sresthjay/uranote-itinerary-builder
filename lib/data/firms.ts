export interface Firm {
    id: string;
    name: string;

    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    logo?: string;

    paymentMethods?: string[];

    bankDetails?: {
        accountName?: string;
        accountNumber?: string;
        bankName?: string;
        ifsc?: string;
        branch?: string;
        upi?: string;
        upiQrCode?: string;
    };
}

export const firms: Firm[] = [
    {
        id: "uranote",
        name: "Uranote Holidays",

        phone: "+91 98057 53890",
        email: "mail@uranoteholidays.com",
        website: "www.uranoteholidays.com",
        address: "Koti, Kufri-Chail Rd, Shimla, 171012",
        logo: "/firms/uranote-holidays/logo.png",

        paymentMethods: [
            "Bank Transfer",
            "UPI",
            "Debit/Credit Card",
        ],

        bankDetails: {
            accountName: "Mystical Himcahal",
            accountNumber: "50200092975718",
            bankName: "HDFC Bank",
            ifsc: "HDFC0000387",
            branch: "Solan, H.P.",
            upi: "9816244669@upi",
            upiQrCode: "/firms/uranote-holidays/qr.jpg",
        },
    },

    {
        id: "explore",
        name: "Explore My Bharat",

        phone: "+91 62305 57851",
        email: "exploremybharat@gmail.com",
        website: "www.exploremybharat.com",
        address: "Kashyap Complex, Shop No. 3, Ser Charag, Jaunaji, Solan, Himachal Pradesh 173212",
        logo: "/firms/explore-my-bharat/logo.jpeg",

        paymentMethods: [
            "Bank Transfer",
            "UPI",
            "Debit/Credit Card",

        ],

        bankDetails: {
            accountName: "Explore My Bharat",
            accountNumber: "409001680639",
            bankName: "RBL Bank",
            ifsc: "RATN0000319",
            branch: "Solan, H.P.",
            upi: "6230557851@upi",
            upiQrCode: "",
        },
    },

    {
        id: "mystical",
        name: "Mystical Himachal",

        phone: "+91 70188 09957",
        email: "mysticalhimachaltravel@gmail.com",
        website: "www.mysticalhimachal.com",
        address: "Kashyap Complex, Second Floor, S.N 1, Jaunaji, Solan, HP (173212)",
        logo: "/firms/mystical-himachal/logo.svg",

        paymentMethods: [
            "Bank Transfer",
            "UPI",
            "Debit/Credit Card",
        ],

        bankDetails: {
            accountName: "Mystical Himcahal",
            accountNumber: "50200092975718",
            bankName: "HDFC Bank",
            ifsc: "HDFC0000387",
            branch: "Solan, H.P.",
            upi: "9816244669@upi",
            upiQrCode: "/firms/mystical-himachal/qr.jpg",
        },
    },

    {
        id: "nirvana",
        name: "Nirvana Trips & Leisure",

        phone: "+91 76784 65298",
        email: "nirvanatrips04@gmail.com",
        website: "www.nirvanatrips.in",
        address: "Shop No 61 Aruna Nagar, Outer Ring Rd, near Gurudwara, Majnu-ka-tilla, New Delhi, Delhi 110054",
        logo: "/firms/nirvana-trips/logo.png",

        paymentMethods: [
            "Bank Transfer",
            "UPI",
            "Debit/Credit Card",
        ],

        bankDetails: {
            accountName: "Rajender Kumar",
            accountNumber: "91172010016095",
            bankName: "Canara Bank",
            ifsc: "CNRB0019117",
            branch: "Nand Nagri, Delhi",
            upi: "9313298708@ptsbi",
            upiQrCode: "/firms/nirvana-trips/qr.jpg",
        },
    },
];