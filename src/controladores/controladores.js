const bcrypt = require("bcrypt");
const obterToken = require("../obterToken");
const jwt = require("jsonwebtoken");
const senhaJwt = process.env.SENHAJWT;
const knex = require("../conexao");
const transport = require(`../transport`)

const cadastro = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ message: "é necessario informar todos os dados para cadastro" });
  }
  const validacaoEmail = await knex("usuarios").where("email", email).debug();

  if (validacaoEmail.length > 0) {
    return res.status(400).json({ message: "email ja cadastrado" });
  }
  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const usuario = {
      nome,
      email,
      senha: senhaCriptografada,
    };
    const adicionarUsuario = await knex("usuarios")
      .insert(usuario)
      .returning("*");

    return res.status(200).json({ message: "usuario cadastrado" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res
      .status(400)
      .json({ message: "é necessario informar todos os dados para cadastro" });
  }
  try {
    const usuario = await knex("usuarios").where("email", email);

    if (usuario.length < 1) {
      return res.status(400).json({ message: "usuario nao encontrado" });
    }
    const senhaValida = await bcrypt.compare(senha, usuario[0].senha);

    if (!senhaValida) {
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }
    const token = jwt.sign({ id: usuario[0].id }, senhaJwt);

    const { senha: _, ...usuarioLogado } = usuario[0];
    return res.status(200).json({ usuario: usuarioLogado, token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const inserirLugares = async (req, res) => {
  const { nome } = req.body;
  const { authorization } = req.headers;
  const usuarioEncontrado = await obterToken(authorization);
  if (!nome) {
    return res
      .status(400)
      .json({ message: "é necessario o nome do lugar que deseja adicionar" });
  }
  try {
    const validacaoLugar = await knex("lugares").where("nome_lugar", nome);
    if (validacaoLugar.length > 0) {
      return res
        .status(400)
        .json({ message: "voce ja adicionou um lugar com esse nome" });
    }
    const lugar = {
      nome_lugar: nome,
      id_usuario: usuarioEncontrado.id,
    };

    const adicionarLugar = await knex("lugares").insert(lugar);

    return res.status(200).json({ message: `${nome} adicionado!` });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const listarLugares = async (req, res) => {
  const { authorization } = req.headers;
  const usuarioEncontrado = await obterToken(authorization);
  const query = await knex("lugares").select("nome_lugar");
  if (query.length === 0) {
    return res.status(400).json({
      message: "ops, parece que voce nao inseriu nenhum registro ainda :(",
    });
  }
  return res.status(200).json(query);
};
const esqueciSenha = async (req, res) => {
  const {email} = req.body

  try {
    const busca = await knex('usuarios').where('email', email).returning('*')

    if(busca.length < 1){
      return res.status(400).json({message: 'email informado nao existe'})
    }
    console.log(busca)
    // transport.sendMail({
    //   from:`${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
    //   to: ``
    // })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}
module.exports = {
  cadastro,
  login,
  inserirLugares,
  listarLugares,
  esqueciSenha
};
