import { Medicine, MEDICINESTATUS } from "../../../generated/prisma/client"
import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma"


const getAllMedicine = async({search, tags, isFeatured, status, userId} : {search : string | undefined, tags : string[] | [], isFeatured : boolean | undefined, status : MEDICINESTATUS | undefined, userId : string | undefined}) =>{
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


    const result = await prisma.medicine.findMany({
        where:{
            AND: andConditions
            
        }
        
    });
    return result;
}


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
    createMedicine
}