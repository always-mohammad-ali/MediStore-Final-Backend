import { prisma } from "../../lib/prisma";


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
    createReview
}