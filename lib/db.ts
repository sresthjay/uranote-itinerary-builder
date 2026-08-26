const DB_NAME = "itinerary-builder";
const DB_VERSION = 1;
const STORE_NAME = "itineraries";

export interface Hotel {
  destination: string;
  name: string;
  checkIn: string;
  checkOut: string;
  roomType?: string;
  mealPlan?: string;
}

export interface VehicleOption {
  vehicleId: string;
  price: number;
}

export interface Itinerary {
  id: string;

  title: string;

  firmId: string;
  regionId: string;
  serviceId: string;

  customerName: string;
  destination: string;
  startDate: string;
  endDate: string;
  pax: number;

  vehicleEnabled: boolean;
  vehicleOptions: VehicleOption[];

  packageOptions?: {
    packageId: string;
    price: string;
  }[];
  
  hotelEnabled: boolean;
  hotels?: Hotel[];

  content: string;

  createdAt: string;
  updatedAt?: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveItinerary(
  itinerary: Itinerary
): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.put(itinerary);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function getItineraries(): Promise<Itinerary[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function getItinerary(
  id: string
): Promise<Itinerary | undefined> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(id);

    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function deleteItinerary(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.delete(id);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}