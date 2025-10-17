import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Payment Service' });
});

// Payment routes
app.get('/payments', (req, res) => {
  res.json({ message: 'Get all payments', payments: [] });
});

app.post('/payments', (req, res) => {
  res.json({ message: 'Process payment', payment: req.body });
});

app.get('/payments/:id', (req, res) => {
  res.json({ message: 'Get payment by ID', id: req.params.id });
});

app.post('/payments/:id/refund', (req, res) => {
  res.json({ message: 'Refund payment', id: req.params.id });
});

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});