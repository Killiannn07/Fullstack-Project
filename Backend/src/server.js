require("dotenv").config();
const pool = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB Error", err);
  } else {
    console.log("DB Connected:", res.rows[0]);
  }
});
