"use client";

import { exportItineraryPdf } from "@/lib/export/exportPdf";
import { exportItineraryJson } from "@/lib/export/exportJson";
import {
    Suspense,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import {
    getItinerary,
    saveItinerary,
    deleteItinerary,
    Itinerary,
    Hotel,
    VehicleOption,
} from "@/lib/db";

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
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900 hover:shadow-sm active:scale-95 sm:px-3 sm:py-2 sm:text-sm"
        >
            {children}
        </button>
    );
}

function calculateDuration(startDate: string, endDate: string) {
    if (!startDate || !endDate) return "";

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return "";
    }

    const nights = Math.round(
        (end.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
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
        return "Untitled Itinerary";
    }

    const date = formatDate(startDate);
    const duration = calculateDuration(startDate, endDate);

    if (!date || !duration) {
        return "Untitled Itinerary";
    }

    return `${customerName} – ${destination} – ${date} – ${duration}`;
}

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

const sectionClass =
    "mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md";

function EditItineraryContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const id = searchParams.get("id");

    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [customerName, setCustomerName] = useState("");
    const [destination, setDestination] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [pax, setPax] = useState(2);

    const [firmId, setFirmId] = useState("");
    const [regionId, setRegionId] = useState("");
    const [serviceId, setServiceId] = useState("");

    const [vehicleEnabled, setVehicleEnabled] = useState(true);
    const [vehicleOptions, setVehicleOptions] = useState<
        VehicleOption[]
    >([]);

    /*
     * IMPORTANT:
     * db.ts defines packageOptions.price as STRING.
     * Keep this state as string as well.
     */
    const [packageOptions, setPackageOptions] = useState<
        {
            packageId: string;
            price: string;
        }[]
    >([]);

    const [hotelEnabled, setHotelEnabled] = useState(false);
    const [hotels, setHotels] = useState<Hotel[]>([]);

    const [firmSearch, setFirmSearch] = useState("");
    const [showFirmResults, setShowFirmResults] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Start writing your itinerary...",
            }),
        ],
        immediatelyRender: false,
    });

    useEffect(() => {
        if (!id) {
            router.push("/itinerary");
            return;
        }

        const itineraryId = id;

        async function loadItinerary() {
            try {
                const data = await getItinerary(itineraryId);

                if (!data) {
                    router.push("/itinerary");
                    return;
                }

                setItinerary(data);

                setCustomerName(data.customerName ?? "");
                setDestination(data.destination ?? "");

                setStartDate(data.startDate ?? "");
                setEndDate(data.endDate ?? "");
                setPax(data.pax ?? 2);

                const loadedFirmId =
                    data.firmId ?? firms[0]?.id ?? "";

                setFirmId(loadedFirmId);

                const loadedFirm = firms.find(
                    (firm) => firm.id === loadedFirmId
                );

                setFirmSearch(loadedFirm?.name ?? "");
                setRegionId(
                    data.regionId ?? regions[0]?.id ?? ""
                );
                setServiceId(
                    data.serviceId ?? services[0]?.id ?? ""
                );

                setVehicleEnabled(
                    data.vehicleEnabled ?? false
                );
                setVehicleOptions(
                    data.vehicleOptions ?? []
                );

                /*
                 * Keep package price as string because db.ts
                 * defines it as string.
                 */
                setPackageOptions(
                    (data.packageOptions ?? []).map((option) => ({
                        packageId: option.packageId ?? "",
                        price: option.price ?? "",
                    }))
                );

                setHotelEnabled(data.hotelEnabled ?? false);
                setHotels(data.hotels ?? []);

                if (editor) {
                    editor.commands.setContent(
                        data.content || ""
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load itinerary:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        loadItinerary();
    }, [id, router, editor]);

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
        [
            customerName,
            destination,
            startDate,
            endDate,
        ]
    );

    const selectedService = services.find(
        (service) => service.id === serviceId
    );

    const selectedFirm = firms.find(
        (firm) => firm.id === firmId
    );

    const filteredFirms = firms.filter((firm) =>
        firm.name
            .toLowerCase()
            .includes(firmSearch.toLowerCase())
    );

    const addHotel = () => {
        setHotels((current) => [
            ...current,
            {
                destination: "",
                name: "",
                checkIn: "",
                checkOut: "",
                roomType: "",
                rooms: 1,
                mealPlan: "",
            },
        ]);
    };

    const updateHotel = (
        index: number,
        field: keyof Hotel,
        value: string | number
    ) => {
        setHotels((current) =>
            current.map((hotel, hotelIndex) =>
                hotelIndex === index
                    ? {
                        ...hotel,
                        [field]: value,
                    }
                    : hotel
            )
        );
    };

    const removeHotel = (index: number) => {
        setHotels((current) =>
            current.filter(
                (_, hotelIndex) => hotelIndex !== index
            )
        );
    };

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

    const addPackageOption = () => {
        setPackageOptions((current) => [
            ...current,
            {
                packageId: "",
                price: "",
            },
        ]);
    };

    const updatePackageOption = (
        index: number,
        field: "packageId" | "price",
        value: string
    ) => {
        setPackageOptions((current) =>
            current.map((option, optionIndex) => {
                if (optionIndex !== index) {
                    return option;
                }

                /*
                 * IMPORTANT:
                 * Do NOT use Number(value) here.
                 * packageOptions.price is a string in db.ts.
                 */
                return {
                    ...option,
                    [field]: value,
                };
            })
        );
    };

    const removePackageOption = (index: number) => {
        setPackageOptions((current) =>
            current.filter(
                (_, optionIndex) => optionIndex !== index
            )
        );
    };

    const handleSave = async () => {
        if (!itinerary || !editor) return;

        const missingFields: string[] = [];

        if (!customerName.trim())
            missingFields.push("Customer Name");

        if (!destination.trim())
            missingFields.push("Destination");

        if (!startDate)
            missingFields.push("Start Date");

        if (!endDate)
            missingFields.push("End Date");

        if (!firmId)
            missingFields.push("Firm");

        if (!regionId)
            missingFields.push("Region");

        if (!serviceId)
            missingFields.push("Service");

        if (missingFields.length > 0) {
            alert(
                `Please complete the following required fields:\n\n${missingFields.join(
                    "\n"
                )}`
            );
            return;
        }

        setSaving(true);

        try {
            const now = new Date().toISOString();

            const updatedItinerary: Itinerary = {
                ...itinerary,

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
                        (vehicle) =>
                            vehicle.vehicleId
                    )
                    : [],

                /*
                 * packageOptions.price remains STRING
                 * to match db.ts.
                 */
                packageOptions:
                    selectedService?.pricingModel ===
                        "package"
                        ? packageOptions.filter(
                            (option) =>
                                option.packageId
                        )
                        : [],

                hotelEnabled,

                hotels: hotelEnabled
                    ? hotels
                    : undefined,

                content: editor.getHTML(),

                updatedAt: now,
            };

            await saveItinerary(updatedItinerary);

            setItinerary(updatedItinerary);

            alert(
                "Itinerary updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update itinerary:",
                error
            );

            alert(
                "Failed to update itinerary."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!itinerary) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this itinerary?"
        );

        if (!confirmed) return;

        setDeleting(true);

        try {
            await deleteItinerary(itinerary.id);

            router.push("/itinerary");
        } catch (error) {
            console.error(
                "Failed to delete itinerary:",
                error
            );

            alert(
                "Failed to delete itinerary."
            );

            setDeleting(false);
        }
    };

    if (loading || !editor) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800" />

                    <p className="text-sm font-medium text-slate-600">
                        Loading itinerary...
                    </p>
                </div>
            </main>
        );
    }

    if (!itinerary) {
        return null;
    }

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200/80 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        {/* Title */}
                        <div className="min-w-0 lg:flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-[11px]">
                                Itinerary Workspace
                            </p>

                            <h1 className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-xl">
                                {title}
                            </h1>

                            {itinerary.updatedAt && (
                                <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
                                    Last updated{" "}
                                    {new Date(
                                        itinerary.updatedAt
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/")
                                }
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
                            >
                                ← Dashboard
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={
                                    deleting || saving
                                }
                                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={
                                    saving || deleting
                                }
                                className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm"
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    exportItineraryJson(
                                        itinerary
                                    )
                                }
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-2"
                            >
                                JSON
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    exportItineraryPdf(
                                        itinerary
                                    )
                                }
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:py-2"
                            >
                                PDF
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Trip Details */}
                <section className={sectionClass}>
                    <div className="mb-5">
                        <h2 className="text-lg font-bold tracking-tight text-slate-900">
                            Trip Details
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Customer, destination and trip
                            configuration
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Customer */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Customer Name *
                            </label>

                            <input
                                value={customerName}
                                onChange={(e) =>
                                    setCustomerName(
                                        e.target.value
                                    )
                                }
                                className={inputClass}
                            />
                        </div>

                        {/* Tour Name */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Tour Name *
                            </label>

                            <input
                                value={
                                    destination ?? ""
                                }
                                onChange={(e) =>
                                    setDestination(
                                        e.target.value
                                    )
                                }
                                className={inputClass}
                            />
                        </div>

                        {/* Start */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Start Date *
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(
                                        e.target.value
                                    )
                                }
                                className={inputClass}
                            />
                        </div>

                        {/* End */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                End Date *
                            </label>

                            <input
                                type="date"
                                min={startDate}
                                value={endDate}
                                onChange={(e) =>
                                    setEndDate(
                                        e.target.value
                                    )
                                }
                                className={inputClass}
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Duration
                            </label>

                            <input
                                readOnly
                                value={duration}
                                placeholder="Auto calculated"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-600 shadow-sm outline-none"
                            />
                        </div>

                        {/* Pax */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                No. of Pax
                            </label>

                            <input
                                type="number"
                                min={1}
                                value={
                                    pax < 1
                                        ? ""
                                        : pax
                                }
                                onChange={(e) => {
                                    const val =
                                        e.target
                                            .value;

                                    if (val === "") {
                                        setPax(0);
                                    } else {
                                        const num =
                                            Number(
                                                val
                                            );

                                        setPax(num);
                                    }
                                }}
                                onBlur={(e) => {
                                    const val =
                                        Number(
                                            e.target
                                                .value
                                        );

                                    if (
                                        val < 1 ||
                                        isNaN(val)
                                    ) {
                                        setPax(1);
                                    }
                                }}
                                className={inputClass}
                            />
                        </div>

                        {/* Firm */}
                        <div className="relative">
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Firm
                            </label>

                            <input
                                value={firmSearch}
                                onChange={(e) => {
                                    setFirmSearch(
                                        e.target.value
                                    );
                                    setFirmId("");
                                    setShowFirmResults(
                                        true
                                    );
                                }}
                                onFocus={() =>
                                    setShowFirmResults(
                                        true
                                    )
                                }
                                onBlur={() => {
                                    setTimeout(() => {
                                        setShowFirmResults(
                                            false
                                        );
                                    }, 150);
                                }}
                                placeholder="Search firm..."
                                className={inputClass}
                            />

                            {showFirmResults &&
                                firmSearch.trim() && (
                                    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                                        {filteredFirms.length >
                                            0 ? (
                                            filteredFirms.map(
                                                (
                                                    firm
                                                ) => (
                                                    <button
                                                        key={
                                                            firm.id
                                                        }
                                                        type="button"
                                                        onMouseDown={(
                                                            e
                                                        ) => {
                                                            e.preventDefault();

                                                            setFirmId(
                                                                firm.id
                                                            );
                                                            setFirmSearch(
                                                                firm.name
                                                            );
                                                            setShowFirmResults(
                                                                false
                                                            );
                                                        }}
                                                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                                                    >
                                                        {
                                                            firm.name
                                                        }
                                                    </button>
                                                )
                                            )
                                        ) : (
                                            <div className="px-3 py-3 text-sm text-slate-500">
                                                No firms
                                                found.
                                            </div>
                                        )}
                                    </div>
                                )}

                            {firmId &&
                                selectedFirm && (
                                    <p className="mt-1.5 text-xs text-slate-400">
                                        Selected:{" "}
                                        {
                                            selectedFirm.name
                                        }
                                    </p>
                                )}
                        </div>

                        {/* Region */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Region
                            </label>

                            <select
                                value={regionId}
                                onChange={(e) =>
                                    setRegionId(
                                        e.target.value
                                    )
                                }
                                className={selectClass}
                            >
                                {regions.map(
                                    (region) => (
                                        <option
                                            key={
                                                region.id
                                            }
                                            value={
                                                region.id
                                            }
                                        >
                                            {region.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* Service */}
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Service
                            </label>

                            <select
                                value={serviceId}
                                onChange={(e) => {
                                    setServiceId(
                                        e.target.value
                                    );
                                    setVehicleOptions(
                                        []
                                    );
                                    setPackageOptions(
                                        []
                                    );
                                }}
                                className={selectClass}
                            >
                                {services.map(
                                    (service) => (
                                        <option
                                            key={
                                                service.id
                                            }
                                            value={
                                                service.id
                                            }
                                        >
                                            {service.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Vehicle */}
                <section className={sectionClass}>
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                Vehicle Options
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Add one or more vehicle
                                options with quoted
                                prices.
                            </p>
                        </div>

                        <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                            <input
                                type="checkbox"
                                checked={
                                    vehicleEnabled
                                }
                                onChange={(e) =>
                                    setVehicleEnabled(
                                        e.target
                                            .checked
                                    )
                                }
                                className="h-4 w-4 rounded border-slate-300"
                            />

                            Include vehicle
                        </label>
                    </div>

                    {vehicleEnabled && (
                        <div className="space-y-3">
                            {vehicleOptions.map(
                                (
                                    option,
                                    index
                                ) => (
                                    <div
                                        key={index}
                                        className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm transition hover:border-slate-300 hover:bg-white md:grid-cols-[1fr_220px_auto]"
                                    >
                                        <div>
                                            {index ===
                                                0 && (
                                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Vehicle
                                                    </label>
                                                )}

                                            <select
                                                value={
                                                    option.vehicleId
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateVehicle(
                                                        index,
                                                        "vehicleId",
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={
                                                    selectClass
                                                }
                                            >
                                                <option value="">
                                                    Select
                                                    vehicle
                                                </option>

                                                {vehicles.map(
                                                    (
                                                        vehicle
                                                    ) => (
                                                        <option
                                                            key={
                                                                vehicle.id
                                                            }
                                                            value={
                                                                vehicle.id
                                                            }
                                                        >
                                                            {
                                                                vehicle.name
                                                            }{" "}
                                                            ·{" "}
                                                            {
                                                                vehicle.seatingCapacity
                                                            }{" "}
                                                            seats
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            {index ===
                                                0 && (
                                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Price
                                                    </label>
                                                )}

                                            <input
                                                type="number"
                                                min={0}
                                                value={
                                                    option.price ||
                                                    ""
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateVehicle(
                                                        index,
                                                        "price",
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="₹ Quoted price"
                                                className={
                                                    inputClass
                                                }
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeVehicle(
                                                        index
                                                    )
                                                }
                                                className="w-full rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}

                            <button
                                type="button"
                                onClick={
                                    addVehicle
                                }
                                className="inline-flex items-center rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                + Add Vehicle
                            </button>
                        </div>
                    )}
                </section>

                {/* Package Pricing */}
                {selectedService?.pricingModel ===
                    "package" && (
                        <section
                            className={
                                sectionClass
                            }
                        >
                            {packageOptions.length ===
                                0 ? (
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                            Package
                                            Pricing
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Optional
                                            package
                                            pricing.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            addPackageOption
                                        }
                                        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        + Add Package
                                        Pricing
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-5 flex items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                                Package
                                                Pricing
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Add
                                                package
                                                options
                                                and
                                                quoted
                                                prices.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPackageOptions(
                                                    []
                                                )
                                            }
                                            className="text-sm font-medium text-red-600 hover:underline"
                                        >
                                            Remove package
                                            pricing
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {packageOptions.map(
                                            (
                                                option,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm md:grid-cols-[1fr_220px_auto]"
                                                >
                                                    <div>
                                                        {index ===
                                                            0 && (
                                                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                                    Package
                                                                </label>
                                                            )}

                                                        <select
                                                            value={
                                                                option.packageId
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updatePackageOption(
                                                                    index,
                                                                    "packageId",
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                selectClass
                                                            }
                                                        >
                                                            <option value="">
                                                                Select
                                                                package
                                                            </option>

                                                            {selectedService.packageOptions?.map(
                                                                (
                                                                    packageOption
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            packageOption.id
                                                                        }
                                                                        value={
                                                                            packageOption.id
                                                                        }
                                                                    >
                                                                        {
                                                                            packageOption.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        {index ===
                                                            0 && (
                                                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                                    Price
                                                                </label>
                                                            )}

                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={
                                                                option.price
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updatePackageOption(
                                                                    index,
                                                                    "price",
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="₹ Package price"
                                                            className={
                                                                inputClass
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removePackageOption(
                                                                    index
                                                                )
                                                            }
                                                            className="w-full rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )}

                                        <button
                                            type="button"
                                            onClick={
                                                addPackageOption
                                            }
                                            className="inline-flex items-center rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                                        >
                                            + Add Another
                                            Package
                                        </button>
                                    </div>
                                </>
                            )}
                        </section>
                    )}

                {/* Hotels */}
                <section className={sectionClass}>
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                Hotels
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Add hotel stays and
                                meal plans to the
                                itinerary.
                            </p>
                        </div>

                        <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                            <input
                                type="checkbox"
                                checked={
                                    hotelEnabled
                                }
                                onChange={(e) =>
                                    setHotelEnabled(
                                        e.target
                                            .checked
                                    )
                                }
                                className="h-4 w-4 rounded border-slate-300"
                            />

                            Include hotel details
                        </label>
                    </div>

                    {hotelEnabled && (
                        <div className="space-y-4">
                            {hotels.map(
                                (
                                    hotel,
                                    index
                                ) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <p className="text-sm font-bold text-slate-800">
                                                Hotel{" "}
                                                {index +
                                                    1}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeHotel(
                                                        index
                                                    )
                                                }
                                                className="text-xs font-medium text-red-600 transition hover:text-red-700 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            <input
                                                value={
                                                    hotel.destination
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateHotel(
                                                        index,
                                                        "destination",
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Destination"
                                                className={
                                                    inputClass
                                                }
                                            />

                                            <input
                                                value={
                                                    hotel.name ??
                                                    ""
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateHotel(
                                                        index,
                                                        "name",
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Hotel name"
                                                className={
                                                    inputClass
                                                }
                                            />

                                            <input
                                                type="date"
                                                value={
                                                    hotel.checkIn
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateHotel(
                                                        index,
                                                        "checkIn",
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={
                                                    inputClass
                                                }
                                            />

                                            <input
                                                type="date"
                                                value={
                                                    hotel.checkOut
                                                }
                                                min={
                                                    hotel.checkIn
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateHotel(
                                                        index,
                                                        "checkOut",
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={
                                                    inputClass
                                                }
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
                                                className={inputClass}
                                            />

                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={hotel.rooms ?? 1}
                                                onChange={(e) =>
                                                    updateHotel(
                                                        index,
                                                        "rooms",
                                                        Math.max(
                                                            1,
                                                            Number(e.target.value) || 1
                                                        )
                                                    )
                                                }
                                                placeholder="No. of rooms"
                                                className={inputClass}
                                            />

                                            <select
                                                value={
                                                    hotel.mealPlan ??
                                                    ""
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateHotel(
                                                        index,
                                                        "mealPlan",
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={
                                                    selectClass
                                                }
                                            >
                                                <option value="">
                                                    Select
                                                    meal
                                                    plan
                                                </option>

                                                <option value="EP">
                                                    EP – Room
                                                    Only
                                                </option>

                                                <option value="CP">
                                                    CP –
                                                    Breakfast
                                                </option>

                                                <option value="MAP">
                                                    MAP –
                                                    Breakfast
                                                    + Dinner
                                                </option>

                                                <option value="AP">
                                                    AP –
                                                    Breakfast
                                                    + Lunch
                                                    + Dinner
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                )
                            )}

                            <button
                                type="button"
                                onClick={addHotel}
                                className="inline-flex items-center rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                + Add Hotel
                            </button>
                        </div>
                    )}
                </section>

                {/* Editor */}
                <section className="rounded-2xl border border-slate-200 bg-white shadow-md">
                    <div className="sticky top-0 z-50 border-b border-slate-200 bg-slate-50/95 p-2.5 shadow-sm backdrop-blur">
                        <div className="flex flex-wrap items-center gap-1">
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBold()
                                        .run()
                                }
                            >
                                <strong>B</strong>
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleItalic()
                                        .run()
                                }
                            >
                                <em>I</em>
                            </ToolbarButton>

                            <div className="mx-1 h-5 w-px bg-slate-200" />

                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({
                                            level: 2,
                                        })
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
                                        .toggleHeading({
                                            level: 3,
                                        })
                                        .run()
                                }
                            >
                                H3
                            </ToolbarButton>

                            <div className="mx-1 h-5 w-px bg-slate-200" />

                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                            >
                                • List
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                }
                            >
                                1. List
                            </ToolbarButton>

                            <div className="mx-1 h-5 w-px bg-slate-200" />

                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .undo()
                                        .run()
                                }
                            >
                                Undo
                            </ToolbarButton>

                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .redo()
                                        .run()
                                }
                            >
                                Redo
                            </ToolbarButton>
                        </div>
                    </div>

                    <div className="min-h-[700px] bg-slate-100/70 p-6 md:p-10">
                        <div className="mx-auto min-h-[620px] max-w-4xl rounded-xl bg-white px-8 py-10 shadow-sm ring-1 ring-slate-200 md:px-12 md:py-12">
                            <EditorContent
                                editor={editor}
                            />
                        </div>
                    </div>
                </section>
            </div>

            <button
                type="button"
                onClick={() =>
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    })
                }
                className="fixed bottom-5 right-5 z-50 rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-lg transition hover:bg-slate-50"
                aria-label="Back to top"
            >
                ↑
            </button>
        </main>
    );
}

export default function EditItineraryPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-slate-50">
                    <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
                        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800" />

                        <p className="text-sm font-medium text-slate-600">
                            Loading itinerary...
                        </p>
                    </div>
                </main>
            }
        >
            <EditItineraryContent />
        </Suspense>
    );
}