import express, { Request, Response } from "express";
import verifyLoggedIn from "../MiddleWare/verify-logged-in";
import { addFollower, removeFollower, getFollowStatus, getFollowersNumber, getAllFollowedVacations } from "../Logic/followers-logic";
import { getAllVacationsAsync } from "../Logic/vacation-logic";
import errorsHelper from "../Helpers/errors-helper";

// ==============================================
// ROUTER: Follower Routes
// ==============================================

const router = express.Router();
router.use(verifyLoggedIn);

// Route to add a follower to a vacation
router.post("/follow", async (req: Request, res: Response) => {
  try {
    const { id, vacationId } = req.body;
    if (!id || !vacationId)
      return res
        .status(401)
        .send("Missing details to add a vacation follow!");

    // Check if the user is already following this vacation
    const isFollow = await getFollowStatus(id, vacationId);
    if (isFollow)
      return res
        .status(400)
        .send("You are already following this vacation");

    const newFollow = await addFollower(id, vacationId);
    if (!newFollow)
      return res
        .status(400)
        .send("An error occurred while trying to follow this vacation");

    const vacations = await getAllVacationsAsync(id);
    res.status(201).json(vacations);
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

// Route to remove a follower from a vacation
router.delete("/remove", async (req: Request, res: Response) => {
  try {
    const { id, vacationId } = req.body;
    console.log(req.body); // Check what you are receiving in the request
    if (!id || !vacationId)
      return res
        .status(401)
        .send("Missing details to remove a vacation follow!");

    const removingFollow = await removeFollower(id, vacationId);
    if (!removingFollow)
      return res
        .status(400)
        .send("You are already not following this vacation");

    const vacations = await getAllVacationsAsync(id);
    res.status(201).json(vacations);
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

// Route to check the follow status of a vacation
router.post("/status", async (req: Request, res: Response) => {
  try {
    const { id, vacationId } = req.body;
    if (!id || !vacationId)
      return res.status(401).send("Missing details to find follow status");

    const isFollow = await getFollowStatus(id, vacationId);
    res.status(201).json({ isFollow });
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

// Route to get the number of followers for a vacation
router.post("/followers", async (req: Request, res: Response) => {
  try {
    const { id, vacationId } = req.body;
    if (!id || !vacationId)
      return res.status(401).send("Missing details to find followers number");

    const followers = await getFollowersNumber(vacationId);
    res.status(201).json(followers);
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

// Route to get all vacations that a user is following
router.get("/followed/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const followedVacations = await getAllFollowedVacations(Number(id));
    res.status(200).json({ followedVacations });
  } catch (err) {
    res.status(500).send(errorsHelper.getError(err));
  }
});

export default router;


