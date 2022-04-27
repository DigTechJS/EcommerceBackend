const ErrorHandler= require("../utils/errorHandler");

module.exports= (err,req, res, next)=>{
    err.statusCode= err.statusCode|| 500;
    err.message= err.message || "Internal Server Error ";
    
    // Wrong nomgoDB id error
    if(err.name==="CastError"){
        const message= `Resource not found. Invalid: ${err.path}`;
        err= new ErrorHandler(message, 400);
    }


// JWT expired error
if(err.name==="TokenExpiredError"){
    const message= `JSON web token is invalid. Please try again`;
    err= new ErrorHandler(message, 400);
}

// Wrong JSON webtoken error
if(err.name==="JsonWebTokenError"){
    const message= `JSON web token is Expired. Please try again`;
    err= new ErrorHandler(message, 400);
}

// Mongoose duplicate key error
if(err.code===11000){
    const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
    err= new ErrorHandler(message,400);
}

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        // error:err.stack
        
    })
};