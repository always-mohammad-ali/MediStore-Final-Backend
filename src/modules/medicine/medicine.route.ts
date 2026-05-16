import express, { Router } from "express";
import { medicineController } from "./medicine.controller";
import auth, { UserRole } from "../../middleware/auth";


const router = express.Router();

//write get related route at the first is best practice

//get all medicine data
router.get("/", medicineController.getAllMedicine);


router.get("/myMedicine", auth(UserRole.SELLER, UserRole.ADMIN), medicineController.getMyMedicine);

//get individual medicine data details by givin their unique id //ALWAYS PUT THOSE DYNAMIC ROUTE IN THE LAST
router.get("/:medicineId", medicineController.getSingleMedicine); 



router.patch("/:medicineId", auth(UserRole.SELLER, UserRole.ADMIN), medicineController.updateMedicine);




//create medicine post
router.post("/", auth(UserRole.SELLER, UserRole.ADMIN), medicineController.createMedicine)

export const medicineRouter: Router = router
