const express = require('express');
const cors = require("cors");
const app = express();


app.use(cors({
  origin: "http://localhost:5173"   // nur dein React-Frontend zulassen
}));

// falls du alle Origins erlauben willst:
app.use(cors()); 

require('dotenv').config();

const cashDeskRoute = require('./routes/cashDesk');
const warehouseRoute = require('./routes/warehouse');
const authRoute = require('./routes/auth');
const invoiceRoute = require('./routes/invoice');
const receiptRoute = require('./routes/receipt');
const testRoute = require('./routes/test');
const adminRoute = require('./routes/admin');
app.use(express.json()); // JSON-Body parsen

app.use('/api/cashDesk', cashDeskRoute);
app.use('/api/warehouse', warehouseRoute);
app.use('/api/auth', authRoute);
app.use('/api/invoice', invoiceRoute);
app.use('/api/receipt', receiptRoute);
app.use('/api/test', testRoute);
app.use('/api/admin', adminRoute);



const PORT = process.env.PORTserver || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
