class Config {
  public isDevelopment = true;
  public WebPort = process.env.NODE_ENV === "test" ? 4001 : 4000;
  public mySQLhost = process.env.MYSQL_HOST || "localhost";
  public mySQLuser = "root";
  public mySQLpass =  "12345678";
  public mysql_port = 3306;
  public mySQLdatabase = "VacationsDB";
  public jwtKey = "GoodVacation";
}
const config = new Config();
export default config;


