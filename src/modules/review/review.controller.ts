

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

const getReviewsByUserId = async(req: Request, res: Response) =>{
    try{
        const { userId } = req.params;

        const result = await reviewService.getReviewsByUserId(userId as string);

        res.status(200).json({
            success : true,
            message : "successfully we get all comments by a user id",
            data : result
        })

    }catch(error){
        res.status(401).json({
            success : false,
            message : "user id fetch failed",
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


const deleteReview = async(req : Request, res : Response) => {
      try{

        const { reviewId } = req.params;

        const user = req.user;

        const result = await reviewService.deleteReview(reviewId as string, user?.id as string);

        res.status(200).json({
            success : true,
            message : "delete review using id successful",
            data : result
        })

      }catch(error){
        res.status(404).json({
            success : false,
            message : "delete review using id failed",
            details : error
        })    
      }
}

const updateReview = async(req : Request, res : Response) =>{
      try{
        
        const { reviewId } = req.params;
    
        const user = req.user;

        const result = await reviewService.updateReview(reviewId as string, user?.id as string, req.body);

        res.status(201).json({
            success : true,
            message : "update review data using id successful",
            data : result
        })


      }catch(error){
        res.status(404).json({
            success: false,
            message: "update review using id falied",
            details: error
        })
      }
}


const moderateReview = async(req : Request, res : Response) =>{
    try{
      const { reviewId } = req.params;

      const result = await reviewService.moderateReview(reviewId as string, req.body)

      res.status(201).json({
        success : true,
        message : "modify review status by only admin succeed",
        data : result
      })


    }catch(error ){
        
        const errorMessage = error instanceof Error ? error.message : "modify review status by admin failed" ;

        res.status(404).json({
            success : false,
            message : errorMessage,
            details : error
        })
    }
}

export const reviewController = {
    getReviewById,
    getReviewsByUserId,
    createReview,
    deleteReview,
    updateReview,
    moderateReview
}