/**
 * IndexedDB Storage Service
 * Handles all client-side persistence for portfolios, positions, transactions, and settings
 */

import type {
  Portfolio,
  Position,
  Transaction,
  WatchlistItem,
  TradingSettings,
  APISettings,
} from "../types";

// ============================================================================
// Database Configuration
// ============================================================================

const DB_NAME = "papertradarr_db";
const DB_VERSION = 1;

const STORES = {
  PORTFOLIOS: "portfolios",
  POSITIONS: "positions",
  TRANSACTIONS: "transactions",
  WATCHLIST: "watchlist",
  SETTINGS: "settings",
} as const;

// ============================================================================
// Database Initialization
// ============================================================================

let dbInstance: IDBDatabase | null = null;

async function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Portfolios store
      if (!db.objectStoreNames.contains(STORES.PORTFOLIOS)) {
        const portfolioStore = db.createObjectStore(STORES.PORTFOLIOS, { keyPath: "id" });
        portfolioStore.createIndex("createdAt", "createdAt", { unique: false });
        portfolioStore.createIndex("updatedAt", "updatedAt", { unique: false });
      }

      // Positions store
      if (!db.objectStoreNames.contains(STORES.POSITIONS)) {
        const positionStore = db.createObjectStore(STORES.POSITIONS, { keyPath: "id" });
        positionStore.createIndex("portfolioId", "portfolioId", { unique: false });
        positionStore.createIndex("symbol", "symbol", { unique: false });
        positionStore.createIndex("portfolioSymbol", ["portfolioId", "symbol"], {
          unique: true,
        });
      }

      // Transactions store
      if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
        const txnStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: "id" });
        txnStore.createIndex("portfolioId", "portfolioId", { unique: false });
        txnStore.createIndex("symbol", "symbol", { unique: false });
        txnStore.createIndex("timestamp", "timestamp", { unique: false });
        txnStore.createIndex("type", "type", { unique: false });
      }

      // Watchlist store
      if (!db.objectStoreNames.contains(STORES.WATCHLIST)) {
        const watchlistStore = db.createObjectStore(STORES.WATCHLIST, { keyPath: "id" });
        watchlistStore.createIndex("symbol", "symbol", { unique: true });
        watchlistStore.createIndex("addedAt", "addedAt", { unique: false });
      }

      // Settings store (key-value pairs)
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: "key" });
      }
    };
  });
}

// ============================================================================
// Generic CRUD Operations
// ============================================================================

async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getById<T>(storeName: string, id: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function add<T>(storeName: string, data: T): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => resolve(request.result as string);
    request.onerror = () => reject(request.error);
  });
}

async function put<T>(storeName: string, data: T): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve(request.result as string);
    request.onerror = () => reject(request.error);
  });
}

