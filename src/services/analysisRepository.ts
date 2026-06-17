// Repository / Service Layer — isolates persistence implementation.
// Future swap: replace internals with REST/Postgres without touching UI.
import { getDB   } from "./db";
import type {AnalysisRecord, UserProfile} from "./db";

export const analysisRepository = {
  async save(record: Omit<AnalysisRecord, "id">): Promise<number | null> {
    const db = getDB();
    if (!db) return null;
    return (await db.analyses.add(record));
  },
  async listRecent(limit = 10): Promise<AnalysisRecord[]> {
    const db = getDB();
    if (!db) return [];
    return db.analyses.orderBy("createdAt").reverse().limit(limit).toArray();
  },
  async totalPoints(): Promise<number> {
    const db = getDB();
    if (!db) return 0;
    const all = await db.analyses.toArray();
    return all.reduce((sum, a) => sum + a.earnedPoints, 0);
  },
};

export const userRepository = {
  async create(user: Omit<UserProfile, "id" | "createdAt">): Promise<number | null> {
    const db = getDB();
    if (!db) return null;
    return (await db.users.add({ ...user, createdAt: Date.now() }));
  },
};
