import { v4 as uuid } from "uuid";
import bcryptHelper from "../Helpers/bcrypt-helper";
import dal_mysql from "../Utils/dal_mysql";
import jwtHelper from "../Helpers/jwt-helper";
import UserModel from "../Models/Users";
import CredentialsModel from "../Models/Credentials";

// ==============================
// FUNCTIONS FOR AUTH LOGIC
// ==============================

// Register a new user and return user with token on success
async function registerAsync(user: UserModel) {
  const hashedPassword = await bcryptHelper.hash(user.password);
  if (!hashedPassword) return null;

  user.password = hashedPassword;
  user.uuid = uuid();

  const isExistQuery = `SELECT email FROM Users WHERE email = ?`;
  const checkIfUserExist = await dal_mysql.execute(isExistQuery, [user.email]);
  if (checkIfUserExist.length !== 0) return null;

  const sql = `INSERT INTO Users (uuid, firstName, lastName, email, password, isAdmin) VALUES (?, ?, ?, ?, ?, DEFAULT)`;
  const info = await dal_mysql.execute(sql, [user.uuid, user.firstName, user.lastName, user.email, user.password]);

  user.token = jwtHelper.getNewToken(user);
  user.id = info.insertId;
  return user;
}

// Authenticate a user and return user details with token on success
async function loginAsync(credentials: CredentialsModel) {
  const isUserExist = await checkUser(credentials);
  if (!isUserExist) return null;

  const hashedPassword = isUserExist.password;
  const comparedPassword = await bcryptHelper.compare(credentials.password, hashedPassword);
  if (!comparedPassword) return null;

  const sql = `SELECT id, uuid, firstName, lastName, email, isAdmin FROM Users WHERE email = ?`;
  const users = await dal_mysql.execute(sql, [credentials.email]);
  if (users.length === 0) return null;

  const user = users[0];
  user.token = jwtHelper.getNewToken(user);
  return user;
}

// Helper function to check if a user exists based on email and password
async function checkUser(credentials: CredentialsModel) {
  const isExistQuery = `SELECT email, password FROM Users WHERE email = ?`;
  const checkIfUserExist = await dal_mysql.execute(isExistQuery, [credentials.email]);
  if (!checkIfUserExist || checkIfUserExist.length === 0) return null;
  return checkIfUserExist[0];
}

// Helper function to check if an email already exists in the database
async function checkEmailAsync(email: string) {
  const isExistQuery = `SELECT email FROM Users WHERE email = ?`;
  const checkIfEmailExist = await dal_mysql.execute(isExistQuery, [email]);
  return checkIfEmailExist && checkIfEmailExist.length !== 0;
}


// ==========================
// EXPORTED MODULE FUNCTIONS
// ==========================


export {
  registerAsync,
  loginAsync,
  checkEmailAsync
};






