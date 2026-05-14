

import { Request, Response } from "express";
import { reviewService } from "./review.service";
import { success } from "better-auth";


const getReviewById = async(req : Request, res : Response) =>{
    try{

        const { reviewId } = req.params;

        const result = await reviewService.getReviewById(reviewId as string);

        res.status(200).json({
            success : true,
            message : "get review details successfully by reviewId",
            data : result
        })


    }catch(error){
        res.status(404).json({
            success : false,
            message : "review id fetch failed",
            details : error
        })
    }
}


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
    getReviewById,
    createReview
}