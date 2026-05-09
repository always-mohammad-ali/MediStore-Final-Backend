import express, { Router } from "express";
import { medicineController } from "./medicine.controller";
import auth, { UserRole } from "../../middleware/auth";


const router = express.Router();



router.post("/", auth(UserRole.SELLER), medicineController.createMedicine)

export const medicineRouter: Router = router
