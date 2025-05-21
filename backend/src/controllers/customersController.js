//Array de metodos (C R U D)
const customersController = {};
import customersModel from "../models/customers.js";

// SELECT
customersController.getcustomers = async (req, res) => {
  const customers = await customersModel.find();
  res.json(customers);
};

// SELECT (un solo cliente)
customersController.getcustomerById = async (req, res) => {
  try {
    const customer = await customersModel.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cliente", error });
  }
};


// INSERT
customersController.createcustomers = async (req, res) => {
  const { name, lastName, birthday, email, password, telephone, dui } = req.body;
  const newcustomers = new customersModel({ name, lastName, birthday, email, password, telephone, dui});
  await newcustomers.save();
  res.json({ message: "customer save" });
};

// DELETE
customersController.deletecustomers = async (req, res) => {
const deletedcustomers = await customersModel.findByIdAndDelete(req.params.id);
  if (!deletedcustomers) {
    return res.status(404).json({ message: "customer dont find" });
  }
  res.json({ message: "customer deleted" });
};

// UPDATE
customersController.updatecustomers = async (req, res) => {
  // Solicito todos los valores
  const { name, lastName, birthday, email, password, telephone, dui  } = req.body;
  // Actualizo
  await customersModel.findByIdAndUpdate(
    req.params.id,
    {
        name, 
        lastName, 
        birthday,
         email, 
         password, 
         telephone, 
         dui 
    },
    { new: true }
  );
  // muestro un mensaje que todo se actualizo
  res.json({ message: "customer update" });
};

export default customersController;
