import express from "express";
import customersController from "../controllers/customersController.js";
// Router() nos ayuda a colocar los metodos
// que tendra mi ruta
const router = express.Router();

router
  .route("/")
  .get(customersController.getcustomers)
  .post(customersController.createcustomers);

router
  .route("/:id")
  .get(customersController.getcustomerById) 
  .put(customersController.updatecustomers)
  .delete(customersController.deletecustomers);

export default router;
