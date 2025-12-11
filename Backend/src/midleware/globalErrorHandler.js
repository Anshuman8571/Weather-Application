function globalErrorHandler(err,req,res,next){
    console.error("Global Error", err)
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success:false,
        error: message
    })
}

module.exports = globalErrorHandler;