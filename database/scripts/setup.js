const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function setupDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  });

  try {

    await client.connect();

    const schema = fs.readFileSync('./schema/schela.sql', 'utf8');
    await client.query(schema);

    console.log('Schema applied successfully to the existing database.');
  } catch (error) {
    console.error('Error applying schema:', error);
  } finally {
    await client.end();
  }
}

setupDatabase();
