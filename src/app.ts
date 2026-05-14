import express, {Application} from "express";
import { medicineRouter } from "./modules/medicine/medicine.route";
import { categoryRouter } from "./modules/category/category.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors"
import { reviewRouter } from "./modules/review/review.route";

const app: Application = express();

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:4000",
  credentials: true

}))

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/medicine", medicineRouter)

app.use("/category", categoryRouter)

app.use("/reviews", reviewRouter)

app.get("/", (req, res) =>{
    res.send("hello, world")
})

export default app;