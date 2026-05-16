import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { MEDICINESTATUS } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { success } from "better-auth";


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
        
        //const page = Number(req.query.page ?? 1);
        //const limit = Number(req.query.limit ?? 10);
        //
        //const skip = (page - 1) * limit;
//
        //const sortBy = req.query.sortBy as string | undefined;
        //const sortOrder = req.query.sortOrder as string | undefined;

        const {page, limit, skip, sortBy, sortOrder} = paginationSortingHelper(req.query);
        
       // const options = paginationSortingHelper(req.query);
       // console.log("options: ", options);

     
        const result = await medicineService.getAllMedicine({search : searchString, tags, isFeatured, status, userId, page, limit, skip, sortBy, sortOrder});

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

//get single medicine

const getSingleMedicine = async(req : Request, res : Response) =>{

          try{
             const { medicineId } = req.params;

          if(!medicineId){
            throw new Error("you have to give proper valid medicine id");
          }

            const result = await medicineService.getSingleMedicine(medicineId as string);

            res.status(201).json({
                success: true,
                message: "retrieve single medicine id successfully",
                data:result
            })

          }catch(error: any){
            console.log(error);
            console.log(error.message);
            console.log(error.meta);

            res.status(401).json({
               success: false,
               message: "failed to get medicine id",
               error: error,
             });
          }

}

//get my medicine

const getMyMedicine = async(req : Request, res : Response) =>{
    try{
      const user = req.user;

      if(!user){
        throw new Error("you are unauthorized")
      }

     

      const result = await medicineService.getMyMedicine(user?.id as string);

      res.status(201).json({
        success : true,
        message : "succeed to fetch my all posted medicine using my id as seller or admin",
        data : result
      })

    }catch(error){
        console.log(error)
        res.status(404).json({
            success : true,
            message : "failed to fetch my all posted medicine using my id as seller or admin"
        })
    }
}


//create Medicine

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
    getSingleMedicine,
    getMyMedicine,
    createMedicine

}