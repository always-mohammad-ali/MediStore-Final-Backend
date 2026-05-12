import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { MEDICINESTATUS } from "../../../generated/prisma/enums";


const getAllMedicine = async(req: Request, res: Response) =>{
    try{

        const { search } = req.query;
         //  console.log("searched key is: ", search);
        const searchString = typeof search === "string" ? search : undefined;
        
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [] ;

        const isFeatured = req.query.isFeatured 
        ? req.query.isFeatured === 'true' 
        ? true 
          : req.query.isFeatured === 'false' 
          ? false : undefined 
        : undefined;

        //console.log({isFeatured});

        const status = req.query.status as MEDICINESTATUS | undefined;

        const userId = req.query.userId as string | undefined;

     
        const result = await medicineService.getAllMedicine({search : searchString, tags, isFeatured, status, userId});

        res.status(200).json({
            success: true,
            message: "successfully get all medicine data",
            data: result
        })

    }catch(err){
        res.status(404).json({
            success: false,
            message: "failed to get all medicine data",
            error: err
        })
    }
}

const createMedicine = async(req: Request, res: Response) =>{
    try{
        console.log(req.user)

        const user = req.user;

        if(!user){
            return res.status(404).json({
                error: "unauthorized"
            })
        }

        const result = await medicineService.createMedicine(req.body, user.id as string)

        res.status(201).json({
            result
        })
    }catch(error){
        res.status(404).json({
            message : "medicine creation failed",
            error : error
        })
    }
    
}

export const medicineController = {
    getAllMedicine,
    createMedicine
}