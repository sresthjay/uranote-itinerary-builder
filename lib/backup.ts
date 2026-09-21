import {
    DB_NAME,
    openDB,
} from "@/lib/db";

/*
|--------------------------------------------------------------------------
| Complete Application Data Backup (Export / Import)
|--------------------------------------------------------------------------
|
| Reads the entire existing IndexedDB dataset (every object store) into a
| versioned, self-contained JSON envelope and restores it atomically.
|
| The backup intentionally stores the raw records straight from IndexedDB so
| future fields are preserved without hard-coding a field list here.
|
|--------------------------------------------------------------------------
*/

export const BACKUP_FORMAT =
    "uranote-itinerary-backup";
export const BACKUP_VERSION = 1;
export const BACKUP_SUPPORTED_VERSIONS = [
    BACKUP_VERSION,
];

export interface BackupData {
    [storeName: string]: unknown[];
}

export interface BackupEnvelope {
    format: string;
    version: number;
    exportedAt: string;
    database: string;
    data: BackupData;
}

export interface BackupPreview {
    itineraryCount: number;
    exportedAt: string;
}

export class BackupError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BackupError";
    }
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getAllRecords(
    db: IDBDatabase,
    storeName: string
): Promise<unknown[]> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            storeName,
            "readonly"
        );

        const store =
            transaction.objectStore(
                storeName
            );

        const request = store.getAll();

        request.onerror = () =>
            reject(request.error);
        transaction.onerror = () =>
            reject(transaction.error);
        transaction.oncomplete = () =>
            resolve(request.result);
    });
}

function createFileName(): string {
    const now = new Date();

    const pad = (value: number) =>
        String(value).padStart(2, "0");

    const stamp = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
        "-",
        pad(now.getHours()),
        pad(now.getMinutes()),
    ].join("");

    return `uranote-itinerary-backup-${stamp}.json`;
}

function readFileText(
    file: File
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () =>
            resolve(
                String(reader.result ?? "")
            );

        reader.onerror = () =>
            reject(reader.error);

        reader.readAsText(file);
    });
}

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export async function exportBackup(): Promise<void> {
    const db = await openDB();

    try {
        const data: BackupData = {};

        for (const storeName of Array.from(
            db.objectStoreNames
        )) {
            data[storeName] =
                await getAllRecords(
                    db,
                    storeName
                );
        }

        const backup: BackupEnvelope = {
            format: BACKUP_FORMAT,
            version: BACKUP_VERSION,
            exportedAt:
                new Date().toISOString(),
            database: DB_NAME,
            data,
        };

        const json = JSON.stringify(
            backup,
            null,
            2
        );

        const blob = new Blob([json], {
            type: "application/json",
        });

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download = createFileName();

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    } finally {
        db.close();
    }
}

/*
|--------------------------------------------------------------------------
| Read + Validate
|--------------------------------------------------------------------------
*/

export function parseBackupText(
    text: string
): {
    envelope: BackupEnvelope;
    preview: BackupPreview;
} {
    let parsed: unknown;

    try {
        parsed = JSON.parse(text);
    } catch {
        throw new BackupError(
            "This file is not a valid JSON backup."
        );
    }

    if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
    ) {
        throw new BackupError(
            "This file is not a Uranote Itinerary backup file."
        );
    }

    const record =
        parsed as Partial<BackupEnvelope>;

    if (record.format !== BACKUP_FORMAT) {
        throw new BackupError(
            "This file is not a Uranote Itinerary backup file."
        );
    }

    if (typeof record.version !== "number") {
        throw new BackupError(
            "This backup file is missing a version number."
        );
    }

    if (
        !BACKUP_SUPPORTED_VERSIONS.includes(
            record.version
        )
    ) {
        if (record.version > BACKUP_VERSION) {
            throw new BackupError(
                "This backup was created by a newer version of the app and cannot be imported by this version."
            );
        }

        throw new BackupError(
            "This backup uses an unsupported format version."
        );
    }

    if (
        !record.data ||
        typeof record.data !== "object" ||
        Array.isArray(record.data)
    ) {
        throw new BackupError(
            "This backup file is missing valid data."
        );
    }

    for (const [
        storeName,
        records,
    ] of Object.entries(record.data)) {
        if (!Array.isArray(records)) {
            throw new BackupError(
                `This backup contains invalid data for the "${storeName}" store.`
            );
        }
    }

    const envelope =
        record as BackupEnvelope;

    return {
        envelope,
        preview: {
            itineraryCount: Array.isArray(
                record.data.itineraries
            )
                ? record.data.itineraries.length
                : 0,
            exportedAt:
                typeof record.exportedAt ===
                "string"
                    ? record.exportedAt
                    : "",
        },
    };
}