async function deleteById(storeName: string, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function clear(storeName: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ============================================================================
// Portfolio Operations
// ============================================================================

export const PortfolioStorage = {
  async getAll(): Promise<Portfolio[]> {
    return getAll<Portfolio>(STORES.PORTFOLIOS);
  },

  async getById(id: string): Promise<Portfolio | null> {
    return getById<Portfolio>(STORES.PORTFOLIOS, id);
  },

  async create(portfolio: Portfolio): Promise<string> {
    return add(STORES.PORTFOLIOS, portfolio);
  },

  async update(portfolio: Portfolio): Promise<string> {
    return put(STORES.PORTFOLIOS, portfolio);
  },

  async delete(id: string): Promise<void> {
    return deleteById(STORES.PORTFOLIOS, id);
  },

  async clear(): Promise<void> {
    return clear(STORES.PORTFOLIOS);
  },
};

// ============================================================================
// Position Operations
// ============================================================================

export const PositionStorage = {
  async getAll(): Promise<Position[]> {
    return getAll<Position>(STORES.POSITIONS);
  },

  async getById(id: string): Promise<Position | null> {
    return getById<Position>(STORES.POSITIONS, id);
  },

  async getByPortfolio(portfolioId: string): Promise<Position[]> {
    return getByIndex<Position>(STORES.POSITIONS, "portfolioId", portfolioId);
  },

  async getBySymbol(symbol: string): Promise<Position[]> {
    return getByIndex<Position>(STORES.POSITIONS, "symbol", symbol);
  },

  async getByPortfolioAndSymbol(portfolioId: string, symbol: string): Promise<Position | null> {
    const positions = await getByIndex<Position>(STORES.POSITIONS, "portfolioSymbol", [
      portfolioId,
      symbol,
    ]);
    return positions[0] || null;
  },

  async create(position: Position): Promise<string> {
    return add(STORES.POSITIONS, position);
  },

  async update(position: Position): Promise<string> {
    return put(STORES.POSITIONS, position);
  },

  async delete(id: string): Promise<void> {
    return deleteById(STORES.POSITIONS, id);
  },

  async deleteByPortfolio(portfolioId: string): Promise<void> {
    const positions = await this.getByPortfolio(portfolioId);
    await Promise.all(positions.map(p => deleteById(STORES.POSITIONS, p.id)));
  },

  async clear(): Promise<void> {
    return clear(STORES.POSITIONS);
  },
};

// ============================================================================
// Transaction Operations
// ============================================================================

export const TransactionStorage = {
  async getAll(): Promise<Transaction[]> {
    return getAll<Transaction>(STORES.TRANSACTIONS);
  },

  async getById(id: string): Promise<Transaction | null> {
    return getById<Transaction>(STORES.TRANSACTIONS, id);
  },

  async getByPortfolio(portfolioId: string): Promise<Transaction[]> {
    return getByIndex<Transaction>(STORES.TRANSACTIONS, "portfolioId", portfolioId);
  },

  async getBySymbol(symbol: string): Promise<Transaction[]> {
    return getByIndex<Transaction>(STORES.TRANSACTIONS, "symbol", symbol);
  },

  async create(transaction: Transaction): Promise<string> {
    return add(STORES.TRANSACTIONS, transaction);
  },

  async delete(id: string): Promise<void> {
    return deleteById(STORES.TRANSACTIONS, id);
  },

  async deleteByPortfolio(portfolioId: string): Promise<void> {
    const transactions = await this.getByPortfolio(portfolioId);
    await Promise.all(transactions.map(t => deleteById(STORES.TRANSACTIONS, t.id)));
  },

  async clear(): Promise<void> {
    return clear(STORES.TRANSACTIONS);
  },
};

// ============================================================================
// Watchlist Operations
// ============================================================================

export const WatchlistStorage = {
  async getAll(): Promise<WatchlistItem[]> {
    return getAll<WatchlistItem>(STORES.WATCHLIST);
  },

  async getById(id: string): Promise<WatchlistItem | null> {
    return getById<WatchlistItem>(STORES.WATCHLIST, id);
  },

  async getBySymbol(symbol: string): Promise<WatchlistItem | null> {
    const items = await getByIndex<WatchlistItem>(STORES.WATCHLIST, "symbol", symbol);
    return items[0] || null;
  },

  async add(item: WatchlistItem): Promise<string> {
    return add(STORES.WATCHLIST, item);
  },

  async update(item: WatchlistItem): Promise<string> {
    return put(STORES.WATCHLIST, item);
  },

  async delete(id: string): Promise<void> {
    return deleteById(STORES.WATCHLIST, id);
  },

  async deleteBySymbol(symbol: string): Promise<void> {
    const item = await this.getBySymbol(symbol);
    if (item) {
      await deleteById(STORES.WATCHLIST, item.id);
    }
  },

  async clear(): Promise<void> {
    return clear(STORES.WATCHLIST);
  },
};

// ============================================================================
// Settings Operations
// ============================================================================

export const SettingsStorage = {
  async get<T = any>(key: string): Promise<T | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, "readonly");
      const store = tx.objectStore(STORES.SETTINGS);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async set(key: string, value: any): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, "readwrite");
      const store = tx.objectStore(STORES.SETTINGS);
      const request = store.put({ key, value, updatedAt: new Date() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async delete(key: string): Promise<void> {
    return deleteById(STORES.SETTINGS, key);
  },

  async clear(): Promise<void> {
    return clear(STORES.SETTINGS);
  },

  // Convenience methods for specific settings
  async getTradingSettings(): Promise<TradingSettings | null> {
    return this.get<TradingSettings>("trading_settings");
  },

  async setTradingSettings(settings: TradingSettings): Promise<void> {
    return this.set("trading_settings", settings);
  },

  async getAPISettings(): Promise<APISettings | null> {
    return this.get<APISettings>("api_settings");
  },

  async setAPISettings(settings: APISettings): Promise<void> {
    return this.set("api_settings", settings);
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

export async function clearAllData(): Promise<void> {
  await Promise.all([
    PortfolioStorage.clear(),
    PositionStorage.clear(),
    TransactionStorage.clear(),
    WatchlistStorage.clear(),
    SettingsStorage.clear(),
  ]);
}

export async function exportData(): Promise<string> {
  const [portfolios, positions, transactions, watchlist] = await Promise.all([
    PortfolioStorage.getAll(),
    PositionStorage.getAll(),
    TransactionStorage.getAll(),
    WatchlistStorage.getAll(),
  ]);

  const data = {
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    portfolios,
    positions,
    transactions,
    watchlist,
  };

  return JSON.stringify(data, null, 2);
}

export async function importData(jsonData: string): Promise<void> {
  const data = JSON.parse(jsonData);

  // Clear existing data
  await clearAllData();

  // Import new data
  await Promise.all([
    ...(data.portfolios || []).map((p: Portfolio) => PortfolioStorage.create(p)),
    ...(data.positions || []).map((p: Position) => PositionStorage.create(p)),
    ...(data.transactions || []).map((t: Transaction) => TransactionStorage.create(t)),
    ...(data.watchlist || []).map((w: WatchlistItem) => WatchlistStorage.add(w)),
  ]);
}
