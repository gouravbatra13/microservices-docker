const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const logger = require('./logger');

const app = express();
app.use(express.json());

const PORT = 3002;

const Order = mongoose.model('Order', new mongoose.Schema({
  orderId: Number,
  userId: Number,
  product: String,
  amount: Number,
  customerName: String,
  status: { type: String, default: 'pending' }
}));


//retry 

const sleep = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

async function getUserWithRetry(userId, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`User Service attempt: ${attempt}`);

      const response = await axios.get(
        `http://user-service:3001/users/${userId}`,
        { timeout: 3000 }
      );

      return response.data.user;

    } catch (error) {
      const retryable =
        ['ECONNABORTED', 'ETIMEDOUT', 'ECONNREFUSED', 'ECONNRESET']
          .includes(error.code) ||
        [502, 503, 504].includes(error.response?.status);

      if (!retryable || attempt === maxRetries) {
        throw error;
      }

      console.log(`Retrying in 1 second...`);
      await sleep(1000);
    }
  }
}


app.post('/orders', async (req, res) => {
  try {
    const { userId, product, amount } = req.body;

    // Validate request
    if (!userId || !product || amount == null) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check User Service
    const user = await getUserWithRetry(userId);

    logger.info('Validating user', { userId });
    
    // Validate user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create order only after user validation
    const order = await Order.create({
      orderId: Date.now(),
      userId,
      product,
      amount,
      customerName: user.name
    });

    logger.info('Order created successfully', {
      orderId: order.orderId,
      userId: order.userId
    });

    return res.status(201).json({
      success: true,
      message: 'Order created',
      order
    });

  } catch (error) {
    logger.error('Order creation failed', {
      message: error.message,
      code: error.code
    });

    // User not found
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // User Service timeout
    if (
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT'
    ) {
      return res.status(504).json({
        success: false,
        message: 'User Service request timeout'
      });
    }

    // User Service unavailable
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND'
    ) {
      return res.status(503).json({
        success: false,
        message: 'User Service is unavailable'
      });
    }

    // Other User Service errors
    if (error.response) {
      return res.status(502).json({
        success: false,
        message: 'User Service returned an error'
      });
    }

    // Unexpected internal error
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();

    return res.json({
      success: true,
      orders
    });
  } catch (error) {
    logger.error('Fetch orders error:', {
      message: error.message,
      code: error.code
    });

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch orders'
    });
  }
});

mongoose.connect('mongodb://mongo:27017/order_db')
  .then(() => {
    app.listen(PORT, () => {
      console.log('Order Service running on port ' + PORT);
    });
  })
  .catch((error) => {
    logger.error('MongoDB connection failed:', {
      message: error.message,
      code: error.code
    });
    process.exit(1);
  });