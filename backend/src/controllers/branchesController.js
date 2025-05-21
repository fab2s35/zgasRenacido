//Array de metodos (C R U D)
const branchesController = {};
import branchesModel from "../models/branches.js";

// SELECT
branchesController.getbranches = async (req, res) => {
  const branches = await branchesModel.find();
  res.json(branches);
};

// SELECT (una sola sucursal)
branchesController.getBranchById = async (req, res) => {
  try {
    const branch = await branchesModel.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: "Sucursal no encontrada" });
    }
    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la sucursal", error });
  }
};

// INSERT
branchesController.createbranches = async (req, res) => {
  const { name, address, birthday, schedule, telephone } = req.body;
  const newbranches = new branchesModel({ name, address, birthday, schedule, telephone });
  await newbranches.save();
  res.json({ message: "branches save" });
};

// DELETE
branchesController.deletebranches = async (req, res) => {
const deletedbranches = await branchesModel.findByIdAndDelete(req.params.id);
  if (!deletedbranches) {
    return res.status(404).json({ message: "branches dont find" });
  }
  res.json({ message: "branches deleted" });
};

// UPDATE
branchesController.updatebranches = async (req, res) => {
  // Solicito todos los valores
  const { name, address, birthday, schedule, telephone  } = req.body;
  // Actualizo
  await branchesModel.findByIdAndUpdate(
    req.params.id,
    {
      name, address, birthday, schedule, telephone 
    },
    { new: true }
  );
  // muestro un mensaje que todo se actualizo
  res.json({ message: "branches update" });
};

export default branchesController;
