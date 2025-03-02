const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

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
