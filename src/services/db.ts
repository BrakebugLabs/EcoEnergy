// Dexie.js setup — IndexedDB persistence.
// Browser-only. Guarded so SSR import does not crash.
import Dexie from "dexie";
import type {Table} from "dexie";

export interface BillReading {
  kwh: number;
  valueBRL: number;
}

export interface AnalysisRecord {
  id?: number;
  createdAt: number;
  previous: BillReading;
  recent: BillReading;
  diffKwh: number;
  diffBRL: number;
  earnedPoints: number;
}

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  createdAt: number;
}

export interface AppMeta {
  key: string;
  value: number | string;
}

class EcoDB extends Dexie {
  analyses!: Table<AnalysisRecord, number>;
  users!: Table<UserProfile, number>;
  meta!: Table<AppMeta, string>;

  constructor() {
    super("ecoenergy-score");
    this.version(1).stores({
      analyses: "++id, createdAt",
      users: "++id, email",
      meta: "&key",
    });
  }
}

let _db: EcoDB | null = null;
export function getDB(): EcoDB | null {
  if (typeof window === "undefined") return null;
  if (!_db) _db = new EcoDB();
  return _db;
}
