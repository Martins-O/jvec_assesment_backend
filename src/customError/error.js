

export const sendErrorResponse = ( res, statusCode, errorMessage ) => {
    res.status(statusCode).json({
        status: "Failed",
        message: errorMessage
    });
};
