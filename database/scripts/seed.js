const db = require('../config/database');

async function seedDatabase() {
  try {
    const agenciesQuery = `
      INSERT INTO agencies (number, address) 
      VALUES 
        ('AGY001', '123 Main St, Cityville'),
        ('AGY002', '456 Tech Lane, Innovate City'),
        ('AGY003', '789 Transport Road, Mobility Town')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `;
    const agenciesResult = await db.query(agenciesQuery);
    const agencyIds = agenciesResult.rows.map(row => row.id);


    const driversQuery = `
      INSERT INTO drivers ("firstName", "lastName", "phoneNumber", email, "agencyId") 
      VALUES 
        ('John', 'Doe', '+1234567890', 'john.doe@example.com', $1),
        ('Jane', 'Smith', '+0987654321', 'jane.smith@example.com', $2),
        ('Mike', 'Johnson', '+1122334455', 'mike.johnson@example.com', $3)
      ON CONFLICT DO NOTHING;
    `;
    await db.query(driversQuery, agencyIds);

    const vehiclesQuery = `
      INSERT INTO vehicles ("registrationNum", "purchaseDate", model, brand, "agencyId")
      VALUES 
        ('REG001', '2022-01-15', 'Model X', 'Tesla', $1),
        ('REG002', '2021-11-20', 'Transit Van', 'Ford', $2),
        ('REG003', '2023-03-10', 'Sprinter', 'Mercedes', $3)
      ON CONFLICT DO NOTHING;
    `;
    await db.query(vehiclesQuery, agencyIds);

    const missionsQuery = `
      INSERT INTO missions (date, "startTime", "endTime", "driverId", "vehicleId")
      VALUES 
        ('2024-01-15', '08:00:00', '16:00:00', 
         (SELECT id FROM drivers WHERE "firstName" = 'John'), 
         (SELECT id FROM vehicles WHERE "registrationNum" = 'REG001')),
        ('2024-01-16', '09:00:00', '17:00:00', 
         (SELECT id FROM drivers WHERE "firstName" = 'Jane'), 
         (SELECT id FROM vehicles WHERE "registrationNum" = 'REG002')),
        ('2024-01-17', '07:30:00', '15:30:00', 
         (SELECT id FROM drivers WHERE "firstName" = 'Mike'), 
         (SELECT id FROM vehicles WHERE "registrationNum" = 'REG003'))
      ON CONFLICT DO NOTHING;
    `;
    await db.query(missionsQuery);


    const revisionsQuery = `
      INSERT INTO revisions (date, "repairTypes", "vehicleId")
      VALUES 
        ('2024-01-10', 'Routine Maintenance', 
         (SELECT id FROM vehicles WHERE "registrationNum" = 'REG001')),
        ('2024-01-12', 'Brake Pad Replacement', 
         (SELECT id FROM vehicles WHERE "registrationNum" = 'REG002')),
        ('2024-01-15', 'Oil Change', 
         (SELECT id FROM vehicles WHERE "registrationNum" = 'REG003'))
      ON CONFLICT DO NOTHING;
    `;
    await db.query(revisionsQuery);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await db.connect().then(client => client.release());
  }
}

seedDatabase();