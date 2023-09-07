const jwt = require("jsonwebtoken");
const senhaJwt = process.env.SENHAJWT;
const knex = require("./conexao");

const obterUsuarioToken = async (authorization) => {
  const token = authorization.split(" ")[1];

  const tokenUsuario = jwt.verify(token, senhaJwt);
  const buscarUsuario = await knex("usuarios")
    .where("id", tokenUsuario.id)
    .returning("*");

  return buscarUsuario[0];
};

module.exports = obterUsuarioToken;
