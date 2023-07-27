import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import User from "../models/User";
import UesrAPi from "../apis/UserApi";
import TodoApi from "../apis/TodoApi";

test("should be able to add a new todo", async ({ page, request, context }) => {
  const user = new User();

  const response = await new UesrAPi().signup(request, user);

  const responseBody = await response.json();
  const access_token = responseBody.access_token;
  const firstName = responseBody.firstName;
  const userID = responseBody.userID;

  await context.addCookies([
    {
      name: "access_token",
      value: access_token,
      url: "https://todo.qacart.com",
    },
    { name: "firstName", value: firstName, url: "https://todo.qacart.com" },
    { name: "userID", value: userID, url: "https://todo.qacart.com" },
  ]);

  await page.goto("/todo/new");

  await page.type("[data-testid=new-todo]", "Learn playwright");
  await page.click("[data-testid=submit-newTask]");

  const todoItem = page.locator("[data-testid=todo-item]");
  expect(await todoItem.innerText()).toEqual("Learn playwright");
});

test("should be able to delete a todo", async ({ page, request, context }) => {
  const user = new User();

  const response = await new UesrAPi().signup(request, user);

  const responseBody = await response.json();
  const access_token = responseBody.access_token;
  const firstName = responseBody.firstName;
  const userID = responseBody.userID;

  user.setAccessToken(access_token);
  user.setUserID(userID);

  await context.addCookies([
    {
      name: "access_token",
      value: access_token,
      url: "https://todo.qacart.com",
    },
    { name: "firstName", value: firstName, url: "https://todo.qacart.com" },
    { name: "userID", value: userID, url: "https://todo.qacart.com" },
  ]);

  await new TodoApi().addTodo(request, user);

  await page.goto("/todo");

  await page.click("[data-testid=delete]");
  const noTodosMessage = page.locator("[data-testid=no-todos]");
  await expect(noTodosMessage).toBeVisible();
});
