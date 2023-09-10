import request from "supertest";
import server from "../server"; // Assuming your app instance is exported as 'server'

describe("App routes", () => {
  it("should respond with 200 status for GET /api/users", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
  });

  it("should respond with 404 status for GET /non-existing-route", async () => {
    const response = await request(server).get("/non-existing-route");
    expect(response.status).toBe(404);
  });

 
});
