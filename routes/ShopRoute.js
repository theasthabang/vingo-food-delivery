import express from "express"
import { createEditShop, getMyShop, getShopByCity } from "../controllers/ShopController.js"
import isAuth from "../midleware/isAuth.js"
import { upload } from "../midleware/multer.js"



const shopRouter=express.Router()

shopRouter.post("/create-edit",isAuth,upload.single("image"),createEditShop)
shopRouter.get("/get-my",isAuth,getMyShop)
shopRouter.get("/get-by-city/:city",isAuth,getShopByCity)

export default shopRouter