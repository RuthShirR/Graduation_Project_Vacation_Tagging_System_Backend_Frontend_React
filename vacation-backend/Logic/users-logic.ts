import dal_mysql from "../Utils/dal_mysql";

// ==============================
// FUNCTIONS FOR USERS LOGIC
// ==============================

// get single user by UUID
async function getOneUserAsync(uuid: string) {
  const sql = `SELECT uuid, firstName, lastName, email, isAdmin FROM Users WHERE uuid = ?`;
  const users = await dal_mysql.execute(sql, [uuid]);
  return users[0];
}

// get all users 
async function getAllUsersAsync() {
  const sql = `SELECT uuid, firstName, lastName, email, isAdmin FROM Users`;
  const users = await dal_mysql.execute(sql, []);
  return users;
}

// ==========================
// EXPORTED MODULE FUNCTIONS
// ==========================

export {
  getOneUserAsync,
  getAllUsersAsync,
};

