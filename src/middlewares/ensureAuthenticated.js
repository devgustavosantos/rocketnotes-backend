const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const AuthConfigs = require("../configs/auth");

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT Token não informado", 401);
  }
  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, AuthConfigs.jwt.secret);

    request.user = {
      id: Number(user_id),
    };

    return next();
  } catch {
    throw new AppError("JWT Token inválido", 401);
  }
}

module.exports = ensureAuthenticated;
