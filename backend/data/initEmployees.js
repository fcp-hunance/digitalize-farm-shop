const axios = require("axios");

const defaultEmployees = [
  { username: "Hans", password: "1234", pin: "1234", role: "admin" },
  { username: "Sandra", password: "1234", pin: "1234", role: "cashier" },
  { username: "Petra", password: "1234", pin: "1234", role: "cashier" },
  { username: "Thomas", password: "1234", pin: "1234", role: "warehouse" },
];

const registerEmployees = async () => {
  for (const emp of defaultEmployees) {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", emp);
      console.log(`✅ Registered ${emp.username}:`, res.data.message);
    } catch (err) {
      if (err.response?.status === 409) {
        console.log(`ℹ️ ${emp.username} already exists, skipping`);
      } else {
        console.error(`❌ Failed to register ${emp.username}:`, err.message);
      }
    }
  }
};

module.exports = registerEmployees;
