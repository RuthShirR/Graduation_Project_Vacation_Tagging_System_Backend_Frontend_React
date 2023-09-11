import express from "express";
import { registerAsync, loginAsync, checkEmailAsync } from "../Logic/auth-logic";
import UserModel from "../Models/Users";
import CredentialsModel from "../Models/Credentials";

// ==============================================
// ROUTER: Auth Routes
// ==============================================

const router = express.Router();

// Handle user registration
router.post("/register", async (req: express.Request, res: express.Response) => {
  const userData = req.body as UserModel;
  const registeredUser = await registerAsync(userData);
  if (!registeredUser) {
    return res.status(400).json({ message: "Failed to register user" });
  }
  return res.json(registeredUser);
});

// Authenticate and log in a user
router.post("/login", async (req: express.Request, res: express.Response) => {
  const credentials = req.body as CredentialsModel;
  const user = await loginAsync(credentials);
  if (!user) {
    return res.status(401).json({ message: "Incorrect username or password" });
  }
  return res.json({
    id: user.id,
    uuid: user.uuid,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    isAdmin: user.isAdmin,
    token: user.token,
  });
});

// Check the availability of an email
router.get("/check-email/:email", async (req: express.Request, res: express.Response) => {
  const email = req.params.email;
  const isEmailTaken = await checkEmailAsync(email);
  return res.json({ isEmailTaken });
});

export default router;


