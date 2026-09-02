"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
    getItinerary,
    Itinerary,
} from "@/lib/db";

import ItineraryForm from "@/components/ItineraryForm";

export default function EditItineraryPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [itinerary, setItinerary] =
        useState<Itinerary | null>(null);

    const [loading, setLoading] =
        useState(Boolean(id));

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!id) {
            setItinerary(null);
            setError("");
            setLoading(false);
            return;
        }

        const itineraryId = id;

        let cancelled = false;

        setLoading(true);
        setError("");
        setItinerary(null);

        async function loadItinerary() {
            try {
                const result = await getItinerary(itineraryId);

                if (cancelled) {
                    return;
                }

                if (!result) {
                    setError("Itinerary not found.");
                    setLoading(false);
                    return;
                }

                setItinerary(result);
                setLoading(false);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load itinerary:",
                    error
                );

                setError("Failed to load itinerary.");
                setLoading(false);
            }
        }

        loadItinerary();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (!id) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
                    <p className="text-sm text-red-600">
                        Itinerary ID is missing.
                    </p>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading itinerary...
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            </main>
        );
    }

    if (!itinerary) {
        return null;
    }

    return (
        <ItineraryForm
            key={itinerary.id}
            mode="edit"
            initialItinerary={itinerary}
        />
    );
}