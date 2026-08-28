import { Suspense } from "react";
import EditItineraryClient from "./page-client";

function Loading() {
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

export default function EditItineraryPage() {
    return (
        <Suspense fallback={<Loading />}>
            <EditItineraryClient />
        </Suspense>
    );
}