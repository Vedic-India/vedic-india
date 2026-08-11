import multer from "multer";

const errorHandler = (err,req,res,next) => {
    
    const response = {
        statusCode: err.statusCode || 500,
        message: err.message || "Internal server error",
        success: false,
        errors: err.errors || [],
        code: err.code || undefined
    }

    if(process.env.NODE_ENV === "development"){
        response.stack = err.stack
    }

    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            response.statusCode = 400;
            response.message = "File size should not exceed 10 MB.";
        }
        else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            response.statusCode = 400;
            response.message = "A maximum of 5 images are allowed.";
        }
    }
    return res
    .status(response.statusCode)
    .json(response)
}

export {errorHandler}