export async function readBackupFile(
    file: File
): Promise<{
    envelope: BackupEnvelope;
    preview: BackupPreview;
}> {
    const text = await readFileText(file);

    return parseBackupText(text);
}

/*
|--------------------------------------------------------------------------
| Import (REPLACE ALL)
|--------------------------------------------------------------------------
|
| Restores the backup inside a single readwrite transaction spanning every
| store that exists in both the backup and the current database, so the
| replacement is atomic: clear + insert either all succeed or all roll back.
|
| Validation happens before any write, so existing data is never touched
| until the backup is known to be valid.
|
|--------------------------------------------------------------------------
*/

export async function restoreBackup(
    envelope: BackupEnvelope
): Promise<void> {
    const db = await openDB();

    try {
        const existingStores = Array.from(
            db.objectStoreNames
        );

        const backupStores = Object.keys(
            envelope.data
        );

        const missingStore = backupStores.find(
            (storeName) =>
                !existingStores.includes(
                    storeName
                )
        );

        if (missingStore) {
            throw new BackupError(
                `This backup contains data for a store ("${missingStore}") that is not supported by this version of the app.`
            );
        }

        const storeNamesToWrite =
            existingStores.filter(
                (storeName) =>
                    backupStores.includes(
                        storeName
                    )
            );

        if (storeNamesToWrite.length === 0) {
            throw new BackupError(
                "This backup contains no data that can be restored on this device."
            );
        }

        // Validate every record before touching an existing record.
        for (const storeName of storeNamesToWrite) {
            const records =
                envelope.data[storeName];

            const keyPath = db.transaction(
                storeName
            ).objectStore(
                storeName
            ).keyPath;

            const idKey =
                typeof keyPath === "string"
                    ? keyPath
                    : null;

            for (const record of records) {
                if (
                    !record ||
                    typeof record !==
                        "object" ||
                    Array.isArray(record)
                ) {
                    throw new BackupError(
                        `This backup contains an invalid record in the "${storeName}" store.`
                    );
                }

                if (
                    idKey &&
                    !(record as Record<
                        string,
                        unknown
                    >)[idKey]
                ) {
                    throw new BackupError(
                        `This backup contains a record in "${storeName}" that is missing its "${idKey}" key.`
                    );
                }
            }
        }

        // Atomic replace: clear every store, then insert the backup records,
        // all inside one transaction so a failure rolls everything back.
        await new Promise<void>(
            (resolve, reject) => {
                const transaction =
                    db.transaction(
                        storeNamesToWrite,
                        "readwrite"
                    );

                transaction.oncomplete = () =>
                    resolve();
                transaction.onerror = () =>
                    reject(
                        transaction.error ??
                            new BackupError(
                                "Failed to write the backup to this device."
                            )
                    );
                transaction.onabort = () =>
                    reject(
                        transaction.error ??
                            new BackupError(
                                "The restore was cancelled by the browser."
                            )
                    );

                for (const storeName of storeNamesToWrite) {
                    const store =
                        transaction.objectStore(
                            storeName
                        );

                    const records =
                        envelope.data[
                            storeName
                        ];

                    store.clear();

                    for (const record of records) {
                        store.put(record);
                    }
                }
            }
        );
    } finally {
        db.close();
    }
}