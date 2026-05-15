class ApiResponse {

    static success(data, message = "Sucesso.") {

        return {
            success: true,
            message,
            data
        };
    }

    static error(message = "Erro.") {

        return {
            success: false,
            message
        };
    }
}

module.exports = ApiResponse;