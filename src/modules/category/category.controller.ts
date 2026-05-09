import { Request, Response } from "express";
import { categoryService } from "./category.service";


const createCategory = async(req: Request, res: Response) =>{
    try{
        const result = await categoryService.createCategory(req.body);

        res.status(201).json({
            message:"category successfully created",
            data: result
        })
    }catch(error){
       res.status(404).json({
        message:"category creation failed",
        error:error
       })
    }
}

export const categoryController = {
    createCategory
}