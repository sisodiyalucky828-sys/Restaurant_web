const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let mongodInstance = null;

// Helper to ensure MSVC runtime dlls are available on Windows if needed
const ensureWindowsRuntime = () => {
  if (process.platform === 'win32') {
    const candidates = [
      'C:\\Program Files\\Java\\jdk-26.0.2.1\\bin',
      'C:\\Program Files\\JetBrains\\IntelliJ IDEA 2026.1.1\\jbr\\bin',
    ];
    for (const dir of candidates) {
      if (fs.existsSync(path.join(dir, 'vcruntime140.dll'))) {
        if (!process.env.PATH.includes(dir)) {
          process.env.PATH = `${dir};${process.env.PATH}`;
        }
        break;
      }
    }
  }
};
        
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/velvet_brew_db';

  try {
    // Attempt standard connection with 2 second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Local/Remote connection failed (${error.message}).`);
    console.log('[MongoDB] Starting In-Memory MongoDB server for zero-config out-of-the-box operation...');

    try {
      ensureWindowsRuntime();
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Connected to In-Memory MongoDB at ${memoryUri}`);
      return conn;
    } catch (memError) {
      console.error('[MongoDB] Database initialization error:', memError.message);
      throw memError;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
