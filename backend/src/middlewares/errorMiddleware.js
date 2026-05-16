const { ZodError } = require("zod");
const ApiResponse = require("../utils/apiResponse");

function errorMiddleware(error, req, res, next) {

  if (error instanceof ZodError) {

    return res.status(400).json(

      ApiResponse.error(

        "Erro de validação dos dados",

        error.issues.map(issue => ({
          field: issue.path[0],
          message: issue.message
        }))
      )
    );
  }

  if (error.statusCode) {

    return res.status(error.statusCode).json(
      ApiResponse.error(error.message)
    );
    
  }

  return res.status(500).json(
    ApiResponse.error(error.message || "Erro interno do servidor.")
  );
}

module.exports = errorMiddleware;