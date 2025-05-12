import blogmodel from "../models/blog.js";
import { v2 as cloudinary } from "cloudinary";

import { config } from "../config.js";

//1- Configurar cloudinary

cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret,
});


//Array de funciones al vacio
const blogController= {};

blogController.getAllBlog = async(req,res)=>{
    const blogs = await blogmodel.find()
    req.json(blogs)
}

//Guardar
blogController.createBlog = async (req, res)=>{
    try {
        const { title, content } = req.body;
        let imageUrl = ""
        
        if(req.file){
            //Subir el archivo a cloudinary
            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder:"public",
                    allowed_formats: ["jpg", "png", "jpeg", "webp"]
                }
            )
            imageUrl = result.secure_url;
           
        }

        const newBlog = new blogmodel({title, content, image:imageUrl});
        newBlog.save()
        res.json({ message : "Blog saved "});

    }   catch(error) {
        console.log('error' + error);
    }
};

export default blogController;