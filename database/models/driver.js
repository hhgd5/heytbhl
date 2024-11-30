const db = require('../config/database');

class DriverModel {
  static async findAll() {
    try {
      const result = await db.query('SELECT * FROM drivers');
      return result.rows;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  }

  static async create(driverData) {
    const { firstName, lastName, phoneNumber, email, agencyId } = driverData;
    try {
      const result = await db.query(
        'INSERT INTO drivers ("firstName", "lastName", "phoneNumber", email, "agencyId") VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [firstName, lastName, phoneNumber, email, agencyId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  }
}

module.exports = DriverModel;