const express = require("express");

const app = express();
const PORT = 5001;

app.get("/", (req, res) => {
  res.send("Backend Express.js berhasil jalan!");
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});