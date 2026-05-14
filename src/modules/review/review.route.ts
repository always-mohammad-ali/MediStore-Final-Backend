import express, {Router} from "express";
import { reviewController } from "./review.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/:reviewId", reviewController.getReviewById);

router.post("/", auth(UserRole.CUSTOMER, UserRole.ADMIN), reviewController.createReview);




export const reviewRouter = router;