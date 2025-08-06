const { Client } = require('pg');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'foo_database',
  user: process.env.DB_USER || process.env.USER,
  password: process.env.DB_PASSWORD || '',
};

let dbClient = null;

async function connectToDatabase() {
  if (dbClient) {
    return dbClient;
  }

  dbClient = new Client(dbConfig);
  
  try {
    await dbClient.connect();
    console.log('Connected to PostgreSQL database');
    return dbClient;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

function getDatabase() {
  if (!dbClient) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return dbClient;
}

async function closeDatabase() {
  if (dbClient) {
    try {
      await dbClient.end();
      console.log('Database connection closed');
      dbClient = null;
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }
}

module.exports = {
  connectToDatabase,
  getDatabase,
  closeDatabase,
  dbConfig
}; 