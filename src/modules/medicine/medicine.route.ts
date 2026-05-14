import express, { Router } from "express";
import { medicineController } from "./medicine.controller";
import auth, { UserRole } from "../../middleware/auth";


const router = express.Router();

//write get related route at the first is best practice

//get all medicine data
router.get("/", medicineController.getAllMedicine);

//get individual medicine data details by givin their unique id

router.get("/:medicineId", medicineController.getSingleMedicine)


//create medicine post
router.post("/", auth(UserRole.SELLER), medicineController.createMedicine)

export const medicineRouter: Router = router
