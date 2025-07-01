import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Debes definir MONGODB_URI en el archivo .env.local");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

if (!globalThis._mongooseCache) {
  globalThis._mongooseCache = { conn: null, promise: null };
}

const cached = globalThis._mongooseCache;

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  // Aquí le decimos a TS que MONGODB_URI es string (porque ya validamos que no sea undefined)
  cached.promise = mongoose.connect(MONGODB_URI as string).then((mongooseInstance) => mongooseInstance);

  cached.conn = await cached.promise;
  return cached.conn;
}
