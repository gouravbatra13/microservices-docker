const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

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

app.post('/orders', async (req, res) => {
  try {
    const { userId, product, amount } = req.body;

    if (!userId || !product || amount == null) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const response = await axios.get(
      `http://user-service:3001/users/${userId}`,
      { timeout: 3000 }
    );

    const user = response.data.user;

    const order = await Order.create({
      orderId: Date.now(),
      userId,
      product,
      amount,
      customerName: user.name
    });

    res.status(201).json({
      success: true,
      message: 'Order created',
      order
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Unable to create order',
      error: error.message
    });
  }
});

app.get('/orders', async (req, res) => {
  const orders = await Order.find();

  res.json({
    success: true,
    orders
  });
});

mongoose.connect('mongodb://mongo:27017/order_db')
  .then(() => {
    app.listen(PORT, () => {
      console.log('Order Service running on port ' + PORT);
    });
  })
  .catch(console.error);