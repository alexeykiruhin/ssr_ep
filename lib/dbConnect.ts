// lib/dbConnect.tsx

import _mongoose, {connect} from 'mongoose';

declare global {
    var mongoose: {
        promise: ReturnType<typeof connect> | null;
        conn: typeof _mongoose | null;
    };
}

// const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI = 'mongodb+srv://q23sa350:<password>@cluster0.9l1t6ib.mongodb.net/?retryWrites=true&w=majority';

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        console.log('ОШИБКА')
        const opts = {
            bufferCommands: false,
        };
        console.log('111111111')
        cached.promise = connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('222222222')
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;

        throw e;
    }

    return cached.conn;
}

export default dbConnect;
