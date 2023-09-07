const express = require("express");
const rotas = express();
const {
  cadastro,
  login,
  inserirLugares,
  listarLugares,
} = require("./controladores/controladores");
const validator = require("./intermediarios/tokenValidator");
rotas.post("/cadastro", cadastro);
rotas.post("/login", login);
rotas.use(validator);
rotas.post("/lugares", inserirLugares);
rotas.get("/usuario", listarLugares);
module.exports = rotas;
