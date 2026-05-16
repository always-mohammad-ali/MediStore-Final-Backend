import express, {Router} from "express";
import { reviewController } from "./review.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/:reviewId", reviewController.getReviewById);

router.get("/user/:userId", reviewController.getReviewsByUserId);

router.post("/", auth(UserRole.CUSTOMER, UserRole.ADMIN), reviewController.createReview);

router.delete("/:reviewId", auth(UserRole.CUSTOMER, UserRole.ADMIN), reviewController.deleteReview);

router.patch("/:reviewId", auth(UserRole.CUSTOMER, UserRole.ADMIN), reviewController.updateReview);




export const reviewRouter = router;