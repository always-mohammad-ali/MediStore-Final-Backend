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

const getMyMedicine = async(userId : string) =>{
    
    await prisma.user.findUniqueOrThrow({
        where : {
            id : userId,
            status : "ACTIVE"
        }, 
        select : {
            id : true
        }
    })
    

    const result =  await prisma.medicine.findMany({
        where : {
            userId : userId
        },
        orderBy : {
            createdAt : "desc"
        },
        include :{
            _count : {
                select : {
                    review : true
                }
            }
        }
        
    })

   /* const totalMedicinePosted = await prisma.medicine.count({
        where : {
            userId : userId
        }
    }) */

    const totalMedicinePosted = await prisma.medicine.aggregate({
        where : {
            userId : userId
        },
        _count : {
            userId : true
        }
    })

    return {
        data : result,
        totalMedicinePosted
    }
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

//UPDATE MEDICINE

const updateMedicine = async(userId : string, medicineId : string, medicineData : Partial<Medicine>) =>{
    const medicineDatax = await prisma.medicine.findUniqueOrThrow({
        where : {
            id : medicineId
        },
        select : {
            id : true,
            userId : true,
        }
    })

    if(medicineDatax.userId !== userId){
        throw new Error("you don't have permission to update data as you id doesn't match with medicine-posts id");
    }

    return await prisma.medicine.update({
        where : {
            id : medicineId
        },
        data : medicineData
    })
}

export const medicineService = {
    getAllMedicine,
    getSingleMedicine,
    getMyMedicine,
    createMedicine,
    updateMedicine
}