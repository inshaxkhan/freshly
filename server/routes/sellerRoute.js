import express from "express"
import {sellerLogin, sellerLogout, isSellerAuth } from "../controllers/sellerController"
import authSeller from "../middlewares/authSeller"

const sellerRouter=express.Router();
SellerRouter.post('/login', sellerLogin);
SellerRouter.get('/logout', authSeller, isSellerAuth);
SellerRouter.get('/logout', sellerLogout);

export default sellerRouter;

