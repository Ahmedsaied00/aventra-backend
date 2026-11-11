import { Router } from "express";
import { registerUser } from "./auth.controller";

const router = Router();
// Router for user registration (post/api/auth/register)
router.post('/register',registerUser);
export default router ; 