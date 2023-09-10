import dal_mysql from "../Utils/dal_mysql";
import path from "path";
import { safeDelete } from "../Helpers/files-helper";
import { v4 as uuid } from "uuid";
import VacationModel from "../Models/Vacation";

// ==============================
// FUNCTIONS FOR VACATIONS LOGIC
// ==============================

// Retrieve all vacations with the count of followers
async function getAllVacationsAsync(userId: number) {
  const sql = `
    SELECT Vacations.vacationId, Vacations.uuid, Vacations.description, Vacations.destination, 
    Vacations.startDate, Vacations.endDate, Vacations.price, Vacations.imageName,
    COUNT(followers.vacationId) AS followersCount
    FROM Vacations 
    LEFT JOIN followers on Vacations.vacationId = followers.vacationId 
    GROUP BY Vacations.vacationId, Vacations.uuid, Vacations.description, 
    Vacations.destination, Vacations.startDate, Vacations.endDate, 
    Vacations.price, Vacations.imageName
    ORDER BY followersCount DESC
  `;

  const vacations = await dal_mysql.execute(sql, [userId]);
  return vacations;
}

// Retrieve a single vacation by UUID
async function getOneVacationAsync(uuid: string) {
  const sql = `SELECT * FROM Vacations WHERE uuid = ?`;

  const vacation = await dal_mysql.execute(sql, [uuid]);
  return vacation[0];
}

// Add a new vacation
async function addVacationAsync(vacation: VacationModel) {
  vacation.uuid = uuid();
  const sql = `INSERT INTO Vacations(uuid, description, destination, startDate, endDate, price, imageName)
    VALUES(?, ?, ?, ?, ?, ?, ?)`;
  const info = await dal_mysql.execute(sql, [
    vacation.uuid,
    vacation.description,
    vacation.destination,
    vacation.startDate,
    vacation.endDate,
    vacation.price,
    vacation.imageName
  ]);
  vacation.vacationId = info.insertId;
  return vacation;
}

// Update an existing vacation
async function updateVacationAsync(vacation: VacationModel) {

  const sql = `UPDATE Vacations SET description = ?, destination = ?, startDate = ?, endDate = ?, price = ?, imageName = ? WHERE uuid = ?`;
  const info = await dal_mysql.execute(sql, [
    vacation.description,
    vacation.destination,
    vacation.startDate,
    vacation.endDate,
    vacation.price,
    vacation.imageName,
    vacation.uuid
  ]);

  return info.affectedRows === 0 ? null : vacation;
}



// Delete a vacation
async function deleteVacationAsync(uuid: string): Promise<string | null> {
  const getVacationQuery = `SELECT imageName FROM Vacations WHERE uuid = ?`;
  const existVacation = await dal_mysql.execute(getVacationQuery, [uuid]);
  if (existVacation.length === 0) return null;
  const { imageName } = existVacation[0];

  const sql = `DELETE FROM Vacations WHERE uuid = ?`;
  await dal_mysql.execute(sql, [uuid]);

  if (imageName) {
    // Delete the image from the directory
    safeDelete(path.join(__dirname, "..", "images", "vacations", imageName));
  }
  return imageName;
}

// ==========================
// EXPORTED MODULE FUNCTIONS
// ==========================

export {
  getAllVacationsAsync,
  getOneVacationAsync,
  addVacationAsync,
  updateVacationAsync,
  deleteVacationAsync
};



