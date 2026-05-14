import { Medicine, MEDICINESTATUS, REVIEWSTATUS } from "../../../generated/prisma/client"
import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma"


const getAllMedicine = async({search, tags, isFeatured, status, userId, page, limit, skip, sortBy, sortOrder} :
     {search : string | undefined,
         tags : string[] | [], 
         isFeatured : boolean | undefined,
          status : MEDICINESTATUS | undefined,
           userId : string | undefined, 
           page : number,
            limit: number,
             skip : number,
              sortBy : string,
               sortOrder : string }) =>{
     const andConditions : MedicineWhereInput[] = [];

     if(search){
        andConditions.push({
                OR:[
            {  
            medicineName:{
                contains : search,
                mode: "insensitive"
            }
           },

           {
            description:{
                contains : search,
                mode: "insensitive"
            }
           },

           {
            
                tags:{
                    has: search
                }
            
           }
        
            ],
        })
     }

     if(tags.length > 0){
          andConditions.push({
            tags:{
                hasEvery: tags
            }
        })
     }

     if(typeof isFeatured === 'boolean'){
        andConditions.push({
            isFeatured : isFeatured //you can just use isFeatured in this line instead of isFeatured : isFeatured
        })
     }

     if(status){
        andConditions.push({
            status
        })
     }

     if(userId){
        andConditions.push({
            userId
        })
     }


    const allMedicine = await prisma.medicine.findMany({
        take: limit,
        skip,
        where:{
            
            AND: andConditions
            
        },
        orderBy:{ [sortBy] : sortOrder
        },
        include: {
            _count : {
                select : { review : true }
            }
        }
        
    });

    const total = await prisma.medicine.count({

        where:{
            AND: andConditions
        }
    })

    return {
        data: allMedicine,
        pagination :{
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit)
        }
      }
}

//GET SINGLE MEDICINE

const getSingleMedicine = async(medicineId : string) =>{
 

   const updateViewsCount = await prisma.medicine.update({
        where:{
            id : medicineId
        },
        data:{
            views: {
                increment : 1
            }
        }
    })


     const updatedMedicineData =  await prisma.medicine.findUniqueOrThrow({
        where : {
            id : medicineId
        },
        include:{
            review : {
                where :{
                    parentId : null,
                    reviewStatus : REVIEWSTATUS.APPROVED
                },
                orderBy :{ createdAt : "desc"  },
                include :{
                        reviewReply : {
                            where :{
                              reviewStatus : REVIEWSTATUS.APPROVED
                            },
                            orderBy:{ createdAt : "asc" },
                            include :{
                                reviewReply: {
                                    where : {
                                        reviewStatus : REVIEWSTATUS.APPROVED
                                    },
                                    orderBy : { createdAt : "asc"}
                                }
                            }
                        }          
                }
            },
            _count : { 
                select : { review : true}
            }
        }
    })

     
    return updatedMedicineData;

   


}



//CREATE MEDICINE
const createMedicine = async(data: Omit <Medicine, "id" | "createdAt" | "updatedAt" | "userId">, userSessionId : string) => {
    const result = await prisma.medicine.create({
        data :{
            ...data,
            userId : userSessionId
        }
    })
    return result;
}

export const medicineService = {
    getAllMedicine,
    getSingleMedicine,
    createMedicine
}