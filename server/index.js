const express = require('express');
const app = express();
const db = require('./db');
const port = 3000;

app.use(express.json());

// GET /api/customers: Returns an array of customers.
app.get('/api/customers', async (req, res, next) => {
  try {
    const customers = await db.fetchCustomers();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/restaurants: Returns an array of restaurants.
app.get('/api/restaurants', async (req, res,next) => {
  try {
    const restaurants = await db.fetchRestaurants();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// GET /api/reservations: Returns an array of reservations.
app.get('/api/reservations', async (req, res,next) => {
  try {
    const reservations = await db.fetchReservations();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// POST /api/customers/:id/reservations: Create a reservation for a customer.
app.post('/api/customers/:id/reservations', async (req, res) => {
  const { restaurant_id, date, party_count } = req.body;
  const customer_id = req.params.id;

  try {
    const reservation = await db.createReservation({
      customer_id,
      restaurant_id,
      date,
      party_count,
    });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// DELETE /api/customers/:customer_id/reservations/:id: Deletes a reservation.
app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
  const { customer_id, id } = req.params;

  try {
    await db.destroyReservation({ customer_id, reservation_id: id });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

// Error handling route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialization function
const init = async () => {
  try {
    await db.createTables();
    console.log('Tables created');
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
  }
};

init();
