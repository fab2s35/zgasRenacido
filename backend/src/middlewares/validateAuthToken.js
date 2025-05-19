import jsomwebtoken from "jsonwebtoken";
import {config} from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
    return (req, res, next) => {
        try {

            //1.Extraer el token delas cookies
            const {authToken} = req.cookies;

            //2.Validar si existen las cookies
            if(!authToken){
                return res.json({message: "cookies not found, you must login"})
            }

            //3.Extraemos la informacipon del token
            const decoded = jsonwebtoken.verify(authToken, config.JWT.SECRET)
            
            req.use = decoded;

            //4.Verificar el tipo de usuario si puede ingresar o mo
            if(!allowedUserTypes.includes(decoded.userType)){
                return res.json({message:"Access denied"});
            }
           

            next();
        } catch (error) {
            console.log("error" + error)
        }
    };

    
};