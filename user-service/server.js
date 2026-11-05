
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = 3001;

const User = mongoose.model('User', new mongoose.Schema({
  userId: { type: Number, unique: true },
  name: String
}));

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json({ success: true, users });
});

app.get('/users/:id', async (req, res) => {
  const user = await User.findOne({
    userId: Number(req.params.id)
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({ success: true, user });
});

mongoose.connect('mongodb://mongo:27017/user_db')
  .then(async () => {
    await User.updateOne(
      { userId: 1 },
      { $set: { name: 'Gourav' } },
      { upsert: true }
    );

    await User.updateOne(
      { userId: 2 },
      { $set: { name: 'Rahul' } },
      { upsert: true }
    );

    app.listen(PORT, () => {
      console.log('User Service running on port ' + PORT);
    });
  })
  .catch(console.error);