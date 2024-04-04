import { describe, test, expect, afterAll } from "vitest";
import APIClient from "../src/util/APIClient";
import mocks from "./mocks/mockObjects";
import { clearDB } from "../../server/prisma/clearAndSeedDB";
const apiClient = new APIClient();

describe("APIClient tests", () => {
  afterAll(async () => {
    clearDB();
  });
  test("Client is able to call on /hello", async () => {
    const response = await apiClient.get<string>("/hello");
    expect(response?.status).toBe(200);
    expect(response?.data).toBe("Hello world!!!");
  });
  //TODO: @mdwiltfong -> Is it correct that the response can possible be undefined? This is because there is a chance that the function can throw an error.
  test("Client is able to register user successfully", async () => {
    const response = await apiClient.post("/auth/register", mocks.mockUsers[0]);
    expect(response?.status).toBe(200);
  });
  test("Client fails to register a user when they provide an already existing email", async () => {
    try {
      await apiClient.post("/auth/register", mocks.mockUsers[0]);
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
    expect(true).toBe(false);
  });
  test("Client is able to login successfully", async () => {
    const response = await apiClient.post("/auth/login", {
      userNameField: "test@test.com",
      passWordField: "password",
    });
    expect(response?.status).toBe(200);
  });
  test("Client fails to login", async () => {
    try {
      mocks.mockUsers[0].password = "cheese";
      await apiClient.post("/auth/login", {
        userNameField: "test@test.com",
        passWordField: mocks.mockUsers[0].password,
      });
    } catch (error) {
      console.log("test");
      expect(error).not.toBeUndefined();
    }
    expect(true).toBe(false);
  });
});
