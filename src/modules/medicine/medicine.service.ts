import { Medicine } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


const getAllMedicine = async() =>{
    const result = await prisma.medicine.findMany();
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