import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Booking Service' });
});

// Booking routes
app.get('/bookings', (req, res) => {
  res.json({ message: 'Get all bookings', bookings: [] });
});

app.post('/bookings', (req, res) => {
  res.json({ message: 'Create booking', booking: req.body });
});

app.get('/bookings/:id', (req, res) => {
  res.json({ message: 'Get booking by ID', id: req.params.id });
});

app.put('/bookings/:id', (req, res) => {
  res.json({ message: 'Update booking', id: req.params.id, data: req.body });
});

app.delete('/bookings/:id', (req, res) => {
  res.json({ message: 'Delete booking', id: req.params.id });
});

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});