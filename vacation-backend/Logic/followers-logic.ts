import dal_mysql from "../Utils/dal_mysql";

// ==============================
// FUNCTIONS FOR FOLLOWERS LOGIC
// ==============================

// Add a follower to a vacation
async function addFollower(userId: number, vacationId: number) {
  const sql = 'INSERT INTO Followers VALUES(?, ?)';
  const follow = await dal_mysql.execute(sql, [userId, vacationId]);
  return follow.affectedRows === 0 ? null : follow;
}

// Remove a follower from a vacation
async function removeFollower(userId: number, vacationId: number) {
  const sql = 'DELETE FROM Followers WHERE userId = ? AND vacationId = ?';
  const removingFollow = await dal_mysql.execute(sql, [userId, vacationId]);
  return removingFollow.affectedRows === 0 ? null : removingFollow;
}

// Check if a user is following a vacation
async function getFollowStatus(userId: number, vacationId: number) {
  const sql = `SELECT EXISTS(SELECT 1 FROM Followers WHERE userId = ? AND vacationId = ?) AS isFollow`;
  const follow = await dal_mysql.execute(sql, [userId, vacationId]);
  return follow[0].isFollow === 1;
}
// Returns all vacations that a user is following
async function getAllFollowedVacations(userId: number) {
  const sql = `SELECT vacationId FROM Followers WHERE userId = ?`;
  const followedVacations = await dal_mysql.execute(sql, [userId]);
  return followedVacations.map((follow: any)=> follow.vacationId);
}

// Get the number of followers for a vacation
async function getFollowersNumber(vacationId: number) {
  const sql = `SELECT COUNT(vacationId) AS followersNumber FROM Followers WHERE vacationId = ?`;
  const followers = await dal_mysql.execute(sql, [vacationId]);
  return followers[0].followersNumber;
}

// ==========================
// EXPORTED MODULE FUNCTIONS
// ==========================

export {
  addFollower,
  removeFollower,
  getFollowStatus,
  getFollowersNumber,
  getAllFollowedVacations
};
