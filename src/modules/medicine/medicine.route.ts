import express, { Router } from "express";
import { medicineController } from "./medicine.controller";
import auth, { UserRole } from "../../middleware/auth";


const router = express.Router();

//write get related route at the first is best practice

//get all medicine data
router.get("/", medicineController.getAllMedicine);


router.get("/myMedicine", auth(UserRole.SELLER, UserRole.ADMIN), medicineController.getMyMedicine);

//create medicine post
router.post("/", auth(UserRole.SELLER, UserRole.ADMIN), medicineController.createMedicine)


//get individual medicine data details by givin their unique id //ALWAYS PUT THOSE DYNAMIC ROUTE IN THE LAST
router.get("/:medicineId", medicineController.getSingleMedicine); 



//update medicine
router.patch("/:medicineId", auth(UserRole.SELLER, UserRole.ADMIN), medicineController.updateMedicine);

//delete medicine
router.delete("/:medicineId", auth(UserRole.SELLER, UserRole.ADMIN), medicineController.deleteMedicine);





export const medicineRouter: Router = router
