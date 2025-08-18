const express = require('express');
const app = express();


require('dotenv').config();

const kasseRoute = require('backend/routes/kasse.js');
const lagerRoute = require('backend/routes/lager.js');
const authRoute = require('backend/routes/auth.js');

app.use(express.json()); // JSON-Body parsen

app.use('/kasse', kasseRoute);
app.use('/lager', lagerRoute);
app.use('/auth', authRoute);


const PORT = process.env.PORTserver || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
