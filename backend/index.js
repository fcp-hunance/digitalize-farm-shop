const express = require('express');
const app = express();


require('dotenv').config();

const kasseRoute = require('./routes/kasse');
const lagerRoute = require('./routes/lager');
const authRoute = require('./routes/auth');

app.use(express.json()); // JSON-Body parsen

app.use('/kasse', kasseRoute);
app.use('/lager', lagerRoute);
app.use('/auth', authRoute);


const PORT = process.env.PORTserver || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
