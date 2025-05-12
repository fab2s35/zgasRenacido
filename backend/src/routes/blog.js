import express from "express";
import multer from "multer";
import blogController from "../controllers/blogController.js"

const router = express.Router()

//Configurara una carpeta que guarde las imagenes
const upload = multer({dest: "public/"})

router.route("/").get().post()
.get(blogController.getAllBlog)
.post(upload.single("image"), blogController.createBlog);

export default router