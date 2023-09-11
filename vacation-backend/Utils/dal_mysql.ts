import mysql from "mysql";
import config from "./Config";

// =================================
// DAL MYSQL
// =================================

class Database {
  private connection: mysql.Pool;
  constructor() {
    this.connection = mysql.createPool({
      host: config.mySQLhost,
      user: config.mySQLuser,
      password: config.mySQLpass,
      database: config.mySQLdatabase,
    });
    console.log("SQL connected");
  }

  // Execute an SQL query with the given parameters
  public async execute(sql: string, params: any[]): Promise<any> {
    try {
      const res = await new Promise<any>((resolve, reject) => {
        this.connection.query(sql, params, (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(res);
        });
      });
      return res;
    } catch (err) {
      console.error("Error executing SQL query:", err);
      throw err;
    }
  }
}

const database = new Database();
export default database;
