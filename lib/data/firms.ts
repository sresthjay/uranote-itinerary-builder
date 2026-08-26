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
        ],

        bankDetails: {
            accountName: "Mystical Himcahal",
            accountNumber: "50200092975718",
            bankName: "HDFC Bank",
            ifsc: "HDFC0000387",
            branch: "Solan, H.P.",
            upi: "9816244669@upi",
            upiQrCode: "/firms/uranote-holidays/qr.png",
        },
    },

    {
        id: "explore-my-bharat",
        name: "Explore My Bharat",

        phone: "",
        email: "",
        website: "",
        address: "",
        logo: "",

        paymentMethods: [
            "Bank Transfer",
            "UPI",
        ],

        bankDetails: {
            accountName: "",
            accountNumber: "",
            bankName: "",
            ifsc: "",
            branch: "",
            upi: "",
            upiQrCode: "",
        },
    },

    {
        id: "mystical-himachal",
        name: "Mystical Himachal",

        phone: "",
        email: "",
        website: "",
        address: "",
        logo: "",

        paymentMethods: [
            "Bank Transfer",
            "UPI",
        ],

        bankDetails: {
            accountName: "",
            accountNumber: "",
            bankName: "",
            ifsc: "",
            branch: "",
            upi: "",
            upiQrCode: "",
        },
    },
];