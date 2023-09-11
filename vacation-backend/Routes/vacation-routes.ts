import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { getAllVacationsAsync, getOneVacationAsync, addVacationAsync,  updateVacationAsync, deleteVacationAsync} from "../Logic/vacation-logic";
import errorsHelper from "../Helpers/errors-helper";
import verifyAdmin from "../MiddleWare/verify-admin";
import verifyLoggedIn from "../MiddleWare/verify-logged-in";
import VacationModel from "../Models/Vacation";
import { configureFileUpload, safeDelete} from '../Helpers/files-helper'; 

// ==============================================
// ROUTER: Vacation Routes
// ==============================================

const router = express.Router();
const upload = configureFileUpload(); 

// Route for getting all vacations
router.get("/", verifyLoggedIn, async (req: Request, res: Response) => {
  try {
    const id = parseInt((req.headers.userDetails as { id?: string })?.id || "", 10);
    const vacations = await getAllVacationsAsync(id);
    res.status(200).json(vacations); 
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

// Route for getting a specific vacation by UUID
router.get("/:uuid", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const uuid = req.params.uuid;
    const vacation = await getOneVacationAsync(uuid);
    res.status(200).json(vacation); 
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

// Route for adding a new vacation
router.post("/add", verifyAdmin, upload.single("image"), async (req: Request, res: Response) => {
  try {
    const vacation = req.body as VacationModel;
    if (!req.file) return res.status(400).send("Missing image");
    vacation.imageName = req.file.filename;
    const addedVacation = await addVacationAsync(vacation); 
    res.status(201).json(addedVacation);
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

// Route for updating a vacation by UUID
router.patch("/:uuid", verifyAdmin, upload.single("image"), async (req: Request, res: Response) => {
  try {
    const uuid = req.params.uuid;
    const vacation = req.body as VacationModel;
    vacation.uuid = uuid;

    let oldImageName = null;
    
    const currentVacation = await getOneVacationAsync(uuid);
    if (currentVacation) {
      oldImageName = currentVacation.imageName; // Retrieve old image name
    }

    // Check if there's a new image
    if (req.file) {
      vacation.imageName = req.file.filename;
    } else if (oldImageName) {
      vacation.imageName = oldImageName; // If no new image, retain the old image name
    }

    const updatedVacation = await updateVacationAsync(vacation);

    // Only delete the old image if a new one has been uploaded
    if (oldImageName && req.file) {
      safeDelete(path.join(__dirname, "..", "images", "vacations", oldImageName));
    }

    if (!updatedVacation) return res.status(404).send("Vacation not found");
    res.status(200).json(updatedVacation);
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});


// Route for deleting a vacation by UUID
router.delete("/:uuid", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const uuid = req.params.uuid;
    const imageName = await deleteVacationAsync(uuid);

    if (!imageName) {
      return res.status(404).send("Vacation not found");
    }

    res.sendStatus(204); // Use 204 status for successful deletion (No Content)
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

// Route for serving vacation images
router.get("/images/:imageName", async (req: Request, res: Response) => {
  try {
    const imageName = req.params.imageName;
    const imageFile = path.join(__dirname, "..", "images/vacations", imageName); // Use the correct directory path
    if (!fs.existsSync(imageFile))
      return res.status(404).send("Image not found"); // Use 404 status for image not found

    res.sendFile(imageFile);
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});
export default router;

