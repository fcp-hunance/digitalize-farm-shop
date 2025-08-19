const express = require('express');
const app = express();


require('dotenv').config();

const kasseRoute = require('./routes/kasse');
const lagerRoute = require('./routes/lager');
const authRoute = require('./routes/auth');
const invoiceRoute = require('./routes/invoice');
const receiptRoute = require('./routes/receipt');

app.use(express.json()); // JSON-Body parsen

app.use('/api/kasse', kasseRoute);
app.use('/api/lager', lagerRoute);
app.use('/api/auth', authRoute);
app.use('/api/invoice', invoiceRoute);
app.use('/api/receipt', receiptRoute);


const PORT = process.env.PORTserver || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
