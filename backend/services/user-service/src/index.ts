import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'User Service' });
});

// User routes
app.get('/users', (req, res) => {
  res.json({ message: 'Get all users', users: [] });
});

app.post('/users', (req, res) => {
  res.json({ message: 'Create user', user: req.body });
});

app.get('/users/:id', (req, res) => {
  res.json({ message: 'Get user by ID', id: req.params.id });
});

app.put('/users/:id', (req, res) => {
  res.json({ message: 'Update user', id: req.params.id, data: req.body });
});

app.delete('/users/:id', (req, res) => {
  res.json({ message: 'Delete user', id: req.params.id });
});

// Authentication routes
app.post('/auth/login', (req, res) => {
  res.json({ message: 'Login user', token: 'mock-jwt-token' });
});

app.post('/auth/register', (req, res) => {
  res.json({ message: 'Register user', user: req.body });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});