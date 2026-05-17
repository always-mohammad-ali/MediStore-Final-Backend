
import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";


function errorHandler(
    err : any,
    req : Request,
    res : Response,
    next : NextFunction
) {
    
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errDetails = err;


    if(err instanceof Prisma.PrismaClientValidationError){
        statusCode = 400;
        errorMessage = "you provide incorrect field type or missing fields"
    }
    else if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code === "P2025"){
            statusCode = 400;
            errorMessage = "an operation failed because it depends one or more records that were required but not found"
        }
        else if(err.code === "P2002"){
            statusCode = 400;
            errorMessage = "duplicate error"
        }
        else if(err.code === "2003"){
            statusCode = 400;
            errorMessage = "foreign key constraint failed"
        }

    }
    else if(err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode = 500;
        errorMessage = "Error occured during query execution"
    }
    else if(err instanceof Prisma.PrismaClientInitializationError){
        if(err.errorCode === "P1000"){
            statusCode = 401;
            errorMessage = "authentication failed, Please check your credentials"
        }
        else if(err.errorCode === "P1001"){
            statusCode = 400;
            errorMessage = "can't reach database server"
        }
    }
   
    res.status(statusCode)
    res.json({
        success : false,
        message : errorMessage,
        error : errDetails
    })
}

export default errorHandler;