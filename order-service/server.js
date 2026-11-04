const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3002;

app.use(express.json());

const orders = [
  { id: 101, userId: 1, product: 'Laptop', amount: 50000 },
  { id: 102, userId: 2, product: 'Mobile', amount: 20000 }
];

app.get('/orders', async (req, res) => {
  try {
    const response = await axios.get(
      'http://localhost:3001/users'
    );

    const users = response.data.users;

    const ordersWithUsers = orders.map((order) => {
      const user = users.find(
        (u) => u.id === order.userId
      );

      return {
        ...order,
        user: user || null
      };
    });

    res.json({
      success: true,
      message: 'Orders fetched with user details',
      orders: ordersWithUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to communicate with User Service',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});