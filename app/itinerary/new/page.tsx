"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { saveItinerary, Itinerary, VehicleOption, Hotel } from "@/lib/db";
import { firms } from "@/lib/data/firms";
import { regions } from "@/lib/data/regions";
import { services } from "@/lib/data/services";
import { vehicles } from "@/lib/data/vehicles";

function ToolbarButton({
    onClick,
    children,
}: {
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
            {children}
        </button>
    );
}

function calculateDuration(startDate: string, endDate: string) {
    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return "";
    }

    const nights = Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights < 0) return "";

    return `${nights}N/${nights + 1}D`;
}

function formatDate(date: string) {
    if (!date) return "";

    const value = new Date(`${date}T00:00:00`);

    if (Number.isNaN(value.getTime())) return "";

    return value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function generateTitle(
    customerName: string,
    destination: string,
    startDate: string,
    endDate: string
) {
    if (!customerName || !destination || !startDate || !endDate) {
        return "New Itinerary";
    }

    const formattedDate = formatDate(startDate);
    const duration = calculateDuration(startDate, endDate);

    if (!formattedDate || !duration) {
        return "New Itinerary";
    }

    return `${customerName} – ${destination} – ${formattedDate} – ${duration}`;
}

export default function NewItineraryPage() {
    const router = useRouter();

    const [customerName, setCustomerName] = useState("");
    const [destination, setDestination] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [pax, setPax] = useState(2);

    const [firmId, setFirmId] = useState(firms[0]?.id ?? "");
    const [regionId, setRegionId] = useState(regions[0]?.id ?? "");
    const [serviceId, setServiceId] = useState(services[0]?.id ?? "");

    const [vehicleEnabled, setVehicleEnabled] = useState(true);
    const [vehicleOptions, setVehicleOptions] =
        useState<VehicleOption[]>([]);

    const [packageId, setPackageId] = useState("");
    const [packagePrice, setPackagePrice] = useState("");

    const [hotelEnabled, setHotelEnabled] = useState(false);
    const [hotels, setHotels] = useState<Hotel[]>([]);

    const [saving, setSaving] = useState(false);

    const [packageEnabled, setPackageEnabled] = useState(false);

    const duration = useMemo(
        () => calculateDuration(startDate, endDate),
        [startDate, endDate]
    );

    const title = useMemo(
        () =>
            generateTitle(
                customerName,
                destination,
                startDate,
                endDate
            ),
        [customerName, destination, startDate, endDate]
    );

    const selectedService = services.find(
        (service) => service.id === serviceId
    );

    const addVehicle = () => {
        setVehicleOptions((current) => [
            ...current,
            {
                vehicleId: "",
                price: 0,
            },
        ]);
    };

    const updateVehicle = (
        index: number,
        field: keyof VehicleOption,
        value: string
    ) => {
        setVehicleOptions((current) =>
            current.map((vehicle, vehicleIndex) => {
                if (vehicleIndex !== index) {
                    return vehicle;
                }

                if (field === "price") {
                    return {
                        ...vehicle,
                        price: Number(value),
                    };
                }

                return {
                    ...vehicle,
                    vehicleId: value,
                };
            })
        );
    };

    const removeVehicle = (index: number) => {
        setVehicleOptions((current) =>
            current.filter(
                (_, vehicleIndex) => vehicleIndex !== index
            )
        );
    };

    const addHotel = () => {
        setHotels((current) => [
            ...current,
            {
                destination: "",
                name: "",
                checkIn: "",
                checkOut: "",
                roomType: "",
                mealPlan: "",
            },
        ]);
    };

    const updateHotel = (
        index: number,
        field: keyof Hotel,
        value: string
    ) => {
        setHotels((current) =>
            current.map((hotel, hotelIndex) =>
                hotelIndex === index
                    ? { ...hotel, [field]: value }
                    : hotel
            )
        );
    };

    const removeHotel = (index: number) => {
        setHotels((current) =>
            current.filter((_, hotelIndex) => hotelIndex !== index)
        );
    };

    const handleSave = async () => {
        const missingFields: string[] = [];

        if (!customerName.trim()) missingFields.push("Customer Name");
        if (!destination.trim()) missingFields.push("Destination");
        if (!startDate) missingFields.push("Start Date");
        if (!endDate) missingFields.push("End Date");
        if (!firmId) missingFields.push("Firm");
        if (!regionId) missingFields.push("Region");
        if (!serviceId) missingFields.push("Service");

        if (missingFields.length > 0) {
            alert(
                `Please complete the following required fields:\n\n${missingFields.join(
                    "\n"
                )}`
            );
            return;
        }

        if (endDate < startDate) {
            alert("End date cannot be before start date.");
            return;
        }

        setSaving(true);

        try {
            const now = new Date().toISOString();

            const itinerary: Itinerary = {
                id: crypto.randomUUID(),

                title,

                firmId,
                regionId,
                serviceId,

                customerName,
                destination,

                startDate,
                endDate,
                pax,

                vehicleEnabled,
                vehicleOptions: vehicleEnabled
                    ? vehicleOptions.filter(
                        (vehicle) => vehicle.vehicleId
                    )
                    : [],

                packageId:
                    selectedService?.pricingModel === "package" &&
                        packageEnabled &&
                        packageId
                        ? packageId
                        : undefined,

                packagePrice:
                    selectedService?.pricingModel === "package" &&
                        packageEnabled &&
                        packagePrice
                        ? Number(packagePrice)
                        : undefined,

                hotelEnabled,
                hotels: hotelEnabled ? hotels : undefined,

                content: editor?.getHTML() ?? "",

                createdAt: now,
            };

            await saveItinerary(itinerary);

            router.push(`/itinerary/${itinerary.id}`);
        } catch (error) {
            console.error("Failed to save itinerary:", error);
            alert("Failed to save itinerary.");
        } finally {
            setSaving(false);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Start writing your itinerary...",
            }),
        ],
        content: `
            <h2>Day 1: Chandigarh – Shimla</h2>
            <p>Pickup from Chandigarh and proceed towards Shimla.</p>
            <p><strong>Overnight:</strong> Shimla</p>
        `,
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-6 px-6 py-3">
                    <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                            New Itinerary
                        </p>

                        <h1 className="truncate text-lg font-semibold text-gray-900">
                            {title}
                        </h1>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-6 py-8">
                {/* Trip Details */}
                <section className="mb-6 rounded-xl border bg-white p-6">
                    <h2 className="mb-5 text-base font-semibold text-gray-900">
                        Trip Details
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Customer */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Customer Name *
                            </label>

                            <input
                                value={customerName ?? ""}
                                onChange={(e) =>
                                    setCustomerName(e.target.value)
                                }
                                placeholder="Customer name"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                            />
                        </div>

                        {/* Destination */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Destination *
                            </label>

                            <input
                                value={destination ?? ""}
                                onChange={(e) =>
                                    setDestination(e.target.value)
                                }
                                placeholder="e.g. Shimla Manali"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Start Date *
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                End Date *
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(e) =>
                                    setEndDate(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Duration
                            </label>

                            <input
                                value={duration}
                                readOnly
                                placeholder="Auto calculated"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600"
                            />
                        </div>

                        {/* Pax */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                No. of Pax
                            </label>

                            <input
                                type="number"
                                min={1}
                                value={pax ?? 2}
                                onChange={(e) =>
                                    setPax(
                                        Math.max(
                                            1,
                                            Number(e.target.value)
                                        )
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                            />
                        </div>

                        {/* Firm */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Firm
                            </label>

                            <select
                                value={firmId}
                                onChange={(e) =>
                                    setFirmId(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                            >
                                {firms.map((firm) => (
                                    <option
                                        key={firm.id}
                                        value={firm.id}
                                    >
                                        {firm.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Region */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Region
                            </label>

                            <select
                                value={regionId}
                                onChange={(e) =>
                                    setRegionId(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                            >
                                {regions.map((region) => (
                                    <option
                                        key={region.id}
                                        value={region.id}
                                    >
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Service */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Service
                            </label>

                            <select
                                value={serviceId}
                                onChange={(e) => {
                                    setServiceId(e.target.value);
                                    setVehicleOptions([]);
                                    setPackageId("");
                                    setPackagePrice("");
                                    setPackageEnabled(false);
                                }}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                            >
                                {services.map((service) => (
                                    <option
                                        key={service.id}
                                        value={service.id}
                                    >
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Vehicle / Pricing */}
                <section className="mb-6 rounded-xl border bg-white p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-900">
                            Vehicle & Pricing
                        </h2>

                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={vehicleEnabled}
                                onChange={(e) =>
                                    setVehicleEnabled(e.target.checked)
                                }
                            />
                            Include vehicle
                        </label>
                    </div>

                    {vehicleEnabled && (
                        <div className="space-y-3">
                            {vehicleOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className="grid gap-3 rounded-lg border border-gray-200 p-4 md:grid-cols-[1fr_220px_auto]"
                                >
                                    <div>
                                        {index === 0 && (
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Vehicle
                                            </label>
                                        )}

                                        <select
                                            value={option.vehicleId}
                                            onChange={(e) =>
                                                updateVehicle(
                                                    index,
                                                    "vehicleId",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                                        >
                                            <option value="">
                                                Select vehicle
                                            </option>

                                            {vehicles.map((vehicle) => (
                                                <option
                                                    key={vehicle.id}
                                                    value={vehicle.id}
                                                >
                                                    {vehicle.name} ·{" "}
                                                    {vehicle.seatingCapacity} seats
                                                    {vehicle.carrier
                                                        ? " · Carrier"
                                                        : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        {index === 0 && (
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Price
                                            </label>
                                        )}

                                        <input
                                            type="number"
                                            min={0}
                                            value={option.price || ""}
                                            onChange={(e) =>
                                                updateVehicle(
                                                    index,
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="₹ Quoted price"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeVehicle(index)
                                            }
                                            className="w-full rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addVehicle}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                + Add Vehicle
                            </button>
                        </div>
                    )}
                </section>

                {/* Package Pricing */}
                {selectedService?.pricingModel === "package" &&
                    !packageEnabled && (
                        <div className="mb-6 rounded-xl border bg-white p-6">
                            <button
                                type="button"
                                onClick={() => setPackageEnabled(true)}
                                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                + Add Package Pricing
                            </button>
                        </div>
                    )}

                {selectedService?.pricingModel === "package" &&
                    packageEnabled && (
                        <section className="mb-6 rounded-xl border bg-white p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-gray-900">
                                    Package Pricing
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => setPackageEnabled(false)}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Remove package pricing
                                </button>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Package
                                    </label>

                                    <select
                                        value={packageId}
                                        onChange={(e) =>
                                            setPackageId(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                                    >
                                        <option value="">
                                            Select package (optional)
                                        </option>

                                        {selectedService.packageOptions?.map(
                                            (option) => (
                                                <option
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Package Price
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        value={packagePrice}
                                        onChange={(e) =>
                                            setPackagePrice(e.target.value)
                                        }
                                        placeholder="₹ Package price"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                {/* Hotels */}
                <section className="mb-6 rounded-xl border bg-white p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-900">
                            Hotels
                        </h2>

                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={hotelEnabled}
                                onChange={(e) =>
                                    setHotelEnabled(e.target.checked)
                                }
                            />
                            Include hotel details
                        </label>
                    </div>

                    {hotelEnabled && (
                        <div className="space-y-4">
                            {hotels.map((hotel, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-800">
                                            Hotel {index + 1}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeHotel(index)
                                            }
                                            className="text-xs text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <input
                                            value={hotel.destination ?? ""}
                                            onChange={(e) =>
                                                updateHotel(
                                                    index,
                                                    "destination",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Destination"
                                            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                        />

                                        <input
                                            value={hotel.name ?? ""}
                                            onChange={(e) =>
                                                updateHotel(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Hotel name"
                                            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                        />

                                        <input
                                            type="date"
                                            value={hotel.checkIn ?? ""}
                                            onChange={(e) =>
                                                updateHotel(
                                                    index,
                                                    "checkIn",
                                                    e.target.value
                                                )
                                            }
                                            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                        />

                                        <input
                                            type="date"
                                            value={hotel.checkOut ?? ""}
                                            min={hotel.checkIn}
                                            onChange={(e) =>
                                                updateHotel(
                                                    index,
                                                    "checkOut",
                                                    e.target.value
                                                )
                                            }
                                            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                        />

                                        <input
                                            value={hotel.roomType ?? ""}
                                            onChange={(e) =>
                                                updateHotel(
                                                    index,
                                                    "roomType",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Room type"
                                            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                        />

                                        <input
                                            value={hotel.mealPlan ?? ""}
                                            onChange={(e) =>
                                                updateHotel(
                                                    index,
                                                    "mealPlan",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Meal plan"
                                            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addHotel}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                + Add Hotel
                            </button>
                        </div>
                    )}
                </section>

                {/* Editor */}
                <section className="overflow-hidden rounded-xl border bg-white">
                    <div className="flex flex-wrap items-center gap-1 border-b p-2">
                        <ToolbarButton
                            onClick={() =>
                                editor.chain().focus().toggleBold().run()
                            }
                        >
                            <strong>B</strong>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() =>
                                editor.chain().focus().toggleItalic().run()
                            }
                        >
                            <em>I</em>
                        </ToolbarButton>

                        <div className="mx-1 h-5 w-px bg-gray-200" />

                        <ToolbarButton
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run()
                            }
                        >
                            H2
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 3 })
                                    .run()
                            }
                        >
                            H3
                        </ToolbarButton>

                        <div className="mx-1 h-5 w-px bg-gray-200" />

                        <ToolbarButton
                            onClick={() =>
                                editor.chain().focus().toggleBulletList().run()
                            }
                        >
                            • List
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() =>
                                editor.chain().focus().toggleOrderedList().run()
                            }
                        >
                            1. List
                        </ToolbarButton>

                        <div className="mx-1 h-5 w-px bg-gray-200" />

                        <ToolbarButton
                            onClick={() =>
                                editor.chain().focus().undo().run()
                            }
                        >
                            Undo
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() =>
                                editor.chain().focus().redo().run()
                            }
                        >
                            Redo
                        </ToolbarButton>
                    </div>

                    <div className="min-h-[650px] p-8">
                        <EditorContent editor={editor} />
                    </div>
                </section>
            </div>
        </main>
    );
}