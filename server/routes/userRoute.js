import express from "express";
import { login, register } from "../controllers/userController";
import authUser from "../middlewares/authUser";

const userRouter=express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/is-auth', authUser, isAuth)
userRouter.post('/logout', authUser, logout)

export default userRouter;
