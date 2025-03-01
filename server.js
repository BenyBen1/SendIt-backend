const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/userDb')

// Middleware
app.use(cors());
app.use(express.json());

const shipmentDetailsRouter = require('./routes/shipmentDetailsRoute');
const ordersRouter = require('./routes/ordersRoute');

// API endpoints
app.use('/orders', ordersRouter);
app.use('/shipment-details', shipmentDetailsRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
