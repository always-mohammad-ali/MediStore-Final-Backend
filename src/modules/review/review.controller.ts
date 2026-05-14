

import { Request, Response } from "express";
import { reviewService } from "./review.service";


const createReview = async(req : Request, res : Response) =>{
    try{

        const user = req.user;

        req.body.userId = user?.id;

        const result = await reviewService.createReview(req.body)

        res.status(201).json({
            success : true,
            message : "review create successfully done",
            data : result
        })

    }catch(error){
        res.status(404).json({
            success:false,
            message : "review creation failed",
            details : error
        })
    }
}

export const reviewController = {
    createReview
}