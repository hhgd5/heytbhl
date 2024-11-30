const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Error connecting to PostgreSQL:", err));

app.get("/drivers", async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT 
    id,
    "firstName", 
    "lastName", 
    email, 
    "phoneNumber",
    "agencyId",
    (SELECT number FROM agencies WHERE id = drivers."agencyId") AS "agencyNumber",
    (SELECT address FROM agencies WHERE id = drivers."agencyId") AS "agencyAddress"
  FROM drivers
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({
      error: error.message,
      details: "Failed to fetch drivers",
      fullError: error,
    });
  }
});

app.post("/drivers", async (req, res) => {
  const { firstName, lastName, email, phoneNumber, agencyId } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({
      error: "First name and last name are required",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO drivers ("firstName", "lastName", email, "phoneNumber", "agencyId")
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [firstName, lastName, email, phoneNumber, agencyId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).json({
      error: error.message,
      details: "Failed to create driver",
      fullError: error,
    });
  }
});

app.post("/agencies", async (req, res) => {
  const { number, address } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO agencies (number, address) VALUES ($1, $2) RETURNING *`,
      [number, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating agency:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/agencies", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM agencies");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching agencies:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/vehicles", async (req, res) => {
  const { registrationNumber, brand, model, purchaseDate, agencyId } = req.body;

  if (!registrationNumber || !brand || !model || !purchaseDate) {
    return res.status(400).json({
      error: "Registration number, brand, model, and purchase date are required",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO vehicles ("registrationNum", brand, model, "purchaseDate", "agencyId")
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [registrationNumber, brand, model, purchaseDate, agencyId]  
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({
      error: error.message,
      details: "Failed to add vehicle",
      fullError: error,
    });
  }
});


app.get("/vehicles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/missions", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM missions`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching missions:", error);
    res.status(500).json({ error: "Failed to retrieve missions" });
  }
});

app.post("/missions", async (req, res) => {
  const { date, startTime, endTime, vehicle, driver } = req.body;

  if (!date || !startTime || !endTime || !vehicle || !driver) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO missions ("date", "startTime", "endTime", "vehicleId", "driverId")
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [date, startTime, endTime, vehicle, driver]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding mission:", error);
    res.status(500).json({ error: "Failed to add mission", fullError: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
