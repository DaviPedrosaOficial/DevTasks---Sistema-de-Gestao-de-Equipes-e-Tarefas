const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/apiResponse");

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json(
            ApiResponse.error("Token de autenticação não fornecido.")
        );
    }

    const [, token] = authHeader.split(" ");

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.id;

        return next();

    } catch (error) {

        return res.status(401).json(
            ApiResponse.error("Token de autenticação inválido.")
        );

    }

}

module.exports = authMiddleware;