const { Client } = require('pg');

// different way of connection
  const client = new Client({
   host: 'localhost',
    user: 'postgres', // PostgreSQL username, e.g., 'postgres'
   password: 'Zana195726@', // PostgreSQL password
    database: 'postgres', // Name of the database 
    port: 5432, // PostgreSQL default port
  });

  //  const client = new Client('postgres://localhost:5432/Acme');



client.connect();

// Create tables function
const createTables = async () => {
  const query = `
    DROP TABLE IF EXISTS reservations, customers, restaurants;
    
    CREATE TABLE customers (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE restaurants (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE reservations (
      id UUID PRIMARY KEY,
      date DATE NOT NULL,
      party_count INTEGER NOT NULL,
      restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
      customer_id UUID REFERENCES customers(id) NOT NULL
    );
  `;
  await client.query(query);
};

// Create a customer
const createCustomer = async (name) => {
  const query = `
    INSERT INTO customers (id, name)
    VALUES (gen_random_uuid(), $1)
    RETURNING *;
  `;
  const result = await client.query(query, [name]);
  return result.rows[0];
};

// Create a restaurant
const createRestaurant = async (name) => {
  const query = `
    INSERT INTO restaurants (id, name)
    VALUES (gen_random_uuid(), $1)
    RETURNING *;
  `;
  const result = await client.query(query, [name]);
  return result.rows[0];
};

// Fetch all customers
const fetchCustomers = async () => {
  const result = await client.query('SELECT * FROM customers');
  return result.rows;
};

// Fetch all restaurants
const fetchRestaurants = async () => {
  const result = await client.query('SELECT * FROM restaurants');
  return result.rows;
};

// Create a reservation
const createReservation = async ({ customer_id, restaurant_id, date, party_count }) => {
  const query = `
    INSERT INTO reservations (id, date, party_count, restaurant_id, customer_id)
    VALUES (gen_random_uuid(), $1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await client.query(query, [date, party_count, restaurant_id, customer_id]);
  return result.rows[0];
};

// Delete a reservation
const destroyReservation = async ({ reservation_id }) => {
  const query = `
    DELETE FROM reservations
    WHERE id = $1;
  `;
  await client.query(query, [reservation_id]);
};

// Export the necessary functions
module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
};
