import express from "express";
import { checkHealth } from "../controllers/health";

const app = express.Router();

app.get("/",checkHealth);

export default app;