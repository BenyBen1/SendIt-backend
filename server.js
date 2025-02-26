const express = require('express');
const cors = require('cors');
const mongoose=require('mongoose');

const app = express();
const port = 5000;


mongoose.connect("mongodb://localhost:27017/campsiteDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// Middleware
app.use(cors());
app.use(express.json());

// Import the orders router
const ordersRouter = require('./routes/ordersRoute');
app.use('/orders', ordersRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
