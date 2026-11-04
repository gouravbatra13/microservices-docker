const express = require('express');

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/users', (req, res) => {
  res.json({
    success: true,
    message: 'User Service is working!',
    users: [
      { id: 1, name: 'Gourav' },
      { id: 2, name: 'Rahul' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});