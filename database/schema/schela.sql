CREATE TABLE agencies (
  id SERIAL PRIMARY KEY,
  number VARCHAR(50),
  address VARCHAR(255)
);

CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  email VARCHAR(255),
  agency_id INT,
  FOREIGN KEY (agency_id) REFERENCES agencies(id)
);

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  registrationNum VARCHAR(50) UNIQUE NOT NULL,
  purchase_date DATE,
  model VARCHAR(100),
  brand VARCHAR(100),
  agency_id INT,
  FOREIGN KEY (agency_id) REFERENCES agencies(id)
);

CREATE TABLE missions (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  driver_id INT,
  vehicle_id INT,
  FOREIGN KEY (driver_id) REFERENCES drivers(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE revisions (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  repair_types TEXT,
  vehicle_id INT,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20)
);

CREATE TABLE administrators (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);