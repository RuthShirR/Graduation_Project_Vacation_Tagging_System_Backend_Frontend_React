import supertest from "supertest";
import server, { closeServer, startServer } from "../server";
import UserModel from "../Models/Users";
import database from "../Utils/dal_mysql";

describe("Auth Logic Test", () => {
    let testUser: UserModel;
  
    beforeAll(async () => {
      // Register a new user and store it in the testUser variable
      const response = await supertest(server)
        .post("/api/auth/register")
        .send({
          firstName: "ruth",
          lastName: "shir",
          email: "ruth.shir1212@example.com",
          password: "123456",
        });
  
      testUser = response.body;
    });
    beforeEach(() => {
    
        startServer();
      });
      afterEach(async () => {
        // Stop the server and clean up the database after each test
        closeServer();
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for server to close 
      });
    it("should register a new user and succeed", async () => {
        const response = await supertest(server)
          .post("/api/auth/register")
          .send({
            firstName: "ruth",
            lastName: "shir",
            email: "ruth.shir1255@example.com", 
            password: "123456",
          });
      
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("uuid");
        expect(response.body).toHaveProperty("token");
      
        // Store the registered user for subsequent tests
        testUser = response.body;
      });
      

  // Register with an existing email and fail
  it("should not register user with existing email", async () => {
    const response = await supertest(server)
      .post("/api/auth/register")
      .send({
        firstName: "ruth",
        lastName: "shir",
        email: "ruth.shir1212@example.com",
        password: "123456",
      });

    expect(response.status).toBe(400);
  });

  // Login with correct details and succeed
  it("should login with correct details and succeed", async () => {
    const response = await supertest(server)
      .post("/api/auth/login")
      .send({
        email: testUser.email, // Use the email from the registered user
        password: "123456",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

 
 // Logout test
it("should logout successfully", async () => {
   
  });
  

  // Login with incorrect details and fail
  it("should not login with incorrect details", async () => {
    const response = await supertest(server)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "1234",
      });

    expect(response.status).toBe(401);
  });

  // Clean up: Delete the test user from the database
  afterAll(async () => {
    
   // Delete the user using the database instance
   await database.execute("DELETE FROM Users WHERE email = ?", [testUser.email]);
    await new Promise((resolve) => setTimeout(resolve, 500)); 
  });
});


