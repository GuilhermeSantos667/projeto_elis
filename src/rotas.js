const express = require("express");
const rotas = express();
const {
  cadastro,
  login,
  inserirLugares,
  listarLugares,
  esqueciSenha,
} = require("./controladores/controladores");
const validator = require("./intermediarios/tokenValidator");
rotas.post("/cadastro", cadastro);
rotas.post("/login", login);
rotas.post('/esquecisenha', esqueciSenha)
// rotas.use(validator);
rotas.post("/lugares", inserirLugares);
rotas.get("/usuario", listarLugares);
module.exports = rotas;
