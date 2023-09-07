const jwt = require("jsonwebtoken");
const senhaJwt = process.env.SENHAJWT;

const validacaoToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
  const token = authorization.split(" ")[1];

  try {
    const tokenUsuario = jwt.verify(token, senhaJwt);

    next();
  } catch (error) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
};

module.exports = validacaoToken;
