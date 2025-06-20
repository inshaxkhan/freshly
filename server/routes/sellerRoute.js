import express from "express"
import {sellerLogin, sellerLogout, isSellerAuth } from "../controllers/sellerController.js"
import authSeller from "../middlewares/authSeller.js"

const sellerRouter=express.Router();
sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/logout', authSeller, isSellerAuth);
sellerRouter.get('/logout', sellerLogout);

export default sellerRouter;

