import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'API Gateway' });
});

// Proxy routes to microservices
app.use('/api/bookings', createProxyMiddleware({
  target: process.env.BOOKING_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/bookings': '' }
}));

app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

app.use('/api/payments', createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '' }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});