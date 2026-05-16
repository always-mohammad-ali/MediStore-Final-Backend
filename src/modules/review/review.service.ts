import { prisma } from "../../lib/prisma";


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

export const reviewService = {
    getReviewById,
    getReviewsByUserId,
    createReview
}