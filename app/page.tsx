"use client";

<style jsx global>{`
    html:not(.dark) input,
    html:not(.dark) select,
    html:not(.dark) textarea {
        color: #111827;
    }

    html:not(.dark) input::placeholder,
    html:not(.dark) textarea::placeholder {
        color: #9ca3af;
    }

    html:not(.dark) select {
        background-color: white;
    }
`}</style>

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import ThemeToggle from "@/components/ThemeToggle";

import {
    getItineraries,
    deleteItinerary,
    Itinerary,
} from "@/lib/db";

import {
    exportBackup,
    readBackupFile,
    restoreBackup,
    BackupEnvelope,
    BackupError,
    BackupPreview,
} from "@/lib/backup";

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

function formatExportDate(date: string) {
    if (!date) return "";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return "";

    return value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function HomePage() {
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [exporting, setExporting] =
        useState(false);
    const [importing, setImporting] =
        useState(false);
    const [dataOpen, setDataOpen] =
        useState(false);
    const [
        backupPreview,
        setBackupPreview,
    ] = useState<{
        envelope: BackupEnvelope;
        preview: BackupPreview;
    } | null>(null);
    const [backupMessage, setBackupMessage] =
        useState<{
            type: "success" | "error";
            text: string;
        } | null>(null);
    const fileInputRef =
        useRef<HTMLInputElement>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await getItineraries();

                if (cancelled) {
                    return;
                }

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
                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load itineraries:",
                    error
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
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

    const handleExportData = async () => {
        setExporting(true);
        setBackupMessage(null);

        try {
            await exportBackup();

            setBackupMessage({
                type: "success",
                text: "Backup exported successfully.",
            });
        } catch (error) {
            console.error(
                "Failed to export backup:",
                error
            );

            setBackupMessage({
                type: "error",
                text: "Failed to export backup.",
            });
        } finally {
            setExporting(false);
        }
    };

    const handleImportFile = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file) return;

        setBackupMessage(null);

        try {
            const result =
                await readBackupFile(file);

            setBackupPreview(result);
        } catch (error) {
            console.error(
                "Failed to read backup file:",
                error
            );

            setBackupMessage({
                type: "error",
                text:
                    error instanceof BackupError
                        ? error.message
                        : "Failed to read backup file.",
            });
        }
    };

    const handleCancelImport = () => {
        setBackupPreview(null);
    };

    const handleConfirmImport = async () => {
        if (!backupPreview) return;

        setImporting(true);

        try {
            await restoreBackup(
                backupPreview.envelope
            );

            setBackupPreview(null);
            setBackupMessage({
                type: "success",
                text: "Backup imported successfully. Reloading...",
            });

            window.setTimeout(() => {
                window.location.reload();
            }, 1200);
        } catch (error) {
            console.error(
                "Failed to import backup:",
                error
            );

            setBackupPreview(null);

            setBackupMessage({
                type: "error",
                text:
                    error instanceof BackupError
                        ? error.message
                        : "Failed to import backup.",
            });

            setImporting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f7f5] dark:bg-slate-950 text-gray-900 dark:text-slate-100">
            {/* Top Navigation */}
            <header className="sticky top-0 z-20 border-b border-gray-200 dark:border-slate-800/80 bg-[#f7f7f5]/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
                    <Link
                        href="/"
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white shadow-sm dark:bg-slate-100 dark:text-slate-900">
                            U
                        </div>

                        <div>
                            <div className="text-[15px] font-semibold tracking-tight text-gray-950 dark:text-slate-50">
                                Uranote
                            </div>

                            <div className="text-[11px] font-medium tracking-wide text-gray-400 dark:text-slate-500">
                                ITINERARY BUILDER
                            </div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <ThemeToggle />

                        <Link
                            href="/itinerary/new"
                            className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                        >
                            <span className="text-base leading-none">
                                +
                            </span>
                            New Itinerary
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
                {/* Data Backup */}
                <section className="mb-8">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <button
                            type="button"
                            onClick={() =>
                                setDataOpen((current) => !current)
                            }
                            aria-expanded={dataOpen}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50 dark:hover:bg-slate-800 sm:px-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
                                        <path d="m3 8 9 5 9-5" />
                                        <path d="M12 13v8" />
                                    </svg>
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold tracking-tight text-gray-950 dark:text-slate-50">
                                        Data backup
                                    </h2>

                                    <p className="text-[11px] font-medium tracking-wide text-gray-400 dark:text-slate-500">
                                        Export / import all
                                        itineraries
                                    </p>
                                </div>
                            </div>

                            <svg
                                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 dark:text-slate-500 ${dataOpen ? "rotate-180" : ""}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {dataOpen && (
                            <div className="border-t border-gray-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                                <p className="text-sm leading-6 text-gray-500 dark:text-slate-400">
                                    Export all itineraries stored on
                                    this device to a backup file, or
                                    restore them from a backup on
                                    another device.
                                </p>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={handleExportData}
                                        disabled={exporting}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                                    >
                                        {exporting
                                            ? "Exporting..."
                                            : "Export Data"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        disabled={importing}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-300 transition hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {importing
                                            ? "Importing..."
                                            : "Import Data"}
                                    </button>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json,application/json"
                                    className="hidden"
                                    onChange={handleImportFile}
                                />

                                {backupMessage && (
                                    <p
                                        className={`mt-4 text-sm ${backupMessage.type === "success"
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        {backupMessage.text}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Hero */}
                <section className="mb-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 shadow-sm">
                                Workspace
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 dark:text-slate-50 sm:text-4xl">
                                Your itineraries
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-slate-400">
                                Create, customise and manage travel
                                itineraries from one place.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 shadow-sm">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
                                    Total
                                </p>

                                <p className="mt-0.5 text-xl font-semibold tracking-tight text-gray-950 dark:text-slate-50">
                                    {itineraries.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search */}
                <section className="mb-6">
                    <div className="relative max-w-xl">
                        <svg
                            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500"
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
                            className="h-12 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-4 text-sm text-gray-900 dark:text-slate-100 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 dark:focus:border-slate-500 focus:ring-4 focus:ring-gray-100 dark:focus:ring-slate-800"
                        />
                    </div>
                </section>

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 dark:border-slate-700 border-t-gray-900 dark:border-t-slate-100" />

                        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                            Loading your itineraries...
                        </p>
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    itineraries.length === 0 && (
                        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <div className="flex flex-col items-center px-6 py-20 text-center">

                                <h2 className="text-lg font-semibold tracking-tight text-gray-950 dark:text-slate-50">
                                    No itineraries yet
                                </h2>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-slate-400">
                                    Create your first itinerary and
                                    it will appear here for quick
                                    access later.
                                </p>

                                <Link
                                    href="/itinerary/new"
                                    className="mt-6 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
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
                        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-14 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                                ?
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                No matching itineraries
                            </h3>

                            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                                Try a different customer name or
                                destination.
                            </p>
                        </div>
                    )}

                {/* Itinerary Cards */}
                {!loading &&
                    filteredItineraries.length > 0 && (
                        <div className="grid min-w-0 gap-4">
                            {filteredItineraries.map(
                                (itinerary) => (
                                    <article
                                        key={itinerary.id}
                                        className="group min-w-0 overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-md sm:p-6"
                                    >
                                        <div className="flex min-w-0 w-full flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                            <a
                                                href={`/itinerary/edit?id=${itinerary.id}`}
                                                className="min-w-0 w-full flex-1 overflow-hidden"
                                            >
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="truncate text-base font-semibold tracking-tight text-gray-950 dark:text-slate-50 sm:text-lg">
                                                        {
                                                            itinerary.title
                                                        }
                                                    </h2>

                                                    <span className="rounded-full bg-gray-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                                                        Itinerary
                                                    </span>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                                                    <div>
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                                                            Customer
                                                        </p>

                                                        <p className="mt-0.5 break-words text-sm font-medium text-gray-800 dark:text-slate-200">
                                                            {
                                                                itinerary.customerName
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="hidden h-7 w-px bg-gray-200 dark:bg-slate-700 sm:block" />

                                                    <div>
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                                                            Destination
                                                        </p>

                                                        <p className="mt-0.5 break-words text-sm font-medium text-gray-800 dark:text-slate-200">
                                                            {
                                                                itinerary.destination
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="hidden h-7 w-px bg-gray-200 dark:bg-slate-700 sm:block" />

                                                    <div>
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                                                            Travellers
                                                        </p>

                                                        <p className="mt-0.5 text-sm font-medium text-gray-800 dark:text-slate-200">
                                                            {
                                                                itinerary.pax
                                                            }{" "}
                                                            Pax
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="mt-4 text-[11px] text-gray-400 dark:text-slate-500">
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
                                            </a>

                                            <div className="flex shrink-0 items-center gap-2 border-t border-gray-100 dark:border-slate-800 pt-4 lg:border-0 lg:pt-0">
                                                <a
                                                    href={`/itinerary/edit/?id=${itinerary.id}`}
                                                    className="rounded-xl border border-gray-200 dark:border-slate-800 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-300 transition hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800"
                                                >
                                                    Edit
                                                </a>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            itinerary
                                                        )
                                                    }
                                                    className="rounded-xl border border-gray-200 dark:border-slate-800 px-4 py-2.5 text-sm font-semibold text-gray-500 dark:text-slate-400 transition hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600"
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

            {/* Import Confirmation */}
            {backupPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
                        <h3 className="text-base font-semibold tracking-tight text-gray-950 dark:text-slate-50">
                            Import backup?
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-400">
                            This will replace all itineraries
                            currently stored on this device with
                            the data from this backup.
                        </p>

                        <div className="mt-4 space-y-1.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 p-4 text-sm">
                            <p className="font-semibold text-gray-800 dark:text-slate-200">
                                Backup contains{" "}
                                {
                                    backupPreview.preview
                                        .itineraryCount
                                }{" "}
                                {backupPreview.preview
                                    .itineraryCount === 1
                                    ? "itinerary"
                                    : "itineraries"}
                                .
                            </p>

                            {backupPreview.preview
                                .exportedAt && (
                                    <p className="text-gray-600 dark:text-slate-400">
                                        Exported on{" "}
                                        {formatExportDate(
                                            backupPreview
                                                .preview
                                                .exportedAt
                                        )}
                                        .
                                    </p>
                                )}
                        </div>

                        <p className="mt-4 text-sm text-gray-600 dark:text-slate-400">
                            Continue? This will replace all
                            current local data.
                        </p>

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancelImport}
                                disabled={importing}
                                className="rounded-xl border border-gray-200 dark:border-slate-800 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-300 transition hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmImport}
                                disabled={importing}
                                className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                            >
                                {importing
                                    ? "Importing..."
                                    : "Import Backup"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}