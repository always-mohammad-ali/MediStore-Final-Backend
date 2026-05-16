import { error } from "node:console";
import { prisma } from "../../lib/prisma";
import { REVIEWSTATUS } from "../../../generated/prisma/enums";


const getReviewById = async(reviewId :string) =>{
     return await prisma.review.findUnique({
        where :{
            id : reviewId
        },
        include : {
            medicine : {
                select : {
                    id : true,
                    medicineName : true,
                    views : true
                }
            }
        }
     })
}

const getReviewsByUserId = async(userId : string) =>{
    return await prisma.review.findMany({
         where : {
            userId
         },
         orderBy : { createdAt : "desc"},
         include : {
           medicine : {
            select : {
                id : true,
                medicineName : true
            }
           }
         }
    })
}


const createReview = async(payload : {
   description ?: string,
   rating : number,
   userId : string,
   medicineId : string,
   parentId ?: string

 }) =>{
     //console.log("review all data is", payload);

      await prisma.medicine.findUniqueOrThrow({
        where :{
            id : payload.medicineId
        }
     })

     if(payload.parentId){
         await prisma.review.findUniqueOrThrow({
            where:{
                id : payload.parentId
            }
        })
     }


     const result = await prisma.review.create({
        data: payload
     })

     return result;
}

const deleteReview = async(reviewId : string, userId : string) =>{
     const reviewData = await prisma.review.findFirst({
        where :{
            id : reviewId,
            userId
        },
        select :{
            id : true
        }
     })

     if(!reviewData){
        throw new Error("your provided input is invalid")
     }

     return await prisma.review.delete({
        where :{
            id : reviewData.id
        }
     })


}

const updateReview = async(reviewId : string, userId : string, reviewData : {description ?: string, rating ?: number}) => {
      const reviewDatax = await prisma.review.findFirst({
        where : {
            id : reviewId,
            userId : userId
        },
        select:{
            id : true,
            userId : true
        }
      })

      if(!reviewDatax){
        throw new Error("review id or userId doesn't match")
      }

     return await prisma.review.update({
        where : {
            id : reviewDatax.id,
            userId : reviewDatax.userId
        },
      data : reviewData
     })

}

const moderateReview = async(reviewId : string, reviewData : {reviewStatus : REVIEWSTATUS}) =>{
    
    await prisma.review.findUniqueOrThrow({
        where : {
            id : reviewId
        }
    })

    return await prisma.review.update({
        where :{
            id : reviewId
        },
        data : reviewData
    })
}

export const reviewService = {
    getReviewById,
    getReviewsByUserId,
    createReview,
    deleteReview,
    updateReview,
    moderateReview
}