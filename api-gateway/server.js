
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const response = await axios.get(
      'http://user-service:3001/users'
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'User Service unavailable'
    });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const response = await axios.get(
      'http://order-service:3002/orders'
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Order Service unavailable'
    });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const response = await axios.post(
      'http://order-service:3002/orders',
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 503).json(
      error.response?.data || {
        success: false,
        message: 'Order Service unavailable'
      }
    );
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});