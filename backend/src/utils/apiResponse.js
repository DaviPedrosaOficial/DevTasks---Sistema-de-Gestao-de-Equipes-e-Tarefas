class ApiResponse {

    static success(data, message = "Sucesso.") {

        return {
            success: true,
            message,
            data
        };
    }

    static error(message, errors = null) {

        return {
            success: false,
            message,
            errors
        };
    }
}

module.exports = ApiResponse;