require("dotenv").config();
const rotas = require("./rotas");

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(rotas);

app.listen(process.env.PORT, () => {
  console.log("servidor rodando");
});
