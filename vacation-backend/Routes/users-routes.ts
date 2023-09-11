import express, { Request, Response } from "express";
import { getOneUserAsync } from "../Logic/users-logic";
import { getAllUsersAsync } from "../Logic/users-logic"; 
import errorsHelper from "../Helpers/errors-helper";

// ==============================================
// ROUTER: Users Routes
// ==============================================

const router = express.Router();

// Route for getting a user by UUID
router.get("/:uuid", async (req: Request, res: Response) => {
  try {
    const uuid = req.params.uuid;
    const user = await getOneUserAsync(uuid);
    if (!user) return res.status(404).send("User not found.");
    res.json(user);
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

// Route for getting all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersAsync();
    res.json(users);
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

export default router;



