"use client";

<style jsx global>{`
    input,
    select,
    textarea {
        color: #111827;
    }

    input::placeholder,
    textarea::placeholder {
        color: #9ca3af;
    }

    select {
        background-color: white;
    }
`}</style>

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    getItineraries,
    deleteItinerary,
    Itinerary,
} from "@/lib/db";

function formatDate(date: string) {
    if (!date) return "";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return "";

    return value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function HomePage() {
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const loadItineraries = async () => {
        try {
            const data = await getItineraries();

            const sorted = [...data].sort((a, b) => {
                const dateA = new Date(
                    a.updatedAt ?? a.createdAt
                ).getTime();

                const dateB = new Date(
                    b.updatedAt ?? b.createdAt
                ).getTime();

                return dateB - dateA;
            });

            setItineraries(sorted);
        } catch (error) {
            console.error(
                "Failed to load itineraries:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItineraries();
    }, []);

    const filteredItineraries = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return itineraries;
        }

        return itineraries.filter((itinerary) =>
            [
                itinerary.title,
                itinerary.customerName,
                itinerary.destination,
            ]
                .filter(Boolean)
                .some((value) =>
                    value.toLowerCase().includes(query)
                )
        );
    }, [itineraries, search]);

    const handleDelete = async (
        itinerary: Itinerary
    ) => {
        const confirmed = window.confirm(
            `Delete "${itinerary.title}"?`
        );

        if (!confirmed) return;

        try {
            await deleteItinerary(itinerary.id);

            setItineraries((current) =>
                current.filter(
                    (item) => item.id !== itinerary.id
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete itinerary:",
                error
            );

            alert("Failed to delete itinerary.");
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-gray-900">
            {/* Top Navigation */}
            <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-[#f7f7f5]/95 backdrop-blur">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
                    <Link
                        href="/"
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white shadow-sm">
                            U
                        </div>

                        <div>
                            <div className="text-[15px] font-semibold tracking-tight text-gray-950">
                                Uranote
                            </div>

                            <div className="text-[11px] font-medium tracking-wide text-gray-400">
                                ITINERARY BUILDER
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/itinerary/new"
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md"
                    >
                        <span className="text-base leading-none">
                            +
                        </span>
                        New Itinerary
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
                {/* Hero */}
                <section className="mb-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 shadow-sm">
                                Workspace
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                                Your itineraries
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                                Create, customise and manage travel
                                itineraries from one place.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                    Total
                                </p>

                                <p className="mt-0.5 text-xl font-semibold tracking-tight text-gray-950">
                                    {itineraries.length}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                    Showing
                                </p>

                                <p className="mt-0.5 text-xl font-semibold tracking-tight text-gray-950">
                                    {filteredItineraries.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search */}
                <section className="mb-6">
                    <div className="relative max-w-xl">
                        <svg
                            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                            />
                            <path d="m20 20-4-4" />
                        </svg>

                        <input
                            type="search"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search by customer, destination or itinerary..."
                            className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-100"
                        />
                    </div>
                </section>

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />

                        <p className="text-sm font-medium text-gray-600">
                            Loading your itineraries...
                        </p>
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    itineraries.length === 0 && (
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex flex-col items-center px-6 py-20 text-center">

                                <h2 className="text-lg font-semibold tracking-tight text-gray-950">
                                    No itineraries yet
                                </h2>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                                    Create your first itinerary and
                                    it will appear here for quick
                                    access later.
                                </p>

                                <Link
                                    href="/itinerary/new"
                                    className="mt-6 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
                                >
                                    Create your first itinerary
                                </Link>
                            </div>
                        </div>
                    )}

                {/* No Results */}
                {!loading &&
                    itineraries.length > 0 &&
                    filteredItineraries.length === 0 && (
                        <div className="rounded-2xl border border-gray-200 bg-white p-14 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                                ?
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900">
                                No matching itineraries
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Try a different customer name or
                                destination.
                            </p>
                        </div>
                    )}

                {/* Itinerary Cards */}
                {!loading &&
                    filteredItineraries.length > 0 && (
                        <div className="grid gap-4">
                            {filteredItineraries.map(
                                (itinerary) => (
                                    <article
                                        key={itinerary.id}
                                        className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md sm:p-6"
                                    >
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                            <Link
                                                href={`/itinerary/edit?id=${itinerary.id}`}
                                                className="min-w-0 flex-1"
                                            >
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="truncate text-base font-semibold tracking-tight text-gray-950 sm:text-lg">
                                                        {
                                                            itinerary.title
                                                        }
                                                    </h2>

                                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                                                        Itinerary
                                                    </span>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                                                    <div>
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                                            Customer
                                                        </p>

                                                        <p className="mt-0.5 text-sm font-medium text-gray-800">
                                                            {
                                                                itinerary.customerName
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="hidden h-7 w-px bg-gray-200 sm:block" />

                                                    <div>
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                                            Destination
                                                        </p>

                                                        <p className="mt-0.5 text-sm font-medium text-gray-800">
                                                            {
                                                                itinerary.destination
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="hidden h-7 w-px bg-gray-200 sm:block" />

                                                    <div>
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                                            Travellers
                                                        </p>

                                                        <p className="mt-0.5 text-sm font-medium text-gray-800">
                                                            {
                                                                itinerary.pax
                                                            }{" "}
                                                            Pax
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="mt-4 text-[11px] text-gray-400">
                                                    Created{" "}
                                                    {formatDate(
                                                        itinerary.createdAt
                                                    )}

                                                    {itinerary.updatedAt && (
                                                        <>
                                                            {" "}
                                                            · Updated{" "}
                                                            {formatDate(
                                                                itinerary.updatedAt
                                                            )}
                                                        </>
                                                    )}
                                                </p>
                                            </Link>

                                            <div className="flex shrink-0 items-center gap-2 border-t border-gray-100 pt-4 lg:border-0 lg:pt-0">
                                                <Link
                                                    href={`/itinerary/edit?id=${itinerary.id}`}
                                                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            itinerary
                                                        )
                                                    }
                                                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    )}
            </div>
        </main>
    );
}